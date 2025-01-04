import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  ThumbsUp,
  ThumbsDown,
  Star,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { getSpots, toggleStoredSpot, getStoredSpotStatus } from '@/services/api'

const ImageCarousel = ({ images }) => {
  if (!images || images.length === 0) {
    return (
      <div className="relative h-[400px] bg-muted flex items-center justify-center">
        <p>No images available</p>
      </div>
    )
  }

  const [currentImage, setCurrentImage] = useState(0)

  const nextImage = (e) => {
    e.stopPropagation()
    setCurrentImage((prev) => (prev + 1) % images.length)
  }

  const prevImage = (e) => {
    e.stopPropagation()
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <div className="relative h-[400px] bg-muted">
      <img
        src={images[currentImage]}
        alt="Spot"
        className="w-full h-full object-cover"
      />
      {images.length > 1 && (
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
            {images.map((_, idx) => (
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
    </div>
  )
}

const SpotCard = ({ spot }) => {
  const navigate = useNavigate()
  const [storedStatus, setStoredStatus] = useState({
    isLiked: null,
    isDisliked: null,
  })

  useEffect(() => {
    const fetchStoredStatus = async () => {
      try {
        const response = await getStoredSpotStatus(spot.id)
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

    fetchStoredStatus()
  }, [spot.id])

  const handleStoredSpotToggle = async (e, isLiked) => {
    e.stopPropagation() // Prevent navigation when clicking the buttons
    try {
      const shouldRemove =
        (isLiked && storedStatus.isLiked) ||
        (!isLiked && storedStatus.isDisliked)

      const response = await toggleStoredSpot(
        spot.id,
        shouldRemove ? null : isLiked
      )

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

  return (
    <Card
      className="overflow-hidden rounded-lg cursor-pointer"
      onClick={() => navigate(`/spot/${spot.id}`)}
    >
      <ImageCarousel images={spot.image_urls} />
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold">{spot.name}</h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => handleStoredSpotToggle(e, true)}
              className={`${
                storedStatus.isLiked
                  ? 'bg-green-500 hover:bg-green-600 border-green-500'
                  : 'hover:bg-green-100'
              }`}
            >
              <ThumbsUp
                className={`h-4 w-4 ${
                  storedStatus.isLiked ? 'text-white' : 'text-green-500'
                }`}
              />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => handleStoredSpotToggle(e, false)}
              className={`${
                storedStatus.isDisliked
                  ? 'bg-red-500 hover:bg-red-600 border-red-500'
                  : 'hover:bg-red-100'
              }`}
            >
              <ThumbsDown
                className={`h-4 w-4 ${
                  storedStatus.isDisliked ? 'text-white' : 'text-red-500'
                }`}
              />
            </Button>
          </div>
        </div>
        <p className="text-sm text-gray-500 mb-2">{spot.address}</p>
        <p className="text-sm text-gray-600 line-clamp-2">{spot.description}</p>
        <div className="flex items-center mt-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-5 w-5 ${
                star <= spot.rating
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </Card>
  )
}

const Spots = () => {
  const [spots, setSpots] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchSpots = async () => {
      try {
        const response = await getSpots()
        if (response.success) {
          setSpots(response.data)
        } else {
          setError('Failed to fetch spots')
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchSpots()
  }, [])

  if (loading)
    return <div className="flex justify-center p-8">Loading spots...</div>
  if (error)
    return (
      <div className="flex justify-center p-8 text-red-500">Error: {error}</div>
    )

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {spots.map((spot) => (
        <SpotCard key={spot.id} spot={spot} />
      ))}
    </div>
  )
}

export default Spots
