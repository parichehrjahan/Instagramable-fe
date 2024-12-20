import { Outlet } from 'react-router'
import Header from './Header'

const Layout = () => {
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
