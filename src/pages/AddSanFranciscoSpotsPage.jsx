import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, MapPin, Search, Plus, X } from 'lucide-react'
import { createSpot, getCategories } from '@/services/api'
import { useQuery } from '@tanstack/react-query'
import { uploadSpotImages } from '@/lib/utils'
import { useJsApiLoader, Autocomplete } from '@react-google-maps/api'

const libraries = ['places']

const sfBounds = {
  north: 37.93, // North boundary (latitude)
  south: 37.7, // South boundary (latitude)
  east: -122.35, // East boundary (longitude)
  west: -122.52, // West boundary (longitude)
}

const AddSanFranciscoSpotsPage = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [selectedPlace, setSelectedPlace] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    latitude: null,
    longitude: null,
  })
  const [selectedCategories, setSelectedCategories] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [autocomplete, setAutocomplete] = useState(null)
  const [images, setImages] = useState([])
  const [addedSpots, setAddedSpots] = useState([])

  // Load Google Maps API
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  })

  // Fetch categories
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  })

  const categories = categoriesData?.data || []

  // Set up autocomplete
  const onLoad = (autocomplete) => {
    // Restrict search to San Francisco area
    autocomplete.setBounds(sfBounds)
    autocomplete.setOptions({
      strictBounds: true,
      componentRestrictions: { country: 'us' },
      fields: ['place_id', 'geometry', 'name', 'formatted_address', 'photos'],
    })
    setAutocomplete(autocomplete)
  }

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace()
      if (place.geometry) {
        setSelectedPlace(place)
        setFormData({
          name: place.name,
          description: '',
          location: place.formatted_address,
          latitude: place.geometry.location.lat(),
          longitude: place.geometry.location.lng(),
        })
        setSearchQuery(place.name)
      }
    }
  }

  // Handle search for Instagram-worthy places in SF
  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    setSearchResults([])

    try {
      // Use Google Places API to search for places
      const service = new window.google.maps.places.PlacesService(
        document.createElement('div')
      )

      const request = {
        query: `${searchQuery} instagram worthy San Francisco`,
        bounds: new window.google.maps.LatLngBounds(
          new window.google.maps.LatLng(sfBounds.south, sfBounds.west),
          new window.google.maps.LatLng(sfBounds.north, sfBounds.east)
        ),
        type: [
          'tourist_attraction',
          'point_of_interest',
          'park',
          'restaurant',
          'cafe',
        ],
      }

      service.textSearch(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          // Filter results to only include places in San Francisco
          const sfResults = results.filter((place) => {
            const lat = place.geometry.location.lat()
            const lng = place.geometry.location.lng()
            return (
              lat >= sfBounds.south &&
              lat <= sfBounds.north &&
              lng >= sfBounds.west &&
              lng <= sfBounds.east
            )
          })
          setSearchResults(sfResults)
        } else {
          console.error('Places search failed:', status)
        }
        setIsSearching(false)
      })
    } catch (error) {
      console.error('Error searching for places:', error)
      setIsSearching(false)
    }
  }

  const selectPlace = (place) => {
    setSelectedPlace(place)
    setFormData({
      name: place.name,
      description: '',
      location: place.formatted_address,
      latitude: place.geometry.location.lat(),
      longitude: place.geometry.location.lng(),
    })
  }

  const toggleCategory = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)

    // Validate number of images
    if (files.length + images.length > 5) {
      alert('Maximum 5 images allowed')
      return
    }

    // Create preview URLs
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }))

    setImages((prev) => [...prev, ...newImages])
  }

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (
      !formData.name ||
      !formData.location ||
      !formData.latitude ||
      !formData.longitude
    ) {
      alert('Please select a place')
      return
    }

    if (selectedCategories.length === 0) {
      alert('Please select at least one category')
      return
    }

    setIsLoading(true)

    try {
      // Upload images
      const imageFiles = images.map((img) => img.file)
      const imageURLs = await uploadSpotImages(imageFiles)

      // Create spot
      const response = await createSpot({
        name: formData.name,
        description: formData.description,
        location: formData.location,
        latitude: formData.latitude,
        longitude: formData.longitude,
        imageURLs: imageURLs,
        categories: selectedCategories,
      })

      if (response.success) {
        // Add to added spots list
        setAddedSpots((prev) => [
          ...prev,
          {
            id: response.data,
            name: formData.name,
            imageUrl: images.length > 0 ? images[0].preview : null,
          },
        ])

        // Reset form
        setFormData({
          name: '',
          description: '',
          location: '',
          latitude: null,
          longitude: null,
        })
        setSelectedPlace(null)
        setSelectedCategories([])
        setImages([])
        setSearchQuery('')
      }
    } catch (error) {
      console.error('Error creating spot:', error)
      alert('Failed to create spot: ' + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  // Clean up image previews on unmount
  useEffect(() => {
    return () => {
      images.forEach((image) => {
        if (image.preview) URL.revokeObjectURL(image.preview)
      })
    }
  }, [images])

  return (
    <div className="container mx-auto py-8 max-w-5xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                Add San Francisco Spots
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Search for a Place</h3>
                <div className="flex gap-2 mb-4">
                  {isLoaded ? (
                    <Autocomplete
                      onLoad={onLoad}
                      onPlaceChanged={onPlaceChanged}
                      restrictions={{ country: 'us' }}
                    >
                      <div className="relative flex-1">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search for Instagram-worthy spots in SF..."
                          className="pl-8"
                        />
                      </div>
                    </Autocomplete>
                  ) : (
                    <Input
                      disabled
                      placeholder="Loading..."
                      className="flex-1"
                    />
                  )}
                  <Button
                    onClick={handleSearch}
                    disabled={isSearching || !isLoaded}
                  >
                    {isSearching ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      'Search'
                    )}
                  </Button>
                </div>

                {/* Search Results */}
                {searchResults.length > 0 && (
                  <div className="border rounded-md p-4 mb-6">
                    <h4 className="font-medium mb-2">Search Results</h4>
                    <div className="max-h-60 overflow-y-auto space-y-2">
                      {searchResults.map((place, index) => (
                        <div
                          key={index}
                          className={`p-2 rounded-md cursor-pointer flex items-center gap-2 ${
                            selectedPlace?.place_id === place.place_id
                              ? 'bg-primary/10 border border-primary/30'
                              : 'hover:bg-gray-100'
                          }`}
                          onClick={() => selectPlace(place)}
                        >
                          <MapPin className="h-4 w-4 text-primary" />
                          <div>
                            <p className="font-medium">{place.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {place.formatted_address}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add Spot Form */}
                {selectedPlace && (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Name
                      </label>
                      <Input
                        value={formData.name}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Description
                      </label>
                      <Textarea
                        value={formData.description}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        placeholder="Describe what makes this spot Instagram-worthy..."
                        rows={3}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Location
                      </label>
                      <Input value={formData.location} readOnly />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Categories
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {categories.map((category) => (
                          <Button
                            key={category.id}
                            type="button"
                            variant={
                              selectedCategories.includes(category.id)
                                ? 'default'
                                : 'outline'
                            }
                            size="sm"
                            className="rounded-full"
                            onClick={() => toggleCategory(category.id)}
                          >
                            {category.name}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Images (Max 5)
                      </label>
                      <div className="grid grid-cols-3 gap-2 mb-2">
                        {images.map((image, index) => (
                          <div key={index} className="relative aspect-square">
                            <img
                              src={image.preview}
                              alt={`Preview ${index}`}
                              className="w-full h-full object-cover rounded-md"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-1 right-1 bg-black/50 rounded-full p-1 text-white"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}

                        {images.length < 5 && (
                          <label className="border-2 border-dashed rounded-md flex items-center justify-center aspect-square cursor-pointer hover:border-primary/50 transition-colors">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                              multiple
                            />
                            <Plus className="h-6 w-6 text-muted-foreground" />
                          </label>
                        )}
                      </div>
                    </div>

                    <div className="pt-2">
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading || selectedCategories.length === 0}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Adding Spot...
                          </>
                        ) : (
                          'Add Spot'
                        )}
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Added Spots */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Added Spots</CardTitle>
            </CardHeader>
            <CardContent>
              {addedSpots.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  No spots added yet
                </p>
              ) : (
                <div className="space-y-3">
                  {addedSpots.map((spot, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-2 border rounded-md hover:bg-gray-50 cursor-pointer"
                      onClick={() => navigate(`/spot/${spot.id}`)}
                    >
                      {spot.imageUrl ? (
                        <img
                          src={spot.imageUrl}
                          alt={spot.name}
                          className="w-12 h-12 object-cover rounded-md"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
                          <MapPin className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{spot.name}</p>
                        <Button
                          variant="link"
                          size="sm"
                          className="h-auto p-0 text-xs"
                          onClick={(e) => {
                            e.stopPropagation()
                            navigate(`/spot/${spot.id}`)
                          }}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => navigate('/')}
                >
                  Back to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default AddSanFranciscoSpotsPage
