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
  startDate.setMonth(today.getMonth() - 24) // seed last 2 years
  startDate.setDate(1)

  const data = []
  const revenueData = []
  let assets = 50000 + Math.random() * 10000
  for (let i = 0; i < 24; i++) {
    const period = new Date(startDate)
    period.setMonth(startDate.getMonth() + i)

    // introduce a mild upward trend with some month-to-month variance
    assets *= 1 + (Math.random() * 0.03 - 0.005)
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

    // revenue seed
    const subscription = 1000 + Math.random() * 200
    const services = 500 + Math.random() * 100
    const advertising = 300 + Math.random() * 80
    const other = 200 + Math.random() * 50

    revenueData.push({
      type: 'SUBSCRIPTION',
      amount: parseFloat(subscription.toFixed(2)),
      currency: 'EUR',
      period,
      userId: user.id,
    })
    revenueData.push({
      type: 'SERVICES',
      amount: parseFloat(services.toFixed(2)),
      currency: 'EUR',
      period,
      userId: user.id,
    })
    revenueData.push({
      type: 'ADVERTISING',
      amount: parseFloat(advertising.toFixed(2)),
      currency: 'EUR',
      period,
      userId: user.id,
    })
    revenueData.push({
      type: 'OTHER',
      amount: parseFloat(other.toFixed(2)),
      currency: 'EUR',
      period,
      userId: user.id,
    })
  }

  await prisma.balanceSheetEntry.createMany({ data })
  await prisma.revenueEntry.createMany({ data: revenueData })
  console.log('✅ Seeded 2 years of financial and revenue data up to today.')
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect())

