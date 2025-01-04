import { Outlet } from 'react-router'
import Header from './Header'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

const Layout = () => {
  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (!session) {
    return (
      <div className="mx-auto w-full max-w-2xl mt-[50vh] -translate-y-1/2">
        <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />
      </div>
    )
  } else {
    return (
      <div>
        <Header />
        <main className="p-4">
          <Outlet />
        </main>
      </div>
    )
  }
}

export default Layout
