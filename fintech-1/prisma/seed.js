// prisma/seed.js

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'demo@chart.dev' },
    update: {},
    create: {
      email: 'demo@chart.dev',
      name: 'Demo User',
    },
  })

  const today = new Date()
  const startDate = new Date(today)
  startDate.setMonth(today.getMonth() - 36) // go back 3 years
  startDate.setDate(1)

  const data = []
  for (let i = 0; i < 36; i++) {
    const period = new Date(startDate)
    period.setMonth(startDate.getMonth() + i)

    const assets = 50000 + Math.random() * 20000
    const liabilities = assets * (0.4 + Math.random() * 0.2)
    const equity = assets - liabilities

    data.push({
      type: 'ASSET',
      amount: parseFloat(assets.toFixed(2)),
      currency: 'EUR',
      period,
      userId: user.id,
    })

    data.push({
      type: 'LIABILITY',
      amount: parseFloat(liabilities.toFixed(2)),
      currency: 'EUR',
      period,
      userId: user.id,
    })

    data.push({
      type: 'EQUITY',
      amount: parseFloat(equity.toFixed(2)),
      currency: 'EUR',
      period,
      userId: user.id,
    })
  }

  await prisma.balanceSheetEntry.createMany({ data })
  console.log('✅ Seeded 3 years of balance sheet data up to today.')
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect())
