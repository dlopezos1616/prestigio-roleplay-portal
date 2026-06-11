import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { z } from "zod"

const whitelistSchema = z.object({
  answer1: z.string().min(30, "La respuesta debe tener al menos 30 caracteres"),
  answer2: z.string().min(30, "La respuesta debe tener al menos 30 caracteres"),
  answer3: z.string().min(30, "La respuesta debe tener al menos 30 caracteres"),
  answer4: z.string().min(30, "La respuesta debe tener al menos 30 caracteres"),
  answer5: z.string().min(50, "La respuesta debe tener al menos 50 caracteres"),
})

export async function GET() {
  try {
    const apps = await db.whitelistApplication.findMany({
      include: {
        user: { select: { username: true, avatar: true, discordId: true } },
        reviewer: { select: { username: true } },
      },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(apps)
  } catch (error) {
    console.error("Error fetching applications:", error)
    return NextResponse.json({ error: "Error fetching applications" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { userId, answer1, answer2, answer3, answer4, answer5 } = body

    if (!userId) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const validation = whitelistSchema.safeParse({ answer1, answer2, answer3, answer4, answer5 })
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    // Check existing applications
    const existingApps = await db.whitelistApplication.findMany({
      where: { userId },
      orderBy: { attemptNumber: "desc" },
    })

    const approvedApp = existingApps.find((app) => app.status === "APPROVED")
    if (approvedApp) {
      return NextResponse.json({ error: "Ya estás en la whitelist" }, { status: 400 })
    }

    const rejectedTwice = existingApps.filter((app) => app.status === "REJECTED")
    if (rejectedTwice.length >= 2) {
      return NextResponse.json({ error: "Has agotado tus intentos de whitelist" }, { status: 400 })
    }

    const pendingApp = existingApps.find((app) => app.status === "PENDING")
    if (pendingApp) {
      return NextResponse.json({ error: "Ya tienes una solicitud pendiente" }, { status: 400 })
    }

    const attemptNumber = existingApps.length + 1
    const application = await db.whitelistApplication.create({
      data: {
        userId,
        answer1,
        answer2,
        answer3,
        answer4,
        answer5,
        attemptNumber,
        status: "PENDING",
      },
    })

    return NextResponse.json(application, { status: 201 })
  } catch (error) {
    console.error("Error submitting application:", error)
    return NextResponse.json({ error: "Error submitting application" }, { status: 500 })
  }
}
