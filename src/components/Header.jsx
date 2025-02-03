import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Bookmark, Plus, LogOut, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigate, Link } from 'react-router'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useUser } from '@/contexts/UserContext'
import { useQueryClient } from '@tanstack/react-query'
import { useSavedSpots } from '@/contexts/SavedSpotsContext'

const Header = () => {
  const navigate = useNavigate()
  const { user } = useUser()
  const queryClient = useQueryClient()
  const { showSavedOnly, toggleSavedSpots } = useSavedSpots()

  const handleBookmarkClick = async () => {
    toggleSavedSpots()
    await queryClient.invalidateQueries(['spots'])
    await queryClient.invalidateQueries(['savedSpots'])
  }

  const handleLogout = () => {
    navigate('/login')
  }

  const handleProfile = () => {
    navigate('/profile')
  }

  return (
    <header className="sticky top-0 z-10 w-full border-b bg-white backdrop-blur">
      <div className="px-4 flex h-16 items-center justify-between w-full">
        {/* Logo */}
        <div className="p-4">
          <Link
            to="/"
            className="text-4xl"
            style={{ fontFamily: "'Satisfy', cursive" }}
          >
            Instagramable
          </Link>
        </div>
        <div className="flex items-center gap-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/add-spot')}
            className="hover:bg-gray-100 rounded-full"
          >
            <Plus className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBookmarkClick}
            className="hover:bg-gray-100 p-2"
            title={showSavedOnly ? 'View all spots' : 'View saved spots'}
          >
            <Bookmark
              className={`transform scale-150 cursor-pointer hover:opacity-80 transition-opacity text-black ${
                showSavedOnly ? 'fill-current' : ''
              }`}
            />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="h-8 w-8 cursor-pointer hover:opacity-80 transition-opacity">
                <AvatarImage
                  src={user?.profile_picture || 'https://github.com/shadcn.png'}
                  alt="Profile"
                  className="object-cover"
                />
                <AvatarFallback>{user?.username?.[0] || 'U'}</AvatarFallback>
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
