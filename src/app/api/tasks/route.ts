import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    const date = req.nextUrl.searchParams.get("date")
    const where = date ? { date } : {}

    const tasks = await db.task.findMany({
      where,
      include: {
        assignee: { select: { username: true, avatar: true } },
      },
      orderBy: [
        { priority: "desc" },
        { createdAt: "desc" },
      ],
    })
    return NextResponse.json(tasks)
  } catch (error) {
    return NextResponse.json({ error: "Error fetching tasks" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { title, assigneeId, status, priority, dueDate, notes, date } = body

    const task = await db.task.create({
      data: {
        title,
        assigneeId: assigneeId || null,
        status: status || "TODO",
        priority: priority || "MEDIUM",
        dueDate: dueDate ? new Date(dueDate) : null,
        notes: notes || null,
        date: date || new Date().toISOString().split("T")[0],
      },
      include: {
        assignee: { select: { username: true, avatar: true } },
      },
    })
    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Error creating task" }, { status: 500 })
  }
}
