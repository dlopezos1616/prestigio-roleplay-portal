import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

/**
 * Diagnostic endpoint to debug auth/session issues in production.
 * DO NOT leave this enabled in production long-term — it exposes internal state.
 */
export async function GET() {
  const session = await getServerSession(authOptions)

  // Test DB connection + tables
  let dbStatus: Record<string, unknown> = { ok: false }
  try {
    const userCount = await db.user.count()
    dbStatus = {
      ok: true,
      userCount,
      tablesExist: true,
    }
  } catch (e) {
    dbStatus = {
      ok: false,
      error: e instanceof Error ? e.message : String(e),
      tablesExist: false,
      hint: "Las tablas de Prisma no existen en la base de datos. Ejecuta `bun run db:push` con la DATABASE_URL de producción.",
    }
  }

  // Environment check
  const envCheck = {
    NODE_ENV: process.env.NODE_ENV,
    NEXTAUTH_URL_set: !!process.env.NEXTAUTH_URL,
    NEXTAUTH_URL_value: process.env.NEXTAUTH_URL || null,
    NEXTAUTH_SECRET_set: !!process.env.NEXTAUTH_SECRET,
    DISCORD_CLIENT_ID_set: !!process.env.DISCORD_CLIENT_ID,
    DISCORD_CLIENT_SECRET_set: !!process.env.DISCORD_CLIENT_SECRET,
    DATABASE_URL_set: !!process.env.DATABASE_URL,
    DATABASE_URL_provider: process.env.DATABASE_URL?.startsWith("postgresql")
      ? "postgresql"
      : process.env.DATABASE_URL?.startsWith("file:")
        ? "sqlite"
        : "unknown",
  }

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    session: session
      ? {
          hasSession: true,
          user: session.user
            ? {
                name: session.user.name,
                email: session.user.email,
                hasImage: !!session.user.image,
                id: (session.user as Record<string, unknown>).id ?? null,
                role: (session.user as Record<string, unknown>).role ?? null,
                discordId: (session.user as Record<string, unknown>).discordId ?? null,
                dbId: (session.user as Record<string, unknown>).dbId ?? null,
              }
            : null,
          expires: session.expires,
        }
      : { hasSession: false },
    database: dbStatus,
    env: envCheck,
  })
}
