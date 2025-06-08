'use client'

import { useMemo, useState, useEffect } from 'react'
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
import { useRevenuePeriodData } from '@/hooks/useRevenuePeriodData'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import CustomTooltip from './CustomTooltip'
import { buildRevenueLineChartData, percentageChange } from '@/utils/finance'

export default function RevenueLineChart({ period }) {
  const { current, previous, loading } = useRevenuePeriodData(period)
  const [showPrevious, setShowPrevious] = useState(!!period.compare)

  useEffect(() => {
    setShowPrevious(!!period.compare)
  }, [period.compare])

  const combinedData = useMemo(
    () =>
      buildRevenueLineChartData({
        current,
        previous,
        period,
        showPrevious,
      }),
    [current, previous, period, showPrevious]
  )

  const currentSub = current.reduce(
    (sum, e) => (e.type === 'SUBSCRIPTION' ? sum + e.amount : sum),
    0
  )
  const previousSub = previous.reduce(
    (sum, e) => (e.type === 'SUBSCRIPTION' ? sum + e.amount : sum),
    0
  )
  const subChange = percentageChange(currentSub, previousSub)

  if (loading) return <p className="text-center text-gray-500">Loading chart data...</p>

  return (
    <div className="relative w-full h-[28rem]">
      <div className="absolute flex gap-2.5 top-[-10px] left-2.5 text-[11px] z-10">
        <span className={`block ${subChange > 0 ? 'text-green-400' : subChange < 0 ? 'text-red-400' : 'text-white'}`}>
          Subscription {subChange > 0 ? '▲' : subChange < 0 ? '▼' : ''} {Math.abs(subChange).toFixed(1)}%
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
        <LineChart data={combinedData} margin={{ top: 20, right: 20, left: 10, bottom: 30 }}>
          <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="#444" />
          <XAxis
            dataKey="dateNum"
            type="number"
            domain={['dataMin', 'dataMax']}
            tickFormatter={(tick) => {
              const date = new Date(tick)
              return date.toLocaleString('default', { month: 'short', year: '2-digit' })
            }}
            tick={{ fontSize: 10, fill: '#ccc' }}
          />
          <YAxis domain={[0, 'dataMax + 5000']} tick={{ fontSize: 10, fill: '#ccc' }} orientation="right" />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#8884d8', strokeWidth: 1 }} />
          <Legend wrapperStyle={{ fontSize: '12px', color: '#fff' }} />
          <Line type="monotone" dataKey="subscription" stroke="#3b82f6" name="Current Subscription" activeDot={{ r: 6 }} />
          <Line type="monotone" dataKey="services" stroke="#10b981" name="Current Services" />
          <Line type="monotone" dataKey="advertising" stroke="#f59e0b" name="Current Advertising" />
          <Line type="monotone" dataKey="other" stroke="#a855f7" name="Current Other" />
          {showPrevious && (
            <>
              <Line type="monotone" dataKey="prevSubscription" stroke="#3b82f6" name="Previous Subscription" strokeDasharray="5 5" />
              <Line type="monotone" dataKey="prevServices" stroke="#10b981" name="Previous Services" strokeDasharray="5 5" />
              <Line type="monotone" dataKey="prevAdvertising" stroke="#f59e0b" name="Previous Advertising" strokeDasharray="5 5" />
              <Line type="monotone" dataKey="prevOther" stroke="#a855f7" name="Previous Other" strokeDasharray="5 5" />
            </>
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
