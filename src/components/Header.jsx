import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Bookmark, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router'

const Header = () => {
  const navigate = useNavigate()

  const handleAddSpot = () => {
    navigate('/add-spot')
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
          <Bookmark className="h-8 w-8 cursor-pointer hover:opacity-80 transition-opacity text-black fill-current" />
          <Avatar className="h-8 w-8 cursor-pointer hover:opacity-80 transition-opacity">
            <AvatarImage
              src="https://github.com/shadcn.png"
              alt="Profile"
              className="object-cover"
            />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}

export default Header
