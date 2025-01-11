import { useParams } from 'react-router'
import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Star, Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import { getSpotById, getReviewsBySpotId, getSpotImages } from '@/services/api'
import ReviewForm from '@/components/ReviewForm'

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

  if (loading) return <div className="flex justify-center p-8">Loading...</div>
  if (error)
    return (
      <div className="flex justify-center p-8 text-red-500">Error: {error}</div>
    )
  if (!spot)
    return <div className="flex justify-center p-8">Spot not found</div>

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Image Gallery */}
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{spot.name}</h1>
            <p className="text-gray-600">{spot.address}</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex">
              {[...Array(5)].map((_, index) => (
                <Star
                  key={index}
                  className={`h-5 w-5 ${
                    index < (spot.srating || 0)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={handleReviewClick}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
            >
              Write Review
            </button>
          </div>
        </div>

        {/* Description */}
        <Card className="p-4">
          <h2 className="font-semibold mb-2">Description</h2>
          <p className="text-gray-600">{spot.description}</p>
        </Card>

        {/* Your Posts Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Your Posts</h2>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Plus className="h-5 w-5" />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {/* Grid of user posts - placeholder for now */}
            <div className="aspect-square bg-gray-100 rounded-lg"></div>
            <div className="aspect-square bg-gray-100 rounded-lg"></div>
            <div className="aspect-square bg-gray-100 rounded-lg"></div>
          </div>
        </div>

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
                    <div className="flex items-center gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= review.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-muted-foreground'
                          }`}
                        />
                      ))}
                    </div>
                    <p>{review.content}</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      {new Date(review.created_at).toLocaleDateString()}
                    </p>
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
