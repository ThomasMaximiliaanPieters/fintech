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

    data.push({
      type: 'REVENUE',
      amount: 10000 + i * 1000,
      currency: 'EUR',
      period,
      userId: user.id,
    })

    data.push({
      type: 'PROFIT',
      amount: 3000 + i * 400,
      currency: 'EUR',
      period,
      userId: user.id,
    })
  }

  await prisma.financialEntry.createMany({ data })
  console.log('✅ Seeded 3 years of financial data up to today.')
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect())
