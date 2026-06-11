import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()

    const task = await db.task.update({
      where: { id },
      data: body,
      include: {
        assignee: { select: { username: true, avatar: true } },
      },
    })
    return NextResponse.json(task)
  } catch (error) {
    return NextResponse.json({ error: "Error updating task" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await db.task.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Error deleting task" }, { status: 500 })
  }
}
