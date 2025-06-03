// src/app/api/financial-entries/route.ts

import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const entries = await prisma.financialEntry.findMany({
    include: { user: true },
    orderBy: { period: 'asc' },
  })

  return NextResponse.json(entries)
}
