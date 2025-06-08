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

  const data = []
  let assets = 50000 + Math.random() * 10000
  let currentDate = new Date(startDate)
  while (currentDate <= today) {
    const period = new Date(currentDate)

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

    // jump forward a random number of days (between 10 and 50)
    const increment = Math.floor(Math.random() * 41) + 10
    currentDate.setDate(currentDate.getDate() + increment)
  }

  await prisma.balanceSheetEntry.createMany({ data })
  console.log('✅ Seeded 2 years of balance sheet data up to today.')
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect())

