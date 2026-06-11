import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()

    const user = await db.user.update({
      where: { id },
      data: body,
    })
    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json({ error: "Error updating user" }, { status: 500 })
  }
}
