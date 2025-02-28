import { User, LogOut, LogIn, PlusCircle, Map, Home, Globe } from 'lucide-react'

const Navbar = () => {
  return (
    <nav className="fixed top-0 right-0 h-screen w-16 flex flex-col items-center py-8 bg-white shadow-sm z-40">
      <div className="flex flex-col items-center space-y-8">
        <Link to="/" className="p-2 rounded-full hover:bg-gray-100">
          <Home className="h-6 w-6 text-gray-600" />
        </Link>

        <Link to="/add-spot" className="p-2 rounded-full hover:bg-gray-100">
          <PlusCircle className="h-6 w-6 text-gray-600" />
        </Link>

        <Link
          to="/add-predefined-spots"
          className="p-2 rounded-full hover:bg-gray-100"
          title="Add Predefined Spots"
        >
          <Globe className="h-6 w-6 text-gray-600" />
        </Link>

        {/* ... existing links ... */}
      </div>
    </nav>
  )
}

export default Navbar
