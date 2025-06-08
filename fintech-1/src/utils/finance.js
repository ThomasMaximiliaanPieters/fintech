export function monthsAgoDate(months, baseDate = new Date()) {
  const d = new Date(baseDate)
  d.setMonth(d.getMonth() - months)
  return d
}

export function startOfMonth(d) {
  return new Date(d.getFullYear(), d.getMonth(), 1)
}

export function groupByMonth(entries) {
  return entries.reduce((acc, entry) => {
    const key = new Date(entry.period).toISOString().slice(0, 7)
    if (!acc[key]) acc[key] = { period: key, assets: 0, liabilities: 0, equity: 0 }
    if (entry.type === 'ASSET') acc[key].assets += entry.amount
    if (entry.type === 'LIABILITY') acc[key].liabilities += entry.amount
    if (entry.type === 'EQUITY') acc[key].equity += entry.amount
    return acc
  }, {})
}

export function percentageChange(current, previous) {
  if (previous === 0) return current === 0 ? 0 : 100
  return ((current - previous) / previous) * 100
}

export function getAllMonths(start, end) {
  const months = []
  const current = new Date(start.getFullYear(), start.getMonth(), 1)
  while (current <= end) {
    months.push(new Date(current))
    current.setMonth(current.getMonth() + 1)
  }
  return months
}

export function buildLineChartData({ current, previous, period, showPrevious }) {
  const currentMap = groupByMonth(current)
  const previousMap = groupByMonth(previous)

  const periodMonths = period.current === 'ALL' ? 36 : parseInt(period.current)
  const monthsOffset =
    period.compare === 'previous'
      ? periodMonths
      : period.compare === 'last_year'
      ? 12
      : 0

  const allDates = [...current, ...previous].map((e) => new Date(e.period))
  const firstDate = new Date(Math.min(...allDates.map((d) => d.getTime())))
  const lastDate = new Date(Math.max(...allDates.map((d) => d.getTime())))
  const fullMonths = getAllMonths(firstDate, lastDate)
  const currentStart = new Date(Math.min(...current.map((e) => new Date(e.period).getTime())))
  const months = fullMonths.filter((m) => m >= currentStart)

  return months.map((date) => {
    const key = date.toISOString().slice(0, 7)
    let prevKey
    if (monthsOffset) {
      const prevDate = new Date(date)
      prevDate.setMonth(prevDate.getMonth() - monthsOffset)
      prevKey = prevDate.toISOString().slice(0, 7)
    }

    return {
      period: key,
      date,
      dateNum: date.getTime(),
      assets: currentMap[key]?.assets || 0,
      liabilities: currentMap[key]?.liabilities || 0,
      equity: currentMap[key]?.equity || 0,
      ...(showPrevious && {
        prevAssets: previousMap[prevKey]?.assets || 0,
        prevLiabilities: previousMap[prevKey]?.liabilities || 0,
        prevEquity: previousMap[prevKey]?.equity || 0,
      }),
    }
  })
}
