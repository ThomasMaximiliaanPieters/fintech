'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AddEntry() {
  const router = useRouter()
  const [type, setType] = useState('ASSET')
  const [amount, setAmount] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    await fetch('/api/financial-entries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, amount: parseFloat(amount), currency: 'EUR' }),
    })
    router.push('/finance')
  }

  return (
    <form onSubmit={submit} className="p-4 flex gap-2 items-center">
      <select value={type} onChange={(e) => setType(e.target.value)} className="border p-2">
        <option value="ASSET">Asset</option>
        <option value="LIABILITY">Liability</option>
        <option value="EQUITY">Equity</option>
      </select>
      <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="border p-2" placeholder="Amount" />
      <button type="submit" className="bg-blue-500 text-white p-2">Add</button>
    </form>
  )
}
