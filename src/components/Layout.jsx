import Header from './Header'
import Sidebar from './Sidebar'

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="ml-64">
        <Header />
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}

export default Layout
