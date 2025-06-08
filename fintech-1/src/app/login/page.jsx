'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })
    if (!res?.error) {
      router.push('/finance')
    } else {
      alert('Invalid credentials')
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form onSubmit={submit} className="flex flex-col gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="border p-2"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="border p-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2">Sign in</button>
      </form>
      <div className="mt-4 flex gap-2">
        <button onClick={() => signIn('google')} className="p-2 border">Google</button>
        <button onClick={() => signIn('github')} className="p-2 border">GitHub</button>
      </div>
    </div>
  )
}
