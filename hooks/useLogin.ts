import { loginFormSchema } from '@/lib/validations'
import { createClient } from '@/utils/supabase/client'
import { AuthError } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export const useLogin = () => {
  const [clientError, setClientError] = useState({ email: '', password: '' })
  const [serverError, setServerError] = useState<AuthError | null>(null)

  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const router = useRouter()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)

    const form = event.currentTarget
    const data = new FormData(form)

    const email = data.get('email') as string
    const password = data.get('password') as string

    const result = await loginFormSchema.safeParseAsync({ email, password })

    if (!result.success) {
      const flattened = result.error.flatten()
      const fieldErrors: Record<string, string> = {}

      Object.entries(flattened.fieldErrors).forEach(([key, msgs]) => {
        if (msgs && msgs.length) fieldErrors[key] = msgs[0]
      })

      //setServerError({ phoneNumber: '', password: '' })
      setClientError({ email: fieldErrors.email ?? '', password: fieldErrors.password ?? '' })
      setIsLoading(false)
      return
    }

    if (!email || !password) return

    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        console.error('Error aqui: ', error)
        console.log(JSON.stringify(error, null, 2))
        setServerError(error)
        return
      }

      if (data) {
        console.log(data)
      }

      setIsLoading(false)
      router.refresh()

    } catch (error) {
      console.error('Error: ', error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleShowPassword = () => {
    setShowPassword(!showPassword)
  }

  return { clientError, serverError, handleSubmit, isLoading, showPassword, toggleShowPassword }
}