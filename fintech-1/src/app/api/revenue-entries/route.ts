import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const entries = await prisma.revenueEntry.findMany({
      include: { user: true },
      orderBy: { period: 'asc' },
    })
    return NextResponse.json(entries)
  } catch (error) {
    console.error('❌ API ERROR in /api/revenue-entries:', error)
    return new NextResponse(
      JSON.stringify({ error: 'Internal server error', details: (error as Error).message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
