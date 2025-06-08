'use client'

import { useEffect, useState } from 'react'
import { monthsAgoDate, startOfMonth } from '@/utils/finance'

export function useRevenuePeriodData(period) {
  const [current, setCurrent] = useState([])
  const [previous, setPrevious] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch('/api/revenue-entries')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Request failed: ${res.status}`)
        }
        return res.json()
      })
      .then((entries) => {
        const lastEntryDate = entries.length
          ? new Date(Math.max(...entries.map(e => new Date(e.period).getTime())))
          : new Date()
        const now = lastEntryDate
        const periodMonths = period.current === 'ALL' ? 36 : parseInt(period.current)

        const currentStart = startOfMonth(monthsAgoDate(periodMonths, now))

        let previousEntries = []
        let previousStart
        let previousEnd

        if (period.compare === 'previous') {
          previousStart = startOfMonth(monthsAgoDate(periodMonths * 2, now))
          previousEnd = startOfMonth(monthsAgoDate(periodMonths, now))
        } else if (period.compare === 'last_year') {
          previousStart = startOfMonth(monthsAgoDate(periodMonths + 12, now))
          previousEnd = startOfMonth(monthsAgoDate(12, now))
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
