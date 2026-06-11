import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId")
    if (!userId) {
      return NextResponse.json({ error: "userId required" }, { status: 400 })
    }

    const notifications = await db.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 20,
    })
    return NextResponse.json(notifications)
  } catch (error) {
    return NextResponse.json({ error: "Error fetching notifications" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { notificationId, userId } = body

    if (notificationId) {
      await db.notification.update({
        where: { id: notificationId },
        data: { readAt: new Date() },
      })
    } else if (userId) {
      await db.notification.updateMany({
        where: { userId, readAt: null },
        data: { readAt: new Date() },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Error updating notification" }, { status: 500 })
  }
}
