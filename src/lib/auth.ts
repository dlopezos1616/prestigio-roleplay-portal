import NextAuth, { type NextAuthOptions } from "next-auth"
import DiscordProvider from "next-auth/providers/discord"
import { db } from "@/lib/db"

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
          console.error("Error saving user:", e)
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
          }
        } catch (e) {
          console.error("Error fetching user in jwt callback:", e)
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
        // also expose id for /api/auth/session route that reads session.user.id
        ;(session.user as Record<string, unknown>).id = token.discordId
      }
      return session
    },
  },
  pages: {
    signIn: "/",
  },
  secret: process.env.NEXTAUTH_SECRET,
}

export default NextAuth(authOptions)
