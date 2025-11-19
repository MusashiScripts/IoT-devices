'use client'

import { createClient } from '@/utils/supabase/client'
import { Google } from './icons/Google'
import { Button } from './ui/button'

export const GoogleSignInButton = ({ children }: { children: React.ReactNode }) => {

  const handleSignIn = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: process.env.NODE_ENV === 'production'
            ? 'https://iot-devices-three.vercel.app/auth/callback'
            : 'http://localhost:3000/auth/callback'
        }
      })
    } catch (error) {
      console.error('Algo raro sucedio', error)
    }
  }

  return (
    <Button type='button' variant='secondary' className='cursor-pointer w-full' onClick={handleSignIn}>
      <Google />
      {children}
    </Button>
  )
}