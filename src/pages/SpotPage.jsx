import { useParams } from 'react-router'
import { Card } from '@/components/ui/card'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { getSpotById } from '@/services/api'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import ReviewForm from '@/components/ReviewForm'
import ReviewInteractions from '@/components/ReviewInteraction'
import SpotReview from '@/components/SpotReview'
import { useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

const SpotPage = () => {
  const { id } = useParams()
  const [currentImage, setCurrentImage] = useState(0)
  const queryClient = useQueryClient()

  // Fetch spot data
  const {
    data: spot,
    isLoading: spotLoading,
    error: spotError,
  } = useQuery({
    queryKey: ['spot', id],
    queryFn: async () => {
      const response = await getSpotById(id)
      if (!response.success) throw new Error('Failed to fetch spot details')
      console.log(response)
      return response.data
    },
  })

  const spotImages = spot?.spot_images
  const reviews = spot?.reviews
  const userReviewInteractions = spot?.user_review_interaction

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

  const handleReviewSubmitted = (newReview) => {
    // React Query will automatically refetch the reviews
    queryClient.invalidateQueries(['reviews', id])
  }

  const sortedReviews =
    reviews?.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at)) ||
    []

  if (spotLoading)
    return (
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Image skeleton */}
        <Skeleton className="h-[400px] w-full rounded-lg" />

        {/* Title and rating skeleton */}
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-6 w-24" />
        </div>

        {/* Description skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-20 w-full" />
        </div>

        {/* Reviews skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    )
  if (spotError) return <div>Error: {spotError.message}</div>
  if (!spot) return <div>Spot not found</div>

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="relative h-[400px] bg-muted rounded-lg mb-6">
        {spotImages && spotImages.length > 0 ? (
          <>
            <img
              src={spotImages[currentImage].image_url}
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
              {sortedReviews.length === 0 ? (
                <Card className="p-4">
                  <p className="text-muted-foreground">No reviews yet</p>
                </Card>
              ) : (
                sortedReviews.map((review) => (
                  <Card key={review.id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <p>{review.content}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(review.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <ReviewInteractions
                        review={review}
                        userReviewInteractions={userReviewInteractions}
                      />
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
