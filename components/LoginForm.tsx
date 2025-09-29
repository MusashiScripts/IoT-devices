import { Wifi } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { useState } from 'react'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Alert, AlertDescription } from './ui/alert'

interface LoginFormProps {
  onLogin: (credentials: { username: string, password: string }) => void
}


export function LoginForm({ onLogin }: LoginFormProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  /* const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setIsLoading(true)

    if (username !== 'admin' || password !== 'password') {
      setError('Credenciales incorrectas. Usa: admin/password')
      setIsLoading(false)
    } else {
      onLogin({ username, password })
      setIsLoading(false)
    }
  } */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Simular validación de login
    if (username === 'admin' && password === 'admin') {
      setTimeout(() => {
        onLogin({ username, password })
        setIsLoading(false)
      }, 1000)
    } else {
      setTimeout(() => {
        setError('Credenciales incorrectas. Usa: admin/password')
        setIsLoading(false)
      }, 1000)
    }
  }


  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md bg-white border-none">
        <CardHeader className='text-center'>
          <div className='flex justify-center items-center size-12 rounded-full bg-blue-100 mx-auto mb-4'>
            <Wifi className='text-blue-600' />
          </div>
          <CardTitle>Sistema de IoT Control</CardTitle>
          <CardDescription>Inicia sesion para acceder al panel de control</CardDescription>
        </CardHeader>

        <CardContent>
          <form className='space-y-6' onSubmit={handleSubmit}>
            <div className='space-y-2'>
              <Label htmlFor='username'>Usuario</Label>
              <Input id='username' placeholder='Ingresa tu usuario' required type='text'
                className='border-none bg-gray-100 ring-gray-400'
                value={username} onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='password'>Contraseña</Label>
              <Input id='password' placeholder='Ingresa tu contraseña' required type='password'
                className='border-none bg-gray-100 ring-gray-400'
                value={password} onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type='submit'
              disabled={isLoading}
              className={`bg-black text-white w-full ${!isLoading && 'cursor-pointer'}`}>
              {isLoading ? 'Iniciando Sesion...' : 'Inciar Sesion'}
            </Button>

          </form>
        </CardContent>
      </Card>
    </div>
  )
}