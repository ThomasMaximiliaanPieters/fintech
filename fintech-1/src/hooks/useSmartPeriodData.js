// hooks/useSmartPeriodData.js

'use client'

import { useEffect, useState } from 'react'
import { monthsAgoDate, startOfMonth } from '@/utils/finance'

export function useSmartPeriodData(period) {
  const [current, setCurrent] = useState([])
  const [previous, setPrevious] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch('/api/financial-entries')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Request failed: ${res.status}`)
        }
        return res.json()
      })
      .then((entries) => {
        const now = new Date()
        const periodMonths = period.current === 'ALL' ? 36 : parseInt(period.current)

        const currentStart = startOfMonth(monthsAgoDate(periodMonths))

        let previousEntries = []
        let previousStart
        let previousEnd

        if (period.compare === 'previous') {
          previousStart = startOfMonth(monthsAgoDate(periodMonths * 2))
          previousEnd = startOfMonth(monthsAgoDate(periodMonths))
        } else if (period.compare === 'last_year') {
          previousStart = startOfMonth(monthsAgoDate(periodMonths + 12))
          previousEnd = startOfMonth(monthsAgoDate(12))
        }

        const currentEntries = entries.filter((e) => {
          const d = new Date(e.period)
          return d >= currentStart && d <= now
        })

        if (previousStart && previousEnd) {
          previousEntries = entries.filter((e) => {
            const d = new Date(e.period)
            return d >= previousStart && d < previousEnd
          })
        }

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
