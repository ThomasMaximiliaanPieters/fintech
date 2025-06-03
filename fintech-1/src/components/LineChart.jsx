// src/components/linechart.jsx

'use client'

import { useMemo, useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { useSmartPeriodData } from '@/hooks/useSmartPeriodData'
import { FiEye, FiEyeOff } from 'react-icons/fi'

function groupByMonth(entries) {
  return entries.reduce((acc, entry) => {
    const key = new Date(entry.period).toISOString().slice(0, 7)
    if (!acc[key]) acc[key] = { period: key, revenue: 0, profit: 0 }
    if (entry.type === 'REVENUE') acc[key].revenue += entry.amount
    if (entry.type === 'PROFIT') acc[key].profit += entry.amount
    return acc
  }, {})
}

function percentageChange(current, previous) {
  if (previous === 0) return current === 0 ? 0 : 100
  return ((current - previous) / previous) * 100
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null

  return (
    <div className="bg-stone-800 text-white p-2 rounded shadow text-xs">
      <p className="font-semibold mb-1">{label}</p>
      {payload.map((item, i) => (
        <div key={i} className="flex justify-between">
          <span className="mr-2" style={{ color: item.color }}>{item.name}:</span>
          <span>{item.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  )
}

export default function FinancialLineChart({ period = 'ALL' }) {
  const { current, previous, loading } = useSmartPeriodData(period)
  const [showPrevious, setShowPrevious] = useState(true)

  const currentDataMap = useMemo(() => groupByMonth(current), [current])
  const previousDataMap = useMemo(() => groupByMonth(previous), [previous])

  const allKeys = Array.from(
    new Set([
      ...Object.keys(currentDataMap),
      ...Object.keys(previousDataMap)
    ])
  ).sort()

  const combinedData = allKeys.map((key) => ({
    period: key,
    revenue: currentDataMap[key]?.revenue || 0,
    profit: currentDataMap[key]?.profit || 0,
    prevRevenue: previousDataMap[key]?.revenue || 0,
    prevProfit: previousDataMap[key]?.profit || 0,
  }))

  const currentRevenue = current.reduce((sum, e) => e.type === 'REVENUE' ? sum + e.amount : sum, 0)
  const previousRevenue = previous.reduce((sum, e) => e.type === 'REVENUE' ? sum + e.amount : sum, 0)
  const currentProfit = current.reduce((sum, e) => e.type === 'PROFIT' ? sum + e.amount : sum, 0)
  const previousProfit = previous.reduce((sum, e) => e.type === 'PROFIT' ? sum + e.amount : sum, 0)

  const revChange = percentageChange(currentRevenue, previousRevenue)
  const profChange = percentageChange(currentProfit, previousProfit)

  if (loading) return <p className="text-center text-gray-500">Loading chart data...</p>

  return (
    <div className="relative w-full h-[28rem]">
      <div className="absolute flex gap-2.5 top-[-10px] left-2.5 text-[11px] space-y-1 z-10">
        <span className={`block ${revChange > 0 ? 'text-green-400' : revChange < 0 ? 'text-red-400' : 'text-white'}`}>
          Revenue {revChange > 0 ? '▲' : revChange < 0 ? '▼' : ''} {Math.abs(revChange).toFixed(1)}%
        </span>
        <span className={`block ${profChange > 0 ? 'text-green-400' : profChange < 0 ? 'text-red-400' : 'text-white'}`}>
          Profit {profChange > 0 ? '▲' : profChange < 0 ? '▼' : ''} {Math.abs(profChange).toFixed(1)}%
        </span>
      </div>

      <button
        onClick={() => setShowPrevious(prev => !prev)}
        className="absolute top-[-10px] right-2.5 rounded-full bg-stone-700 hover:bg-stone-600 text-white z-10"
        title="Toggle previous period"
      >
        {showPrevious ? <FiEyeOff size={16} /> : <FiEye size={16} />}
      </button>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={combinedData}
          margin={{ top: 20, right: 20, left: 10, bottom: 30 }}
        >
          <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="#444" />
          <XAxis dataKey="period" interval={0} minTickGap={20} tick={{ fontSize: 10, fill: '#ccc' }} />
          <YAxis domain={[0, 'dataMax + 5000']} tick={{ fontSize: 10, fill: '#ccc' }} orientation="right" />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#8884d8', strokeWidth: 1 }} />
          <Legend wrapperStyle={{ fontSize: '12px', color: '#fff' }} />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#8884d8"
            name="Current Revenue"
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="profit"
            stroke="#82ca9d"
            name="Current Profit"
          />
          {showPrevious && (
            <>
              <Line
                type="monotone"
                dataKey="prevRevenue"
                stroke="#8884d8"
                name="Previous Revenue"
                strokeDasharray="5 5"
              />
              <Line
                type="monotone"
                dataKey="prevProfit"
                stroke="#82ca9d"
                name="Previous Profit"
                strokeDasharray="5 5"
              />
            </>
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
