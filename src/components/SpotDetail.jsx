import { useState, useEffect } from 'react'
import { getReviewsBySpotId } from '@/services/api'
import { ReviewForm } from './ReviewForm'

// ... existing imports and code ...

function Reviews({ spotId }) {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchReviews = async () => {
    try {
      const response = await getReviewsBySpotId(spotId)
      if (response.success) {
        setReviews(response.data)
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [spotId])

  const handleReviewSubmitted = (newReview) => {
    setReviews((prev) => [newReview, ...prev])
  }

  if (loading) return <div>Loading reviews...</div>

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Reviews</h2>
      <ReviewForm spotId={spotId} onReviewSubmitted={handleReviewSubmitted} />

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-5 w-5 ${
                    star <= review.rating
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <p className="text-gray-700">{review.content}</p>
            <p className="text-sm text-gray-500 mt-2">
              {new Date(review.created_at).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

// Add the Reviews component to your SpotDetail component
function SpotDetail() {
  // ... existing code ...

  return (
    <div>
      {/* ... existing spot details ... */}
      <Reviews spotId={spotId} />
    </div>
  )
}
