import { useParams } from 'react-router'
import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  getSpotById,
  getReviewsBySpotId,
  getSpotImages,
  createReview,
} from '@/services/api'
import ReviewForm from '@/components/ReviewForm'
import ReviewInteractions from '@/components/ReviewInteraction'
import SpotReview from '@/components/SpotReview'

const SpotPage = () => {
  const { id } = useParams()
  const [spot, setSpot] = useState(null)
  const [spotImages, setSpotImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentImage, setCurrentImage] = useState(0)
  const [reviews, setReviews] = useState([])

  // Fetch spot data
  useEffect(() => {
    const fetchSpot = async () => {
      try {
        const response = await getSpotById(id)
        if (response.success) {
          setSpot(response.data)
        } else {
          setError('Failed to fetch spot details')
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchSpot()
  }, [id])

  // New useEffect to fetch images
  useEffect(() => {
    const fetchSpotImages = async () => {
      try {
        const response = await getSpotImages(id)
        if (response.success) {
          setSpotImages(response.data)
        }
      } catch (error) {
        console.error('Error fetching spot images:', error)
      }
    }

    if (id) {
      fetchSpotImages()
    }
  }, [id])

  // New useEffect for reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await getReviewsBySpotId(id)
        if (response.success) {
          setReviews(response.data)
        }
      } catch (error) {
        console.error('Error fetching reviews:', error)
      }
    }

    if (id) {
      fetchReviews()
    }
  }, [id])

  const nextImage = (e) => {
    e.stopPropagation()
    setCurrentImage((prev) => (prev + 1) % spotImages.length)
  }

  const prevImage = (e) => {
    e.stopPropagation()
    setCurrentImage(
      (prev) => (prev - 1 + spotImages.length) % spotImages.length
    )
  }

  const handleReviewClick = () => {
    // TODO: Implement review modal/popup
    console.log('Open review modal')
  }

  const handleReviewSubmitted = (newReview) => {
    setReviews((prev) => [newReview, ...prev])
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!spot) return <div>Spot not found</div>

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="relative h-[400px] bg-muted rounded-lg mb-6">
        {spotImages && spotImages.length > 0 ? (
          <>
            <img
              src={spotImages[currentImage]}
              alt={spot.name}
              className="w-full h-full object-cover rounded-lg"
            />
            {spotImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {spotImages.map((_, idx) => (
                    <div
                      key={idx}
                      className={`w-2 h-2 rounded-full ${
                        currentImage === idx ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">No images available</p>
          </div>
        )}
      </div>

      {/* Spot Details */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">{spot.name}</h1>
          <SpotReview
            rating={spot.average_rating}
            reviewCount={spot.review_count}
          />
        </div>

        {/* Description */}
        <Card className="p-4">
          <h2 className="font-semibold mb-2">Description</h2>
          <p className="text-gray-600">{spot.description}</p>
        </Card>

        {/* Reviews Section */}
        <div className="mt-8">
          <ReviewForm spotId={id} onReviewSubmitted={handleReviewSubmitted} />

          <div className="mt-6">
            <h2 className="font-semibold mb-4">Reviews</h2>
            <div className="space-y-4">
              {reviews.length === 0 ? (
                <Card className="p-4">
                  <p className="text-muted-foreground">No reviews yet</p>
                </Card>
              ) : (
                reviews.map((review) => (
                  <Card key={review.id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <p>{review.content}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(review.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <ReviewInteractions review={review} />
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SpotPage
