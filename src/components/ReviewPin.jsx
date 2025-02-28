import { useState } from 'react'
import {
  Star,
  Heart,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import ReviewInteraction from './ReviewInteraction'
import { formatDistanceToNow } from 'date-fns'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function ReviewPin({ review, userReviewInteractions }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const hasMultipleImages =
    review.review_images && review.review_images.length > 1

  const nextImage = (e) => {
    e.stopPropagation()
    if (hasMultipleImages) {
      setCurrentImageIndex((prev) =>
        prev === review.review_images.length - 1 ? 0 : prev + 1
      )
    }
  }

  const prevImage = (e) => {
    e.stopPropagation()
    if (hasMultipleImages) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? review.review_images.length - 1 : prev - 1
      )
    }
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
    <div className="rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer">
      {review.review_images && review.review_images.length > 0 ? (
        <div className="relative">
          <img
            src={review.review_images[currentImageIndex].image_url}
            alt={
              review.review_images[currentImageIndex].caption || 'Review image'
            }
            className="w-full object-cover"
          />

          {/* Image navigation arrows */}
          {hasMultipleImages && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronRight className="h-4 w-4" />
              </button>

              {/* Image pagination dots */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                {review.review_images.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1.5 w-1.5 rounded-full ${
                      index === currentImageIndex
                        ? 'bg-white'
                        : 'bg-white bg-opacity-50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      ) : null}

      <div className="p-3">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={review.user_avatar || ''} />
              <AvatarFallback>
                {review.user_name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-xs font-medium">
                {review.user_name || 'Anonymous'}
              </p>
              {renderRating(review.rating)}
            </div>
          </div>
          <p className="text-xs text-gray-500">
            {formatDistanceToNow(new Date(review.created_at), {
              addSuffix: true,
            })}
          </p>
        </div>

        <p className="text-sm line-clamp-3 mb-2">{review.content}</p>

        {review.review_images &&
          review.review_images.length > 0 &&
          review.review_images[currentImageIndex].caption && (
            <p className="text-xs text-gray-500 italic mb-2">
              "{review.review_images[currentImageIndex].caption}"
            </p>
          )}

        <ReviewInteraction
          review={review}
          userReviewInteractions={userReviewInteractions}
        />
      </div>
    </div>
  )
}
