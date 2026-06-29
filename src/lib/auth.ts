import NextAuth, { type NextAuthOptions } from "next-auth"
import DiscordProvider from "next-auth/providers/discord"
import { db } from "@/lib/db"

const isProd = process.env.NODE_ENV === "production"

/**
 * Discord IDs that should be auto-promoted to ADMIN on login.
 * Set in .env as a comma-separated list:
 *   ADMIN_DISCORD_IDS=123456789,987654321
 *
 * You can find your Discord ID by enabling Developer Mode in Discord
 * (User Settings → Advanced → Developer Mode), then right-click your
 * name → Copy User ID.
 */
function getAdminDiscordIds(): string[] {
  const raw = process.env.ADMIN_DISCORD_IDS || ""
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
}

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
  // In production, NextAuth prefixes cookies with __Secure- when secure:true.
  // sameSite:'lax' is the safest setting that still allows the OAuth callback
  // redirect to set the cookie.
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
          // Check if this Discord ID is in the ADMIN_DISCORD_IDS env var
          const adminIds = getAdminDiscordIds()
          const shouldBeAdmin = adminIds.includes(user.id)

          // Find existing user to preserve their current role
          const existing = await db.user.findUnique({
            where: { discordId: user.id },
            select: { role: true },
          })

          // Determine role: env override > existing DB role > default USER
          const role = shouldBeAdmin
            ? "ADMIN"
            : existing?.role || "USER"

          await db.user.upsert({
            where: { discordId: user.id },
            update: {
              username: user.name || "Unknown",
              avatar: user.image || null,
              accessToken: account.access_token,
              refreshToken: account.refresh_token || null,
              // Promote to ADMIN if listed in env (never demote existing admins)
              ...(shouldBeAdmin ? { role: "ADMIN" } : {}),
            },
            create: {
              discordId: user.id,
              username: user.name || "Unknown",
              avatar: user.image || null,
              accessToken: account.access_token,
              refreshToken: account.refresh_token || null,
              role,
            },
          })
        } catch (e) {
          console.error("[auth] signIn: failed to upsert user in DB:", {
            discordId: user.id,
            error: e instanceof Error ? e.message : String(e),
          })
          // Don't block sign-in if DB write fails — JWT still works
        }
      }
      return true
    },

    /**
     * JWT callback — runs on sign-in and every session read.
     * Fetches the role from DB so admin role changes are reflected.
     *
     * NOTE: In JWT strategy, `user` is only present on the FIRST call
     * (right after sign-in). Subsequent calls only have `token`.
     * We use `token.sub` (the Discord ID) for subsequent lookups.
     */
    async jwt({ token, account, user }) {
      // Cast to mutable record to assign custom fields without TS
      // interpreting them as methods on the JWT type (which caused
      // "t.role is not a function" at runtime).
      const t = token as Record<string, unknown>

      // First sign-in: persist Discord ID + access tokens
      if (account && user) {
        t.discordId = user.id
        t.accessToken = account.access_token
        t.refreshToken = account.refresh_token
      }

      // Always refresh role/dbId from DB so role changes by admins
      // are reflected on the next API call
      const discordId = (t.discordId as string) || token.sub
      if (discordId) {
        try {
          const dbUser = await db.user.findUnique({
            where: { discordId },
            select: { id: true, role: true, discordId: true },
          })
          if (dbUser) {
            // Check env override for admin promotion
            const adminIds = getAdminDiscordIds()
            const isAdmin = adminIds.includes(discordId)
            t.role = isAdmin ? "ADMIN" : dbUser.role
            t.dbId = dbUser.id
            t.discordId = dbUser.discordId
          } else {
            t.role = "USER"
          }
        } catch (e) {
          console.error("[auth] jwt: failed to fetch user from DB:", e instanceof Error ? e.message : String(e))
          t.role = "USER"
        }
      }

      return token
    },

    /**
     * Session callback — attaches role/discordId/dbId from the token
     * to session.user so the client can use them.
     *
     * NOTE: In JWT strategy, the second argument is `token`, NOT `user`.
     */
    async session({ session, token }) {
      const t = token as Record<string, unknown>
      const u = session.user as Record<string, unknown> | undefined
      if (u && t) {
        u.role = t.role || "USER"
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
