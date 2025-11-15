'use client'

import { LogOut } from 'lucide-react'
import { Button } from './ui/button'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export const LogoutButton = () => {

  const router = useRouter()

  const handleLogOut = async () => {
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()

    if (error) {
      alert('Ocurrio un error')
      console.error('Error inesperado: ', error)
    }

    router.refresh()

  }

  return (
    <Button variant='secondary' onClick={handleLogOut} className='cursor-pointer'>
      <LogOut />
      Cerrar Sesion
    </Button>
  )
}