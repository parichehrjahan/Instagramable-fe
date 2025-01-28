import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Bookmark, Plus, LogOut, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigate, useLocation } from 'react-router'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useUser } from '@/contexts/UserContext'

const Header = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useUser()
  const isOnSavedSpots = location.pathname === '/saved-spots'

  const handleAddSpot = () => {
    navigate('/add-spot')
  }

  const handleSavedSpotsToggle = () => {
    if (isOnSavedSpots) {
      navigate('/')
    } else {
      navigate('/saved-spots')
    }
  }

  const handleLogout = () => {
    navigate('/login')
  }

  const handleProfile = () => {
    navigate('/profile')
  }

  return (
    <header className="sticky top-0 z-10 w-full border-b bg-white backdrop-blur ">
      <div className="px-4 flex h-16 items-center justify-between w-full">
        {/* Logo */}
        <div className="p-4">
          <a
            href="/"
            className="text-4xl"
            style={{ fontFamily: "'Satisfy', cursive" }}
          >
            Instagramable
          </a>
        </div>
        <div className="flex items-center gap-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleAddSpot}
            className="hover:bg-gray-100 rounded-full"
          >
            <Plus className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSavedSpotsToggle}
            className="hover:bg-gray-100 p-2"
          >
            <Bookmark
              className={`transform scale-150 cursor-pointer hover:opacity-80 transition-opacity text-black ${
                isOnSavedSpots ? 'fill-current' : ''
              }`}
            />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="h-8 w-8 cursor-pointer hover:opacity-80 transition-opacity">
                <AvatarImage
                  src={user?.profileImage || 'https://github.com/shadcn.png'}
                  alt="Profile"
                  className="object-cover"
                />
                <AvatarFallback>{user?.name?.[0] || 'U'}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onClick={handleProfile}
                className="cursor-pointer"
              >
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer text-red-600"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

export default Header
