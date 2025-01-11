import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { createSpot } from '@/services/api'
import { ImagePlus, X, Loader2 } from 'lucide-react'
import supabase from '@/lib/supabaseClient'

const AddSpotPage = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
  })
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

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
      // Upload all images first
      const uploadPromises = images.map(uploadImage)
      const imageUrls = await Promise.all(uploadPromises)

      // Create spot with image URLs
      const spotData = {
        ...formData,
        images: imageUrls.map((url) => ({
          image_url: url,
        })),
      }

      const response = await createSpot(spotData)

      if (response.success) {
        navigate(`/spot/${response.data.id}`)
      } else {
        throw new Error(response.error || 'Failed to create spot')
      }
    } catch (err) {
      setError(err.message || 'Failed to create spot')
      console.error('Error creating spot:', err)
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
              <Input
                id="location"
                value={formData.location}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, location: e.target.value }))
                }
                placeholder="Enter location"
                required
              />
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
                !formData.location
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
