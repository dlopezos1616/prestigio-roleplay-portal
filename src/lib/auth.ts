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
      // Cast to a mutable record so we can assign custom fields without TS
      // trying to interpret them as methods on the JWT type.
      const t = token as Record<string, unknown>

      // On first sign-in: account & user are populated. Persist Discord id + tokens.
      if (account && user) {
        t.discordId = user.id
        t.accessToken = account.access_token
        t.refreshToken = account.refresh_token
      }
      // Always refresh role/dbId from DB so role changes by admins are reflected
      if (t.discordId) {
        try {
          const dbUser = await db.user.findUnique({ where: { discordId: t.discordId as string } })
          if (dbUser) {
            t.role = dbUser.role
            t.dbId = dbUser.id
          } else {
            // User not in DB yet (e.g., tables were just created) — default role
            t.role = "USER"
          }
        } catch (e) {
          console.error("[auth] jwt: failed to fetch user from DB:", e instanceof Error ? e.message : String(e))
          t.role = "USER"
        }
      }
      return token
    },
    async session({ session, token }) {
      // In JWT mode the second arg is `token`, NOT `user`.
      // Cast both sides to plain records to avoid TS interpreting custom fields
      // as methods (which caused "t.role is not a function" at runtime).
      const t = token as Record<string, unknown>
      const u = session.user as Record<string, unknown> | undefined
      if (u && t) {
        u.role = t.role
        u.discordId = t.discordId
        u.dbId = t.dbId
        u.id = t.discordId
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
  },
  debug: false,
}

export default NextAuth(authOptions)
