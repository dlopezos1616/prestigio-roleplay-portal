import NextAuth, { type NextAuthOptions } from "next-auth"
import DiscordProvider from "next-auth/providers/discord"
import { db } from "@/lib/db"

const isProd = process.env.NODE_ENV === "production"

export const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      authorization: { params: { scope: "identify guilds guilds.members.read" } },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  // Minimal, well-tested cookie config. In production, NextAuth prefixes
  // cookies with __Secure- automatically when secure:true is set.
  // We use the sameSite:'lax' default which is the safest cross-site setting
  // that still allows the OAuth callback redirect to set the cookie.
  cookies: {
    sessionToken: {
      name: isProd ? `__Secure-next-auth.session-token` : `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: isProd,
      },
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "discord" && account.access_token) {
        try {
          // user.id is the Discord user ID returned by the Discord provider
          await db.user.upsert({
            where: { discordId: user.id },
            update: {
              username: user.name || "Unknown",
              avatar: user.image || null,
              accessToken: account.access_token,
              refreshToken: account.refresh_token || null,
            },
            create: {
              discordId: user.id,
              username: user.name || "Unknown",
              avatar: user.image || null,
              accessToken: account.access_token,
              refreshToken: account.refresh_token || null,
            },
          })
        } catch (e) {
          // Log clearly so it shows in Vercel function logs
          console.error("[auth] signIn: failed to upsert user in DB:", {
            discordId: user.id,
            error: e instanceof Error ? e.message : String(e),
          })
          // IMPORTANT: do not block sign-in if DB write fails — JWT still works,
          // the user can still be authenticated via the JWT token alone.
        }
      }
      return true
    },
    async jwt({ token, account, user }) {
      // On first sign-in: account & user are populated. Persist Discord id + tokens.
      if (account && user) {
        token.discordId = user.id
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
      }
      // Always refresh role/dbId from DB so role changes by admins are reflected
      if (token.discordId) {
        try {
          const dbUser = await db.user.findUnique({ where: { discordId: token.discordId } })
          if (dbUser) {
            token.role = dbUser.role
            token.dbId = dbUser.id
          } else {
            // User not in DB yet (e.g., tables were just created) — default role
            token.role = "USER"
          }
        } catch (e) {
          console.error("[auth] jwt: failed to fetch user from DB:", e instanceof Error ? e.message : String(e))
          // Default role so the session still has a role field
          token.role = "USER"
        }
      }
      return token
    },
    async session({ session, token }) {
      // In JWT mode the second arg is `token`, NOT `user`.
      if (session.user && token) {
        (session.user as Record<string, unknown>).role = token.role
        (session.user as Record<string, unknown>).discordId = token.discordId
        (session.user as Record<string, unknown>).dbId = token.dbId
        ;(session.user as Record<string, unknown>).id = token.discordId
      }
      return session
    },
  },
  pages: {
    signIn: "/",
  },
  secret: process.env.NEXTAUTH_SECRET,
  logger: {
    error(code, ...message) {
      console.error(`[next-auth][error][${code}]`, ...message)
    },
    warn(code) {
      console.warn(`[next-auth][warn][${code}]`)
    },
    debug(code, ...message) {
      console.log(`[next-auth][debug][${code}]`, ...message)
    },
  },
  debug: true,
}

export default NextAuth(authOptions)
