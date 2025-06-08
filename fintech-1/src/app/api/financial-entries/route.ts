import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

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

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 })
  }
  try {
    const body = await req.json()
    const entry = await prisma.balanceSheetEntry.create({
      data: {
        type: body.type,
        amount: body.amount,
        currency: body.currency ?? 'EUR',
        period: new Date(),
        userId: session.user.id,
      },
    })
    return NextResponse.json(entry)
  } catch (error) {
    console.error('❌ POST ERROR in /api/financial-entries:', error)
    return new NextResponse('Server error', { status: 500 })
  }
}
