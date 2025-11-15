import { Wifi } from 'lucide-react'
import { LogoutButton } from './LogoutButton'
import { createClient } from '@/utils/supabase/server'
import Image from 'next/image'

export async function Header() {

  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  const user = data.user?.user_metadata
  //console.log(user)

  if (error) {
    console.log(error)
  }

  return (
    <header className='bg-white shadow-sm border-b'>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className='flex justify-between items-center h-16'>

          <div className="flex items-center space-x-3">
            <div className="flex size-8 items-center justify-center rounded-full bg-blue-100">
              <Wifi className="size-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">Sistema IoT Control</h1>
              <p className="text-sm text-muted-foreground">Panel de Control</p>
            </div>
          </div>

          <div className='flex items-center gap-4'>
            <p className='text-sm text-muted-foreground'>Bienvenido, {user?.name ? user.name : 'amigo'}</p>
            {user?.avatar_url && <Image src={user?.avatar_url} alt='user-avatar' width={28} height={28} className='rounded-full' />}

            <LogoutButton />

          </div>

        </div>
      </div>
    </header>
  )
}