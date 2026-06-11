import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    const tag = req.nextUrl.searchParams.get("tag")
    const where = tag ? { eventTag: tag } : {}

    const images = await db.galleryImage.findMany({
      where,
      include: {
        uploadedBy: { select: { username: true } },
      },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(images)
  } catch (error) {
    return NextResponse.json({ error: "Error fetching gallery" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { url, title, description, eventTag, uploadedById } = body

    const image = await db.galleryImage.create({
      data: {
        url,
        title: title || null,
        description: description || null,
        eventTag: eventTag || null,
        uploadedById,
      },
    })
    return NextResponse.json(image, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Error uploading image" }, { status: 500 })
  }
}
