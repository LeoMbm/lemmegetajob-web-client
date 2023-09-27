'use client'
import { useSession } from 'next-auth/react'
import React from 'react'

export const UserCard = () => {
    const session = useSession()
    
    const email = session?.data?.session?.user?.email
  return (
    <div>Hey {email}</div>
  )
}
