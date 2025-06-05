'use client'

import { useState, useRef, useEffect } from 'react'
import { FiChevronDown } from 'react-icons/fi'

const CURRENT_OPTIONS = [
  { label: 'Last 1 Month', value: '1' },
  { label: 'Last 3 Months', value: '3' },
  { label: 'Last 6 Months', value: '6' },
  { label: 'Last 12 Months', value: '12' },
  { label: 'All Time', value: 'ALL' }
]

const COMPARE_OPTIONS = [
  { label: 'Previous Period', value: 'previous' },
  { label: 'Same Period Last Year', value: 'last_year' },
  { label: 'No Comparison', value: null }
]

export default function PeriodFilter({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef()

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="appearance-none p-2.5 bg-stone-800 rounded-4xl pr-10 text-white outline-none min-w-[200px] text-left relative"
      >
        {CURRENT_OPTIONS.find(o => o.value === value.current)?.label || 'Select Period'}
        {value.compare && ` vs ${COMPARE_OPTIONS.find(c => c.value === value.compare)?.label}`}
        <FiChevronDown className="absolute right-3 top-3.5 pointer-events-none text-white" />
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-1 bg-stone-800 text-white rounded-xl p-3 grid grid-cols-2 gap-3 shadow-lg w-[360px]">
          <div>
            <p className="text-xs mb-1 text-stone-400">Current Period</p>
            {CURRENT_OPTIONS.map((option) => (
              <button
                key={option.value}
                className={`block w-full text-left text-sm px-2 py-1 rounded-md hover:bg-stone-700 ${
                  value.current === option.value ? 'bg-stone-700 font-bold' : ''
                }`}
                onClick={() => {
                  onChange({ ...value, current: option.value })
                  setOpen(false)
                }}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div>
            <p className="text-xs mb-1 text-stone-400">Compare To</p>
            {COMPARE_OPTIONS.map((option) => (
              <button
                key={option.value ?? 'none'}
                className={`block w-full text-left text-sm px-2 py-1 rounded-md hover:bg-stone-700 ${
                  value.compare === option.value ? 'bg-stone-700 font-bold' : ''
                }`}
                onClick={() => {
                  onChange({ ...value, compare: option.value })
                  setOpen(false)
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
