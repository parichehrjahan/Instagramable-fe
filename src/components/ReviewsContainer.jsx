import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getReviewsBySpotId, getUserReviewInteractions } from '@/services/api'
import ReviewPin from './ReviewPin'
import ReviewForm from './ReviewForm'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Plus } from 'lucide-react'

export default function ReviewsContainer({ spotId, onBack }) {
  const [showAddReview, setShowAddReview] = useState(false)
  const [columns, setColumns] = useState(3)

  // Responsive column adjustment
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setColumns(2)
      } else if (window.innerWidth < 1024) {
        setColumns(3)
      } else {
        setColumns(4)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const {
    data: reviews,
    isLoading: isLoadingReviews,
    refetch: refetchReviews,
  } = useQuery({
    queryKey: ['reviews', spotId],
    queryFn: () => getReviewsBySpotId(spotId),
  })

  const { data: userInteractions } = useQuery({
    queryKey: ['reviewInteractions', spotId],
    queryFn: () => getUserReviewInteractions(spotId),
    enabled: !!spotId,
  })

  const handleReviewSubmitted = () => {
    setShowAddReview(false)
    refetchReviews()
  }

  // Organize reviews into columns for masonry layout
  const getColumnReviews = () => {
    if (!reviews?.data) return Array.from({ length: columns }, () => [])

    const columnReviews = Array.from({ length: columns }, () => [])

    reviews.data.forEach((review, index) => {
      const columnIndex = index % columns
      columnReviews[columnIndex].push(review)
    })

    return columnReviews
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">All Reviews</h1>
        </div>

        <Button
          onClick={() => setShowAddReview(!showAddReview)}
          variant={showAddReview ? 'outline' : 'default'}
          className={showAddReview ? 'bg-gray-100' : 'bg-black text-white'}
        >
          {showAddReview ? (
            'Cancel'
          ) : (
            <>
              <Plus className="h-4 w-4 mr-1" />
              Add Review
            </>
          )}
        </Button>
      </div>

      {showAddReview && (
        <div className="mb-8">
          <ReviewForm
            spotId={spotId}
            onReviewSubmitted={handleReviewSubmitted}
          />
        </div>
      )}

      {isLoadingReviews ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : reviews?.data?.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            No reviews yet. Be the first to share your experience!
          </p>
          {!showAddReview && (
            <Button
              onClick={() => setShowAddReview(true)}
              className="mt-4 bg-black text-white"
            >
              Write a Review
            </Button>
          )}
        </div>
      ) : (
        <div className="flex gap-3">
          {getColumnReviews().map((columnReviews, columnIndex) => (
            <div key={columnIndex} className="flex-1 flex flex-col gap-4">
              {columnReviews.map((review) => (
                <ReviewPin
                  key={review.id}
                  review={review}
                  userReviewInteractions={userInteractions?.data || []}
                />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
