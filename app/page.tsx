import { Dashboard } from '@/components/Dashboard'
import { Header } from '@/components/Header'
//import { createClient } from '@/utils/supabase/server'

export default async function Home() {

  /*   const supabase = await createClient()
    const { data, error } = await supabase.auth.getUser() */

  return (
    <main>
      <section className='min-h-screen bg-gray-50'>
        <Header />
        <Dashboard />
      </section>
    </main>
  )
}
