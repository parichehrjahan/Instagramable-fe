import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'

const Sidebar = () => {
  return (
    <aside className="w-64 border-r h-screen fixed left-0 top-0">
      {/* Logo */}
      <div className="p-4">
        <h1 className="text-4xl" style={{ fontFamily: "'Satisfy', cursive" }}>
          Instagramable
        </h1>
      </div>

      {/* Sidebar Content */}
      <div className="p-4 space-y-6">
        {/* Search Location */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Location</h3>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search location..." className="pl-8" />
          </div>
        </div>

        {/* Distance Slider */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Distance</h3>
          <Slider defaultValue={[50]} max={100} step={1} className="py-4" />
          <div className="text-sm text-muted-foreground">Within 50 km</div>
        </div>

        {/* Categories */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Categories</h3>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="rounded-full">
              Luxury
            </Button>
            <Button variant="outline" className="rounded-full">
              Nature
            </Button>
            <Button variant="outline" className="rounded-full">
              Beach
            </Button>
            <Button variant="outline" className="rounded-full">
              Mountain
            </Button>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
