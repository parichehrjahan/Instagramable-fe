import { useState } from 'react'
import { Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createReview } from '@/services/api'

export default function ReviewForm({ spotId, onReviewSubmitted }) {
  const [rating, setRating] = useState(0)
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await createReview({
        spot_id: spotId,
        rating,
        content,
      })

      if (response.success) {
        setRating(0)
        setContent('')
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
