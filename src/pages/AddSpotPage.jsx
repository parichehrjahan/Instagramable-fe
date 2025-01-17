import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { createSpot } from '@/services/api'
import { ImagePlus, X, Loader2, Search } from 'lucide-react'
import supabase from '@/lib/supabaseClient'
import { useJsApiLoader, Autocomplete } from '@react-google-maps/api'

const libraries = ['places']

const AddSpotPage = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    latitude: null,
    longitude: null,
  })
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [availableCategories, setAvailableCategories] = useState([])
  const [selectedCategories, setSelectedCategories] = useState([])

  const autocompleteRef = useRef(null)

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  })

  const onLoad = useCallback((autocomplete) => {
    autocompleteRef.current = autocomplete
  }, [])

  const onPlaceChanged = useCallback(() => {
    const place = autocompleteRef.current?.getPlace()

    if (place?.geometry) {
      setFormData((prev) => ({
        ...prev,
        location: place.formatted_address,
        latitude: place.geometry.location.lat(),
        longitude: place.geometry.location.lng(),
      }))
    }
  }, [])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('name')

        if (error) throw error
        setAvailableCategories(data)
      } catch (error) {
        console.error('Error fetching categories:', error)
        setError('Failed to load categories')
      }
    }

    fetchCategories()
  }, [])

  const toggleCategory = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files)

    // Validate number of images
    if (files.length + images.length > 5) {
      setError('Maximum 5 images allowed')
      return
    }

    // Validate file types and sizes
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        setError('Only image files are allowed')
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        setError('Each image must be less than 5MB')
        return
      }
    }

    setImages((prev) => [...prev, ...files])
  }

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
    setError(null)
  }

  const uploadImage = async (file) => {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `spots/${fileName}`

      // Get the current session
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        throw new Error('No authenticated session')
      }

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type,
        })

      if (uploadError) {
        console.error('Upload error details:', uploadError)
        throw uploadError
      }

      // Get the correct public URL using Supabase's CDN
      const {
        data: { publicUrl },
      } = supabase.storage.from('images').getPublicUrl(filePath)

      // Verify the URL is accessible
      const urlCheck = await fetch(publicUrl, { method: 'HEAD' })
      if (!urlCheck.ok) {
        throw new Error('Generated URL is not accessible')
      }

      return publicUrl
    } catch (error) {
      console.error('Error uploading image:', error)
      throw error
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Upload images first
      const uploadPromises = images.map(uploadImage)
      const imageUrls = await Promise.all(uploadPromises)

      const spot = await createSpot({
        name: formData.name,
        description: formData.description,
        location: formData.location,
        latitude: formData.latitude,
        longitude: formData.longitude,
        imageURLs: imageUrls,
        categories: selectedCategories,
      })

      navigate(`/spot/${spot.data}`)
    } catch (error) {
      console.error('Error creating spot:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto max-w-2xl py-8">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-6">Add New Spot</h1>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-md mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Images (Max 5)
            </label>
            <div className="grid grid-cols-3 gap-4 mb-4">
              {images.map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden"
                >
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                  >
                    <X className="h-4 w-4 text-white" />
                  </button>
                </div>
              ))}

              {images.length < 5 && (
                <label className="border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center aspect-square cursor-pointer hover:border-gray-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    multiple
                  />
                  <ImagePlus className="h-8 w-8 text-gray-400" />
                  <span className="text-sm text-gray-500 mt-2">Add Images</span>
                  <span className="text-xs text-gray-400 mt-1">
                    Max 5MB each
                  </span>
                </label>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Name *
              </label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Enter spot name"
                required
              />
            </div>

            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium mb-2"
              >
                Location *
              </label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                {isLoaded ? (
                  <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                    <Input
                      name="location"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          location: e.target.value,
                        }))
                      }
                      placeholder="Search location..."
                      className="pl-8"
                      required
                    />
                  </Autocomplete>
                ) : (
                  <Input disabled placeholder="Loading..." className="pl-8" />
                )}
              </div>
              {formData.latitude && formData.longitude && (
                <p className="text-sm text-muted-foreground mt-1">
                  Selected: {formData.location}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium mb-2"
              >
                Description
              </label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Enter description"
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Categories *
              </label>
              <div className="flex flex-wrap gap-2">
                {availableCategories.map((category) => (
                  <Button
                    key={category.id}
                    type="button"
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
              {selectedCategories.length === 0 && (
                <p className="text-sm text-muted-foreground mt-1">
                  Please select at least one category
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/')}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                loading ||
                images.length === 0 ||
                !formData.name ||
                !formData.location ||
                selectedCategories.length === 0
              }
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Spot'
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default AddSpotPage
