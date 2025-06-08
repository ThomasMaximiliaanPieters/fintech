import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const entries = await prisma.balanceSheetEntry.findMany({
      include: { user: true },
      orderBy: { period: 'asc' },
    })

    return NextResponse.json(entries)
  } catch (error) {
    console.error('❌ API ERROR in /api/financial-entries:', error)
    return new NextResponse(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
