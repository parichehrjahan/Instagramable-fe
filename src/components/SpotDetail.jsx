import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Star, ThumbsUp, ThumbsDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  getReviewsBySpotId,
  toggleStoredSpot,
  getStoredSpotStatus,
  getSpotById,
} from '@/services/api'
import { ReviewForm } from './ReviewForm'

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

function SpotDetail() {
  const { id } = useParams()
  const [spot, setSpot] = useState(null)
  const [loading, setLoading] = useState(true)
  const [storedStatus, setStoredStatus] = useState({
    isLiked: null,
    isDisliked: null,
  })

  useEffect(() => {
    const fetchSpot = async () => {
      try {
        const response = await getSpotById(id)
        if (response.success) {
          setSpot(response.data)
        }
      } catch (error) {
        console.error('Error fetching spot:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSpot()
  }, [id])

  useEffect(() => {
    const fetchStoredStatus = async () => {
      try {
        const response = await getStoredSpotStatus(id)
        if (response.success) {
          setStoredStatus({
            isLiked: response.data?.is_liked === true,
            isDisliked: response.data?.is_liked === false,
          })
        }
      } catch (error) {
        console.error('Error fetching stored status:', error)
      }
    }

    if (id) {
      fetchStoredStatus()
    }
  }, [id])

  const handleStoredSpotToggle = async (isLiked) => {
    try {
      const shouldRemove =
        (isLiked && storedStatus.isLiked) ||
        (!isLiked && storedStatus.isDisliked)

      const response = await toggleStoredSpot(id, shouldRemove ? null : isLiked)

      if (response.success) {
        if (shouldRemove) {
          setStoredStatus({
            isLiked: null,
            isDisliked: null,
          })
        } else {
          setStoredStatus({
            isLiked: isLiked === true ? true : null,
            isDisliked: isLiked === false ? true : null,
          })
        }
      }
    } catch (error) {
      console.error('Error toggling stored spot:', error)
    }
  }

  if (loading) return <div>Loading...</div>
  if (!spot) return <div>Spot not found</div>

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{spot.name}</h1>

      <div className="flex items-center gap-2 mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleStoredSpotToggle(true)}
          className={`${
            storedStatus.isLiked
              ? 'bg-green-500 hover:bg-green-600 border-green-500'
              : 'hover:bg-green-100'
          }`}
        >
          <ThumbsUp
            className={`h-5 w-5 ${
              storedStatus.isLiked ? 'text-white' : 'text-green-500'
            }`}
          />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handleStoredSpotToggle(false)}
          className={`${
            storedStatus.isDisliked
              ? 'bg-red-500 hover:bg-red-600 border-red-500'
              : 'hover:bg-red-100'
          }`}
        >
          <ThumbsDown
            className={`h-5 w-5 ${
              storedStatus.isDisliked ? 'text-white' : 'text-red-500'
            }`}
          />
        </Button>
      </div>

      <div className="mb-8">
        {spot.description && (
          <p className="text-gray-600">{spot.description}</p>
        )}
      </div>

      <Reviews spotId={id} />
    </div>
  )
}

export default SpotDetail
