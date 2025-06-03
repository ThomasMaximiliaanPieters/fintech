'use client'

export default function PeriodFilter({ value, onChange }) {
  return (
    <div className="relative">
      <select
        className="appearance-none p-2.5 bg-stone-800 rounded-4xl pr-10 text-white outline-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="1">Last 1 Month</option>
        <option value="3">Last 3 Months</option>
        <option value="6">Last 6 Months</option>
        <option value="12">Last 12 Months</option>
        <option value="ALL">All Time</option>
      </select>
    </div>
  )
}
