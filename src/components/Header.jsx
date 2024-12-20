import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Bookmark } from 'lucide-react'

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 flex h-16 items-center justify-end">
        <div className="flex items-center gap-6">
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
