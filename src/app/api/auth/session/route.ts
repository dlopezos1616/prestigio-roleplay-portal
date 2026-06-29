import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({ user: null })
  }

  // The session callback in auth.ts already attaches role/discordId/dbId
  // to session.user via the JWT token. No extra DB lookup needed here.
  const su = session.user as Record<string, unknown>

  return NextResponse.json({
    user: {
      name: su.name || null,
      email: su.email || null,
      image: su.image || null,
      role: su.role || "USER",
      discordId: su.discordId || null,
      dbId: su.dbId || null,
    },
  })
}
