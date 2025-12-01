'use client'

import { Eye, EyeClosed, MailX, TriangleAlert } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Label } from './ui/label'
import { Input } from './ui/input'
import Link from 'next/link'
import { GoogleSignInButton } from './GoogleSignInButton'
import { useLogin } from '@/hooks/useLogin'
import Image from 'next/image'
import { SmallLogoBlackImg } from '@/lib/constants'

export function LoginForm() {
  const { clientError, serverError, handleSubmit, isLoading, showPassword, toggleShowPassword } = useLogin()

  return (
    <Card className="w-full max-w-md bg-white border-none">
      <CardHeader className='text-center'>
        <div className='flex justify-center items-center rounded-full mx-auto mb-4'>
          <Image src={SmallLogoBlackImg} alt='logo' height={50} width={50} className='rounded-full' priority />
        </div>
        <CardTitle>Sistema de IoT Control</CardTitle>
        <CardDescription>Inicia sesión para acceder al panel de control</CardDescription>
      </CardHeader>

      <CardContent className='space-y-2'>
        {/* <form className='space-y-6' onSubmit={handleSubmit}>
          <div className='space-y-2'>
            <Label htmlFor='email'>Email</Label>
            <Input id='email' name='email' placeholder='email@example.com' type='email'
              className='border-none bg-gray-100 ring-gray-400'
            />
            {clientError.email && <div className='text-red-500 flex justify-center items-center gap-2 mt-2'>
              <MailX size={18} />
              <span className='text-xs'>{clientError.email}</span>
            </div>}
          </div>

          <div className='space-y-2'>
            <div className='flex justify-between items-center'>
              <Label htmlFor='password'>Contraseña</Label>
              {showPassword
                ? <Eye size={20} className='cursor-pointer' onClick={toggleShowPassword} />
                : <EyeClosed size={20} className='cursor-pointer' onClick={toggleShowPassword} />
              }
            </div>

            <Input id='password' name='password' placeholder='Ingresa tu contraseña' type={showPassword ? 'text' : 'password'}
              className='border-none bg-gray-100 ring-gray-400'
            />


            {clientError.password &&
              <div className='text-red-500 flex justify-center items-center gap-2 mt-2'>
                <TriangleAlert size={18} />
                <span className='text-xs'>{clientError.password}</span>
              </div>
            }
          </div>

          {
            serverError && <div className='text-red-500 flex justify-center items-center gap-2 mt-2'>
              <TriangleAlert size={18} />
              <span className='text-sm'>{serverError.message}</span>
            </div>
          }

          <div className='flex flex-col items-center gap-2'>
            <Button
              type='submit'
              disabled={isLoading}
              className={`bg-black text-white w-full ${!isLoading && 'cursor-pointer'}`}>
              {isLoading ? 'Iniciando Sesion...' : 'Inciar Sesion'}
            </Button> */}
        {/*  <span className='text-xs font-semibold'>O</span> */}
        <GoogleSignInButton>
          Iniciar sesión con Google
        </GoogleSignInButton>
        {/* </div> */}


        {/* </form> */}

        <div className='flex justify-center items-center gap-1 text-sm'>
          <span>No tienes cuenta?</span>
          <Link href='/sign-up' className='underline underline-offset-4 hover:text-blue-500 transition-colors'>Créate una</Link>
        </div>

      </CardContent>
    </Card>
  )
}