'use client'

import { useState } from 'react'
import type { User } from '@/lib/types.d'
import { Dashboard } from '@/components/Dashboard'
import { LoginForm } from '@/components/LoginForm'

function App() {
  const [user, setUser] = useState<User | null>({ username: 'admin', password: 'admin' })

  const handleLogin = (credentials: User) => {
    setUser(credentials)
  }

  const handleLogout = () => {
    setUser(null)
  }

  return (
    <main>
      {user ? <Dashboard user={user} onLogout={handleLogout} /> : <LoginForm onLogin={handleLogin} />}
    </main>
  )
}

export default App
