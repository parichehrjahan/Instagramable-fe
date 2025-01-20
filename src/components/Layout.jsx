import { Outlet } from 'react-router'
import Header from '@/components/Header'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useUser } from '@/contexts/UserContext'
import { useHeader } from '@/contexts/HeaderContext'
import supabase from '@/lib/supabaseClient'

const Layout = () => {
  const { session, loading } = useUser()
  const { isFullScreenMapOpen } = useHeader()

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
      {!isFullScreenMapOpen && <Header />}
      <main className={!isFullScreenMapOpen ? 'p-4' : ''}>
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
