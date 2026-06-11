import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 })
  }

  try {
    const body = await req.json()
    const { role } = body // 'USER', 'STAFF', or 'ADMIN'

    const validRole = ['USER', 'STAFF', 'ADMIN'].includes(role) ? role : 'USER'

    // Find or create the dev user
    const devUser = await db.user.upsert({
      where: { discordId: `dev-${validRole.toLowerCase()}` },
      update: {
        username: `Dev ${validRole.charAt(0) + validRole.slice(1).toLowerCase()}`,
        role: validRole,
      },
      create: {
        discordId: `dev-${validRole.toLowerCase()}`,
        username: `Dev ${validRole.charAt(0) + validRole.slice(1).toLowerCase()}`,
        role: validRole,
        avatar: null,
      },
    })

    return NextResponse.json({
      user: {
        name: devUser.username,
        email: `${devUser.discordId}@dev.local`,
        image: devUser.avatar,
        role: devUser.role,
        discordId: devUser.discordId,
        dbId: devUser.id,
      },
    })
  } catch (error) {
    console.error('Dev login error:', error)
    return NextResponse.json({ error: 'Dev login failed' }, { status: 500 })
  }
}
