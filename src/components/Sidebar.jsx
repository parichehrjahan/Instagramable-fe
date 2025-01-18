import { Search, Map, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { useState, useCallback, useRef, useEffect } from 'react'
import { useJsApiLoader, Autocomplete } from '@react-google-maps/api'
import { Skeleton } from '@/components/ui/skeleton'
import FullScreenMap from '@/components/ui/FullScreenMap'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Define libraries and mapContainerStyle outside component
const libraries = ['places']

const CategorySkeleton = () => (
  <div className="flex flex-wrap gap-2">
    {[...Array(6)].map((_, i) => (
      <Skeleton key={i} className="h-9 w-20 rounded-full" />
    ))}
  </div>
)

const Sidebar = ({ onFilterChange, categories, loading, error, spots }) => {
  const [selectedCategories, setSelectedCategories] = useState([])
  const [distance, setDistance] = useState(50)
  const [location, setLocation] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isFullScreenMapOpen, setIsFullScreenMapOpen] = useState(false)
  const [userLocation, setUserLocation] = useState(null)

  const { isLoaded, loadError: apiLoadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  })

  const autocompleteRef = useRef(null)

  const onLoad = useCallback((autocomplete) => {
    autocompleteRef.current = autocomplete
  }, [])

  useEffect(() => {
    if (location) {
      setMapCenter({
        lat: location.lat,
        lng: location.lng,
      })
    }
  }, [location])

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude])
        },
        (error) => {
          console.log('Error getting location:', error)
        }
      )
    }
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

  // Custom marker icon
  const customIcon = L.icon({
    iconUrl:
      'https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  })

  return (
    <>
      <aside className="w-64 border-r h-screen fixed left-0 top-0 z-50 bg-white overflow-y-auto">
        <div className="p-4">
          <h1 className="text-4xl" style={{ fontFamily: "'Satisfy', cursive" }}>
            Instagramable
          </h1>
        </div>
        <div className="p-4 space-y-4">
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

          <div className="space-y-2">
            <Button
              className="w-full flex items-center gap-2"
              onClick={() => setIsFullScreenMapOpen(true)}
            >
              <Map className="h-4 w-4" />
              Open Map Review
            </Button>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Map Preview</h3>
            <div className="h-[300px] rounded-lg overflow-hidden">
              <MapContainer
                center={userLocation || [-6.2088, 106.8456]}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
                zoomControl={false}
              >
                <TileLayer
                  attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>'
                  url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
                  className="map-tiles"
                />
                {spots?.map(
                  (spot) =>
                    spot.latitude &&
                    spot.longitude && (
                      <Marker
                        key={spot.id}
                        position={[
                          parseFloat(spot.latitude),
                          parseFloat(spot.longitude),
                        ]}
                        icon={customIcon}
                      >
                        <Popup className="custom-popup">
                          <div className="p-2">
                            <h3 className="font-semibold">{spot.name}</h3>
                            <p className="text-sm text-gray-600">
                              {spot.description}
                            </p>
                          </div>
                        </Popup>
                      </Marker>
                    )
                )}
                {location && (
                  <Marker
                    position={[location.lat, location.lng]}
                    icon={customIcon}
                  />
                )}
              </MapContainer>
            </div>
          </div>
        </div>
      </aside>

      <FullScreenMap
        spots={spots || []}
        isOpen={isFullScreenMapOpen}
        onClose={() => setIsFullScreenMapOpen(false)}
      />
    </>
  )
}

export default Sidebar
