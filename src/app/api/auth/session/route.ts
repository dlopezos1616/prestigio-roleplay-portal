import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ user: null })
  }

  // Try to find the user by Discord ID from the session
  const sessionUser = session.user as Record<string, unknown> | undefined
  const discordId = (sessionUser?.id as string) || session.user?.email || ""

  const dbUser = await db.user.findUnique({
    where: { discordId },
  })

  return NextResponse.json({
    user: session.user
      ? {
          ...session.user,
          role: dbUser?.role || "USER",
          discordId: dbUser?.discordId,
          dbId: dbUser?.id,
        }
      : null,
  })
}
