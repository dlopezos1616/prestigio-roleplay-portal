import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const { status, reviewerId, rejectReason } = body

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return NextResponse.json({ error: "Estado inválido" }, { status: 400 })
    }

    if (status === "REJECTED" && !rejectReason) {
      return NextResponse.json(
        { error: "Debe proporcionar un motivo de rechazo" },
        { status: 400 }
      )
    }

    const updateData: Record<string, unknown> = {
      status,
      reviewedAt: new Date(),
    }

    if (reviewerId) updateData.reviewerId = reviewerId
    if (rejectReason) updateData.rejectReason = rejectReason

    const application = await db.whitelistApplication.update({
      where: { id },
      data: updateData,
      include: {
        user: { select: { username: true, discordId: true } },
      },
    })

    // Create audit log
    if (reviewerId) {
      await db.auditLog.create({
        data: {
          actorId: reviewerId,
          action: status === "APPROVED" ? "WHITELIST_APPROVED" : "WHITELIST_REJECTED",
          entityType: "WhitelistApplication",
          entityId: id,
          metadata: JSON.stringify({
            userId: application.userId,
            attemptNumber: application.attemptNumber,
            rejectReason: rejectReason || null,
          }),
        },
      })
    }

    // Create notification for the user
    await db.notification.create({
      data: {
        userId: application.userId,
        type: status === "APPROVED" ? "WHITELIST_APPROVED" : "WHITELIST_REJECTED",
        payload: JSON.stringify({
          applicationId: id,
          rejectReason: rejectReason || null,
        }),
      },
    })

    return NextResponse.json(application)
  } catch (error) {
    console.error("Error updating application:", error)
    return NextResponse.json({ error: "Error updating application" }, { status: 500 })
  }
}
