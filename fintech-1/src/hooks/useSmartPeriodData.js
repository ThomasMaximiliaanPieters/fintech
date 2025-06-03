// hooks/useSmartPeriodData.js

'use client'

import { useEffect, useState } from 'react'

function monthsAgoDate(months) {
  const d = new Date()
  d.setMonth(d.getMonth() - months)
  return d
}

export function useSmartPeriodData(period) {
  const [current, setCurrent] = useState([])
  const [previous, setPrevious] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/financial-entries')
      .then((res) => res.json())
      .then((entries) => {
        const now = new Date()
        const periodMonths = period === 'ALL' ? 36 : parseInt(period)
        const currentStart = monthsAgoDate(periodMonths)
        const previousStart = monthsAgoDate(periodMonths * 2)
        const previousEnd = monthsAgoDate(periodMonths)

        const currentEntries = entries.filter((e) => {
          const d = new Date(e.period)
          return d >= currentStart && d <= now
        })

        const previousEntries = entries.filter((e) => {
          const d = new Date(e.period)
          return d >= previousStart && d < previousEnd
        })

        setCurrent(currentEntries)
        setPrevious(previousEntries)
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setLoading(false)
      })
  }, [period])

  return { current, previous, loading }
}
