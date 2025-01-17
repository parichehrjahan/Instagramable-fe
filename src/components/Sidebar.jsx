import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { useState, useCallback, useRef } from 'react'
import { useJsApiLoader, Autocomplete } from '@react-google-maps/api'
import { Skeleton } from '@/components/ui/skeleton'

// Define libraries outside component to prevent re-renders
const libraries = ['places']

const CategorySkeleton = () => (
  <div className="flex flex-wrap gap-2">
    {[...Array(6)].map((_, i) => (
      <Skeleton key={i} className="h-9 w-20 rounded-full" />
    ))}
  </div>
)

const Sidebar = ({ onFilterChange, categories, loading, error }) => {
  const [selectedCategories, setSelectedCategories] = useState([])
  const [distance, setDistance] = useState(50)
  const [location, setLocation] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  const { isLoaded, loadError: apiLoadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  })

  const autocompleteRef = useRef(null)

  const onLoad = useCallback((autocomplete) => {
    autocompleteRef.current = autocomplete
  }, [])

  const onPlaceChanged = useCallback(() => {
    const place = autocompleteRef.current?.getPlace()
    if (place?.geometry) {
      const newLocation = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
        address: place.formatted_address,
      }
      setLocation(newLocation)
      setSearchQuery(place.formatted_address)

      // Trigger filter change with new location
      onFilterChange({
        categories: selectedCategories,
        distance,
        location: newLocation,
        searchQuery: place.formatted_address,
      })
    }
  }, [selectedCategories, distance, onFilterChange])

  const toggleCategory = (categoryId) => {
    const newCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter((c) => c !== categoryId)
      : [...selectedCategories, categoryId]

    setSelectedCategories(newCategories)

    onFilterChange({
      categories: newCategories,
      distance,
      location,
      searchQuery,
    })
  }

  return (
    <aside className="w-64 border-r h-screen fixed left-0 top-0 z-50 bg-white">
      <div className="p-4">
        <h1 className="text-4xl" style={{ fontFamily: "'Satisfy', cursive" }}>
          Instagramable
        </h1>
      </div>
      <div className="p-4 space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Location</h3>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            {isLoaded ? (
              <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search location..."
                  className="pl-8"
                />
              </Autocomplete>
            ) : (
              <Input disabled placeholder="Loading..." className="pl-8" />
            )}
          </div>
          {location && (
            <div className="text-sm text-muted-foreground">
              Selected: {location.address}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Distance</h3>
          {loading ? (
            <Skeleton className="h-2 w-full my-6" />
          ) : (
            <Slider
              defaultValue={[distance]}
              max={100}
              step={1}
              className="py-4"
              onValueChange={([value]) => setDistance(value)}
            />
          )}
          <div className="text-sm text-muted-foreground">
            Within {distance} km
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Categories</h3>
          {loading ? (
            <CategorySkeleton />
          ) : error ? (
            <div className="text-sm text-red-500">{error}</div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={
                    selectedCategories.includes(category.id)
                      ? 'default'
                      : 'outline'
                  }
                  className="rounded-full"
                  onClick={() => toggleCategory(category.id)}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
