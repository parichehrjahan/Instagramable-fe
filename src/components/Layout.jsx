import { Outlet } from 'react-router'
import Header from '@/components/Header'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useUser } from '@/contexts/UserContext'
import supabase from '@/lib/supabaseClient'

const Layout = () => {
  const { session, loading } = useUser()

  if (loading) {
    return null
  }

  if (!loading && !session) {
    return (
      <div className="mx-auto w-full max-w-2xl mt-[50vh] -translate-y-1/2">
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          onSuccess={() => {
            // Handle successful auth if needed
          }}
        />
      </div>
    )
  }

  return (
    <div>
      <Header />
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
