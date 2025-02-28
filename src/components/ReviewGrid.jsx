import { useState, useEffect } from 'react'
import { Star, Heart, MessageCircle } from 'lucide-react'
import ReviewInteraction from './ReviewInteraction'
import { formatDistanceToNow } from 'date-fns'

export default function ReviewGrid({ reviews, userReviewInteractions }) {
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

  // Organize reviews into columns for masonry layout
  const getColumnReviews = () => {
    const columnReviews = Array.from({ length: columns }, () => [])

    reviews.forEach((review, index) => {
      const columnIndex = index % columns
      columnReviews[columnIndex].push(review)
    })

    return columnReviews
  }

  const renderRating = (rating) => {
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-3 w-3 ${
              i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="text-xs ml-1">{rating.toFixed(1)}</span>
      </div>
    )
  }

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-4">All Reviews</h2>

      <div className="flex gap-2">
        {getColumnReviews().map((columnReviews, columnIndex) => (
          <div key={columnIndex} className="flex-1 flex flex-col gap-3">
            {columnReviews.map((review) => {
              const hasImages =
                review.review_images && review.review_images.length > 0

              return (
                <div
                  key={review.id}
                  className="rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  {hasImages && (
                    <div className="relative">
                      <img
                        src={review.review_images[0].image_url}
                        alt={review.review_images[0].caption || 'Review image'}
                        className="w-full object-cover"
                      />
                      {review.review_images.length > 1 && (
                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full">
                          +{review.review_images.length - 1}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        {renderRating(review.rating)}
                        <p className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(review.created_at), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                      <ReviewInteraction
                        review={review}
                        userReviewInteractions={userReviewInteractions}
                      />
                    </div>

                    <p className="text-sm line-clamp-3">{review.content}</p>

                    {review.review_images &&
                      review.review_images.length > 0 &&
                      review.review_images[0].caption && (
                        <p className="text-xs text-gray-500 mt-1 italic">
                          "{review.review_images[0].caption}"
                        </p>
                      )}
                  </div>
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
