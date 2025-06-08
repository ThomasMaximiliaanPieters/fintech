'use client'
import { signIn, signOut, useSession } from 'next-auth/react'
import Link from 'next/link'

export default function AuthStatus() {
  const { data: session } = useSession()
  if (session) {
    return <button onClick={() => signOut()} className="text-sm">Sign out</button>
  }
  return <Link href="/login" className="text-sm">Sign in</Link>
}
