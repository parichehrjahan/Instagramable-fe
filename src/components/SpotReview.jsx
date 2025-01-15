import { Star } from 'lucide-react'

const SpotReview = ({ rating, reviewCount }) => {
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating)
    const decimal = rating - fullStars

    return (
      <div className="flex gap-0.5 relative">
        {[1, 2, 3, 4, 5].map((star) => {
          if (star <= fullStars) {
            // Full star
            return (
              <Star
                key={star}
                className="h-4 w-4 fill-yellow-400 text-yellow-400"
              />
            )
          } else if (star === fullStars + 1 && decimal > 0) {
            // Partial star
            return (
              <div key={star} className="relative h-4 w-4">
                <Star className="absolute h-4 w-4 text-gray-300" />
                <div
                  className="absolute overflow-hidden"
                  style={{ width: `${decimal * 100}%` }}
                >
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                </div>
              </div>
            )
          } else {
            // Empty star
            return <Star key={star} className="h-4 w-4 text-gray-300" />
          }
        })}
      </div>
    )
  }

  const getRatingText = (rating, reviewCount) => {
    if (!rating) return 'No reviews yet'

    return (
      <div className="flex items-center gap-2">
        {renderStars(rating)}
        <span className="text-sm font-medium">{rating.toFixed(1)}</span>
        <span className="text-sm text-gray-500">•</span>
        <span className="text-sm text-gray-500">
          {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}
        </span>
      </div>
    )
  }

  return getRatingText(rating, reviewCount)
}

export default SpotReview
