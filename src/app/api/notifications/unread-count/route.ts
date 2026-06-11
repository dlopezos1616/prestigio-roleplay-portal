import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId")
    if (!userId) {
      return NextResponse.json({ error: "userId required" }, { status: 400 })
    }

    const count = await db.notification.count({
      where: { userId, readAt: null },
    })

    return NextResponse.json({ unreadCount: count })
  } catch (error) {
    return NextResponse.json({ error: "Error fetching unread count" }, { status: 500 })
  }
}
