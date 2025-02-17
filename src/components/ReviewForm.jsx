import { useState } from 'react'
import { Star, ImagePlus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createReview } from '@/services/api'
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
    <Card>
      <CardHeader>
        <CardTitle>Write a Review</CardTitle>
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
            className="min-h-[100px]"
          />

          {/* Image upload section */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">Add Photos</label>
            <div className="flex flex-wrap gap-2">
              {images.map((img, index) => (
                <div key={index} className="relative">
                  <img
                    src={img.preview}
                    alt={`Preview ${index + 1}`}
                    className="h-24 w-24 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 p-1 bg-white rounded-full shadow"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <Input
                    type="text"
                    placeholder="Add caption"
                    value={img.caption}
                    onChange={(e) => updateImageCaption(index, e.target.value)}
                    className="mt-1 text-xs w-24"
                  />
                </div>
              ))}
              <label className="h-24 w-24 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
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
            className="w-full"
          >
            {isSubmitting ? 'Submitting...' : 'Post Review'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
