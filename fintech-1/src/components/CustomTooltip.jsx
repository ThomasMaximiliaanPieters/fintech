'use client'

export default function CustomTooltip({ active, payload, label }) {
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
