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

function groupByDate(entries) {
  return entries.reduce((acc, entry) => {
    const key = new Date(entry.period).toISOString().slice(0, 10)
    if (!acc[key]) acc[key] = { assets: 0, liabilities: 0, equity: 0 }
    if (entry.type === 'ASSET') acc[key].assets += entry.amount
    if (entry.type === 'LIABILITY') acc[key].liabilities += entry.amount
    if (entry.type === 'EQUITY') acc[key].equity += entry.amount
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

  const currentDataMap = useMemo(() => groupByDate(current), [current])
  const previousDataMap = useMemo(() => groupByDate(previous), [previous])


  const allKeys = useMemo(() => {
    return Array.from(new Set([
      ...Object.keys(currentDataMap),
      ...Object.keys(previousDataMap),
    ])).sort()
  }, [currentDataMap, previousDataMap])

  const combinedData = allKeys.map((key) => {
    const date = new Date(key)
    return {
      period: key,
      date,
      dateNum: date.getTime(),
      assets: currentDataMap[key]?.assets || 0,
      liabilities: currentDataMap[key]?.liabilities || 0,
      equity: currentDataMap[key]?.equity || 0,
      ...(showPrevious && {
        prevAssets: previousDataMap[key]?.assets || 0,
        prevLiabilities: previousDataMap[key]?.liabilities || 0,
        prevEquity: previousDataMap[key]?.equity || 0,
      }),
    }
  })



  const currentAssets = current.reduce((sum, e) => e.type === 'ASSET' ? sum + e.amount : sum, 0)
  const previousAssets = previous.reduce((sum, e) => e.type === 'ASSET' ? sum + e.amount : sum, 0)
  const currentLiabilities = current.reduce((sum, e) => e.type === 'LIABILITY' ? sum + e.amount : sum, 0)
  const previousLiabilities = previous.reduce((sum, e) => e.type === 'LIABILITY' ? sum + e.amount : sum, 0)

  const assetChange = percentageChange(currentAssets, previousAssets)
  const liabilityChange = percentageChange(currentLiabilities, previousLiabilities)

  if (loading) return <p className="text-center text-gray-500">Loading chart data...</p>

  return (
    <div className="relative w-full h-[28rem]">
      <div className="absolute flex gap-2.5 top-[-10px] left-2.5 text-[11px] z-10">
        <span className={`block ${assetChange > 0 ? 'text-green-400' : assetChange < 0 ? 'text-red-400' : 'text-white'}`}>Assets {assetChange > 0 ? '▲' : assetChange < 0 ? '▼' : ''} {Math.abs(assetChange).toFixed(1)}%</span>
        <span className={`block ${liabilityChange > 0 ? 'text-green-400' : liabilityChange < 0 ? 'text-red-400' : 'text-white'}`}>Liabilities {liabilityChange > 0 ? '▲' : liabilityChange < 0 ? '▼' : ''} {Math.abs(liabilityChange).toFixed(1)}%</span>
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
          <XAxis
            dataKey="dateNum"
            type="number"
            domain={['dataMin', 'dataMax']}
            tickFormatter={(tick) => {
              const date = new Date(tick)
              return date.toLocaleString('default', { month: 'short', day: 'numeric', year: '2-digit' })
            }}
            tick={{ fontSize: 10, fill: '#ccc' }}
          />
          <YAxis domain={[0, 'dataMax + 5000']} tick={{ fontSize: 10, fill: '#ccc' }} orientation="right" />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#8884d8', strokeWidth: 1 }} />
          <Legend wrapperStyle={{ fontSize: '12px', color: '#fff' }} />
          <Line type="monotone" dataKey="assets" stroke="#8884d8" name="Current Assets" activeDot={{ r: 6 }} />
          <Line type="monotone" dataKey="liabilities" stroke="#82ca9d" name="Current Liabilities" />
          <Line type="monotone" dataKey="equity" stroke="#facc15" name="Current Equity" />
          {showPrevious && (
            <>
              <Line type="monotone" dataKey="prevAssets" stroke="#8884d8" name="Previous Assets" strokeDasharray="5 5" />
              <Line type="monotone" dataKey="prevLiabilities" stroke="#82ca9d" name="Previous Liabilities" strokeDasharray="5 5" />
              <Line type="monotone" dataKey="prevEquity" stroke="#facc15" name="Previous Equity" strokeDasharray="5 5" />
            </>
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}