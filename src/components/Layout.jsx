import { Outlet } from 'react-router'
import Header from './Header'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useUser } from '../contexts/UserContext'
import { getDB } from '../lib/utils'

const Layout = () => {
  const { session } = useUser()

  if (!session) {
    return (
      <div className="mx-auto w-full max-w-2xl mt-[50vh] -translate-y-1/2">
        <Auth supabaseClient={getDB()} appearance={{ theme: ThemeSupa }} />
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
