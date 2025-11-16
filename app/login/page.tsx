import { LoginForm } from '@/components/LoginForm'

export default function LoginPage() {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <LoginForm />
    </section>
  )
}