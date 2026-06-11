import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 })
  }

  try {
    await db.notification.deleteMany({})
    await db.auditLog.deleteMany({})
    await db.galleryImage.deleteMany({})
    await db.task.deleteMany({})
    await db.whitelistApplication.deleteMany({})
    await db.user.deleteMany({})
    await db.siteConfig.deleteMany({})

    return NextResponse.json({ success: true, message: 'All data cleared' })
  } catch (error) {
    console.error('Cleanup error:', error)
    return NextResponse.json({ error: 'Cleanup failed' }, { status: 500 })
  }
}
