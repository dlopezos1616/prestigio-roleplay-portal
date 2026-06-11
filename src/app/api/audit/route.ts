import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    const date = req.nextUrl.searchParams.get("date")
    const actorId = req.nextUrl.searchParams.get("actorId")

    const where: any = {}
    if (date) {
      const start = new Date(date)
      const end = new Date(date)
      end.setDate(end.getDate() + 1)
      where.createdAt = { gte: start, lt: end }
    }
    if (actorId) where.actorId = actorId

    const logs = await db.auditLog.findMany({
      where,
      include: {
        actor: { select: { username: true, avatar: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    })
    return NextResponse.json(logs)
  } catch (error) {
    return NextResponse.json({ error: "Error fetching audit logs" }, { status: 500 })
  }
}
