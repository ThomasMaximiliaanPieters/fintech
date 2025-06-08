
'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { useSmartPeriodData } from '@/hooks/useSmartPeriodData'
import { useMemo } from 'react'

function groupByMonth(entries) {
  return entries.reduce((acc, entry) => {
    const key = new Date(entry.period).toISOString().slice(0, 7)
    if (!acc[key]) acc[key] = { period: key, assets: 0, liabilities: 0, equity: 0 }
    if (entry.type === 'ASSET') acc[key].assets += entry.amount
    if (entry.type === 'LIABILITY') acc[key].liabilities += entry.amount
    if (entry.type === 'EQUITY') acc[key].equity += entry.amount
    return acc
  }, {})
}

function getAllMonths(start, end) {
  const months = []
  const d = new Date(start.getFullYear(), start.getMonth(), 1)
  while (d <= end) {
    months.push(new Date(d))
    d.setMonth(d.getMonth() + 1)
  }
  return months
}

export default function BarChartComponent({ period }) {
  const { current, loading } = useSmartPeriodData(period)

  const currentDataMap = useMemo(() => groupByMonth(current), [current])

  const firstDate = useMemo(() => {
    if (!current.length) return new Date()
    return new Date(Math.min(...current.map(e => new Date(e.period).getTime())))
  }, [current])

  const lastDate = new Date()

  const months = useMemo(() => getAllMonths(firstDate, lastDate), [firstDate, lastDate])

  const data = months.map((date) => {
    const key = date.toISOString().slice(0, 7)
    return {
      name: date.toLocaleString('default', { month: 'short', year: '2-digit' }),
      assets: currentDataMap[key]?.assets || 0,
      liabilities: currentDataMap[key]?.liabilities || 0,
      equity: currentDataMap[key]?.equity || 0,
    }
  })

  if (loading) return <p className="text-center text-gray-500">Loading chart data...</p>

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ right: 30 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#ccc' }} />
        <YAxis tick={{ fontSize: 10, fill: '#ccc' }} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar dataKey="assets" fill="#2563eb" name="Assets" />
        <Bar dataKey="liabilities" fill="#8b5cf6" name="Liabilities" />
        <Bar dataKey="equity" fill="#facc15" name="Equity" />
      </BarChart>
    </ResponsiveContainer>
  )
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-4 bg-slate-900 flex flex-col gap-4 rounded-md">
        <p className="text-medium text-lg">{label}</p>
        {payload.map((item, i) => (
          <p key={i} className="text-sm" style={{ color: item.color }}>
            {item.name}: <span className="ml-2">{item.value.toLocaleString()}</span>
          </p>
        ))}
      </div>
    );
  }
};
