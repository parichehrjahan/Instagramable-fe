import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Card } from '@/components/ui/card'
import { ThumbsUp, ThumbsDown, Star } from 'lucide-react'
import topicGoldenGateBridge from '../assets/topic-golden-gate-bridge.jpg'
import topicGoldenGateBridge2 from '../assets/goldengate2.jpg'
import topicGoldenGateBridge3 from '../assets/topic-golden-gate-bridge3.jpg'

const Spots = () => {
  const navigate = useNavigate()
  const spot = {
    id: 1,
    name: 'Golden Gate Bridge',
    images: [
      topicGoldenGateBridge,
      topicGoldenGateBridge2,
      topicGoldenGateBridge3,
    ],
    rating: 4,
  }

  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [isDisliked, setIsDisliked] = useState(false)

  // Auto-rotate images
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === spot.images.length - 1 ? 0 : prevIndex + 1
      )
    }, 4000) // Change image every 4 seconds

    return () => clearInterval(timer)
  }, [spot.images.length])

  const handleLike = (e) => {
    e.stopPropagation() // Prevent event bubbling
    setIsLiked(!isLiked)
    if (isDisliked) setIsDisliked(false)
  }

  const handleDislike = (e) => {
    e.stopPropagation() // Prevent event bubbling
    setIsDisliked(!isDisliked)
    if (isLiked) setIsLiked(false)
  }

  const handleSpotClick = () => {
    navigate(`/spot/${spot.id}`)
  }

  return (
    <Card className="overflow-hidden rounded-lg">
      {/* Image Gallery - Clickable */}
      <div
        className="relative h-[400px] bg-muted cursor-pointer"
        onClick={handleSpotClick}
      >
        <div className="absolute inset-0 transition-opacity duration-500">
          <img
            src={spot.images[currentImageIndex]}
            alt={spot.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Image Navigation Dots */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {spot.images.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentImageIndex ? 'bg-white' : 'bg-white/50'
              }`}
              onClick={(e) => {
                e.stopPropagation() // Prevent navigation when clicking dots
                setCurrentImageIndex(index)
              }}
            />
          ))}
        </div>
      </div>

      {/* Location Info, Like/Dislike, and Reviews */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          {/* Name - Clickable */}
          <h3
            className="text-xl font-semibold cursor-pointer hover:text-blue-500"
            onClick={handleSpotClick}
          >
            {spot.name}
          </h3>

          {/* Like/Dislike - Not clickable for navigation */}
          <div className="flex gap-16">
            <button
              onClick={handleLike}
              className="p-2 rounded-full bg-green-100"
            >
              <ThumbsUp
                className={`h-6 w-6 transition-colors ${
                  isLiked
                    ? 'text-green-500 fill-current'
                    : 'text-gray-400 hover:text-green-500'
                }`}
              />
            </button>

            <button
              onClick={handleDislike}
              className="p-2 rounded-full bg-red-100"
            >
              <ThumbsDown
                className={`h-6 w-6 transition-colors ${
                  isDisliked
                    ? 'text-red-500 fill-current'
                    : 'text-gray-400 hover:text-red-500'
                }`}
              />
            </button>
          </div>

          {/* Reviews */}
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, index) => (
              <Star
                key={index}
                className={`h-5 w-5 ${
                  index < spot.rating
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}

export default Spots
