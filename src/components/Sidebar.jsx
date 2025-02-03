import { Search, Map, LayoutGrid } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { useState, useCallback, useEffect } from 'react'
import { useJsApiLoader, Autocomplete } from '@react-google-maps/api'
import { Skeleton } from '@/components/ui/skeleton'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useNavigate } from 'react-router'
import { useLocation } from '@/contexts/LocationContext'
import { calculateDistance } from '@/lib/utils'

// Define libraries and mapContainerStyle outside component
const libraries = ['places']

const Sidebar = ({
  onFilterChange,
  categories,
  loading,
  spots,
  isFullScreenMapOpen,
  onViewChange,
  mapCenter,
  setMapCenter,
}) => {
  const { location, searchRadius, updateLocation, updateSearchRadius } =
    useLocation()
  const [selectedCategories, setSelectedCategories] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  // eslint-disable-next-line no-unused-vars
  const [userLocation, setUserLocation] = useState(null)
  const [autocomplete, setAutocomplete] = useState(null)

  // eslint-disable-next-line no-unused-vars
  const { isLoaded, loadError: apiLoadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  })

  const navigate = useNavigate()

  // Memoize the filter function
  const applyFilters = useCallback(
    (currentSpots, categories, radius, loc) => {
      if (!currentSpots) return

      let filteredResults = [...currentSpots]

      if (loc?.lat && loc?.lng) {
        filteredResults = filteredResults.filter((spot) => {
          if (!spot.latitude || !spot.longitude) return false
          const distance = calculateDistance(
            loc.lat,
            loc.lng,
            parseFloat(spot.latitude),
            parseFloat(spot.longitude)
          )
          return distance <= radius
        })
      }

      if (categories.length > 0) {
        filteredResults = filteredResults.filter((spot) =>
          categories.some((categoryId) => spot.categories?.includes(categoryId))
        )
      }

      onFilterChange({ spots: filteredResults })
    },
    [onFilterChange]
  )

  // Handle filter changes
  const handleDistanceChange = useCallback(
    ([value]) => {
      updateSearchRadius(value)
      applyFilters(spots, selectedCategories, value, location)
    },
    [updateSearchRadius, spots, selectedCategories, location, applyFilters]
  )

  const toggleCategory = useCallback(
    (categoryId) => {
      setSelectedCategories((prev) => {
        const newCategories = prev.includes(categoryId)
          ? prev.filter((c) => c !== categoryId)
          : [...prev, categoryId]

        applyFilters(spots, newCategories, searchRadius, location)
        return newCategories
      })
    },
    [spots, searchRadius, location, applyFilters]
  )

  // Initial geolocation
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = [
            position.coords.latitude,
            position.coords.longitude,
          ]
          setUserLocation(newLocation)
          setMapCenter?.(newLocation)
        },
        (error) => console.log('Error getting location:', error)
      )
    }
  }, [setMapCenter]) // Empty dependency array

  // Update map center when location changes
  useEffect(() => {
    if (location?.lat && location?.lng) {
      setMapCenter?.([location.lat, location.lng])
    }
  }, [location?.lat, location?.lng, setMapCenter])

  // Apply filters when spots or location changes
  useEffect(() => {
    if (spots) {
      applyFilters(spots, selectedCategories, searchRadius, location)
    }
  }, [
    spots,
    location?.lat,
    location?.lng,
    applyFilters,
    location,
    selectedCategories,
    searchRadius,
  ]) // Only reapply when spots or location coordinates change

  const onLoad = (autocomplete) => {
    setAutocomplete(autocomplete)
  }

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace()
      if (place.geometry) {
        const newLocation = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
          address: place.formatted_address,
        }
        updateLocation(newLocation)
        setSearchQuery(place.formatted_address)
      }
    }
  }

  // Custom marker icon
  const customIcon = L.icon({
    iconUrl:
      'https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  })

  const handleLogoClick = () => {
    // Reset location and filters
    updateLocation({
      lat: null,
      lng: null,
      address: '',
    })
    setSearchQuery('')
    setSelectedCategories([])

    // Reset filtered spots
    onFilterChange({ spots: spots || [] })

    // Navigate to home
    navigate('/')

    // If map is open, close it
    if (isFullScreenMapOpen) {
      onViewChange(false)
    }
  }

  return (
    <aside
      className={`w-64 border-r h-screen fixed left-0 top-0 z-50 overflow-y-auto ${
        isFullScreenMapOpen
          ? 'bg-transparent border-white/10 backdrop-blur-md'
          : 'bg-white'
      }`}
    >
      <div className="p-4 space-y-4">
        <div className="space-y-2">
          <h1
            onClick={handleLogoClick}
            className={`text-4xl cursor-pointer hover:opacity-80 transition-opacity ${
              isFullScreenMapOpen ? 'text-white' : ''
            }`}
            style={{ fontFamily: "'Satisfy', cursive" }}
          >
            Instagramable
          </h1>
        </div>
        <div className="space-y-2">
          <h3
            className={`text-lg font-semibold ${isFullScreenMapOpen ? 'text-white' : ''}`}
          >
            Location
          </h3>
          <div className="relative">
            <Search
              className={`absolute left-2 top-2.5 h-4 w-4 ${
                isFullScreenMapOpen ? 'text-white' : 'text-muted-foreground'
              }`}
            />
            {isLoaded ? (
              <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search location..."
                  className={`pl-8 ${
                    isFullScreenMapOpen
                      ? 'bg-gray-600/50 border-gray-600 text-white placeholder:text-gray-300'
                      : ''
                  }`}
                />
              </Autocomplete>
            ) : (
              <Input disabled placeholder="Loading..." className="pl-8" />
            )}
          </div>
          {location && (
            <div
              className={`text-sm ${
                isFullScreenMapOpen ? 'text-gray-300' : 'text-muted-foreground'
              }`}
            >
              {location.address}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <h3
            className={`text-lg font-semibold ${isFullScreenMapOpen ? 'text-white' : ''}`}
          >
            Distance
          </h3>
          {loading ? (
            <Skeleton className="h-2 w-full my-6" />
          ) : (
            <Slider
              defaultValue={[searchRadius]}
              max={100}
              step={1}
              className={`py-4 ${
                isFullScreenMapOpen
                  ? '[&_.relative_>_span]:bg-white [&_.relative]:bg-gray-600'
                  : ''
              }`}
              onValueChange={handleDistanceChange}
            />
          )}
          <div
            className={`text-sm ${isFullScreenMapOpen ? 'text-white' : 'text-muted-foreground'}`}
          >
            Within {searchRadius} km
          </div>
        </div>

        <div className="space-y-2">
          <h3
            className={`text-lg font-semibold ${isFullScreenMapOpen ? 'text-white' : ''}`}
          >
            Categories
          </h3>
          {loading ? (
            <div className="flex flex-wrap gap-1.5">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-6 w-16 rounded-full" />
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {categories?.map((category) => (
                <Button
                  key={category.id}
                  variant={
                    selectedCategories.includes(category.id)
                      ? 'default'
                      : 'secondary'
                  }
                  className={`rounded-full text-xs h-6 px-2.5 min-w-0 ${
                    isFullScreenMapOpen &&
                    !selectedCategories.includes(category.id)
                      ? 'bg-gray-600/50 hover:bg-gray-600/70 text-white border-gray-600'
                      : ''
                  }`}
                  onClick={() => toggleCategory(category.id)}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <h3
            className={`text-lg font-semibold ${isFullScreenMapOpen ? 'text-white' : ''}`}
          >
            {isFullScreenMapOpen ? 'Spots Preview' : 'Map Preview'}
          </h3>
          <Button
            className={`w-full flex items-center justify-center gap-2 ${
              isFullScreenMapOpen
                ? 'bg-gray-600/50 hover:bg-gray-600/70 border-gray-600'
                : ''
            }`}
            onClick={() => onViewChange(!isFullScreenMapOpen)}
            variant="default"
          >
            {isFullScreenMapOpen ? (
              <>
                <LayoutGrid className="h-4 w-4" />
                Open Spot Page
              </>
            ) : (
              <>
                <Map className="h-4 w-4" />
                Open Map Review
              </>
            )}
          </Button>
          {!isFullScreenMapOpen && (
            <div className="h-[300px] rounded-lg overflow-hidden">
              <MapContainer
                center={mapCenter}
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
                {location?.lat && location?.lng && (
                  <Marker
                    position={[location.lat, location.lng]}
                    icon={customIcon}
                  >
                    <Popup>Selected Location</Popup>
                  </Marker>
                )}
              </MapContainer>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
