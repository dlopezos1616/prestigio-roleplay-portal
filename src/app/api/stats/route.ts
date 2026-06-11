import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const [totalUsers, pendingApps, approvedApps, activeTasks, totalApps] = await Promise.all([
      db.user.count(),
      db.whitelistApplication.count({ where: { status: "PENDING" } }),
      db.whitelistApplication.count({ where: { status: "APPROVED" } }),
      db.task.count({ where: { status: { in: ["TODO", "IN_PROGRESS"] } } }),
      db.whitelistApplication.count(),
    ])

    return NextResponse.json({
      totalUsers,
      pendingApps,
      approvedApps,
      rejectedApps: totalApps - approvedApps - pendingApps,
      activeTasks,
      totalApps,
    })
  } catch (error) {
    return NextResponse.json({ error: "Error fetching stats" }, { status: 500 })
  }
}
