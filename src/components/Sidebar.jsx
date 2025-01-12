import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { useState, useCallback, useEffect } from 'react'
import { useJsApiLoader, Autocomplete } from '@react-google-maps/api'
import supabase from '@/lib/supabaseClient'
import { getCategories } from '@/services/api'

// Define libraries outside component to prevent re-renders
const libraries = ['places']

const Sidebar = ({ onFilterChange }) => {
  const [selectedCategories, setSelectedCategories] = useState([])
  const [distance, setDistance] = useState(50)
  const [location, setLocation] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [loadError, setLoadError] = useState(null)
  const [availableCategories, setAvailableCategories] = useState([])

  const { isLoaded, loadError: apiLoadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  })

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories()
        if (response.success) {
          setAvailableCategories(response.data)
        } else {
          setLoadError('Failed to load categories')
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
        setLoadError('Failed to load categories')
      }
    }

    fetchCategories()
  }, [])

  const onPlaceChanged = useCallback(() => {
    const place = autocomplete.getPlace()
    if (place.geometry) {
      setLocation({
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
        address: place.formatted_address,
      })
      setSearchQuery(place.formatted_address)
    }
  }, [])

  if (apiLoadError) {
    setLoadError('Failed to load Google Maps')
  }

  const toggleCategory = (categoryId) => {
    const newCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter((c) => c !== categoryId)
      : [...selectedCategories, categoryId]

    setSelectedCategories(newCategories)

    // Instead of fetching from Supabase, just pass the new categories to parent
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
              <Autocomplete onPlaceChanged={onPlaceChanged}>
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
          {loadError && <div className="text-sm text-red-500">{loadError}</div>}
          {location && (
            <div className="text-sm text-muted-foreground">
              Selected: {location.address}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Distance</h3>
          <Slider
            defaultValue={[distance]}
            max={100}
            step={1}
            className="py-4"
            onValueChange={([value]) => setDistance(value)}
          />
          <div className="text-sm text-muted-foreground">
            Within {distance} km
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Categories</h3>
          <div className="flex flex-wrap gap-2">
            {availableCategories.map((category) => (
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
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
