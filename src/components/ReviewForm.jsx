import { useState } from 'react'
import { Star, ImagePlus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createReview, uploadImage } from '@/services/api'
import { Input } from '@/components/ui/input'

export default function ReviewForm({ spotId, onReviewSubmitted }) {
  const [rating, setRating] = useState(0)
  const [content, setContent] = useState('')
  const [images, setImages] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      caption: '',
    }))
    setImages((prev) => [...prev, ...newImages])
  }

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const updateImageCaption = (index, caption) => {
    setImages((prev) =>
      prev.map((img, i) => (i === index ? { ...img, caption } : img))
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // First, upload all images to storage
      const uploadedImages = await Promise.all(
        images.map(async (img) => {
          const formData = new FormData()
          formData.append('image', img.file)
          const response = await uploadImage(formData) // You'll need to implement this API function
          return {
            url: response.url,
            caption: img.caption,
          }
        })
      )

      const response = await createReview({
        spot_id: spotId,
        rating,
        content,
        images: uploadedImages,
      })

      if (response.success) {
        setRating(0)
        setContent('')
        setImages([])
        onReviewSubmitted(response.data)
      }
    } catch (error) {
      console.error('Failed to submit review:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Share your experience</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((value) => (
              <Button
                key={value}
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setRating(value)}
                className="p-1 hover:bg-transparent"
              >
                <Star
                  className={`h-6 w-6 ${
                    value <= rating
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-muted-foreground'
                  }`}
                />
              </Button>
            ))}
          </div>

          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your experience..."
            className="min-h-[100px] resize-none border-gray-200"
          />

          {/* Image upload section - Pinterest style */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">Add Photos</label>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {images.map((img, index) => (
                <div key={index} className="relative group">
                  <img
                    src={img.preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full aspect-auto object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg">
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 p-1 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                  <Input
                    type="text"
                    placeholder="Add caption"
                    value={img.caption}
                    onChange={(e) => updateImageCaption(index, e.target.value)}
                    className="mt-1 text-xs w-full"
                  />
                </div>
              ))}
              <label className="border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors aspect-square">
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <ImagePlus className="h-6 w-6 text-gray-400" />
              </label>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || !rating || !content.trim()}
            className="w-full bg-black hover:bg-gray-800 text-white"
          >
            {isSubmitting ? 'Submitting...' : 'Post Review'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
