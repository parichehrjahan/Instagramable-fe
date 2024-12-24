import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Card } from '@/components/ui/card'
import { ThumbsUp, ThumbsDown, Star } from 'lucide-react'
import { getSpots } from '@/services/api'

const Spots = () => {
  const navigate = useNavigate()
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

  if (loading) return <div>Loading spots...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {spots.map((spot) => (
        <SpotCard key={spot.id} spot={spot} />
      ))}
    </div>
  )
}

// Separate SpotCard component for better organization
const SpotCard = ({ spot }) => {
  const navigate = useNavigate()
  const [isLiked, setIsLiked] = useState(false)
  const [isDisliked, setIsDisliked] = useState(false)

  const handleLike = (e) => {
    e.stopPropagation()
    setIsLiked(!isLiked)
    if (isDisliked) setIsDisliked(false)
  }

  const handleDislike = (e) => {
    e.stopPropagation()
    setIsDisliked(!isDisliked)
    if (isLiked) setIsLiked(false)
  }

  const handleSpotClick = () => {
    navigate(`/spot/${spot.id}`)
  }

  return (
    <Card className="overflow-hidden rounded-lg">
      <div
        className="relative h-[400px] bg-muted cursor-pointer"
        onClick={handleSpotClick}
      >
        <img
          src={spot.image_url || '/placeholder-image.jpg'}
          alt={spot.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3
            className="text-xl font-semibold cursor-pointer hover:text-blue-500"
            onClick={handleSpotClick}
          >
            {spot.name}
          </h3>

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
        </div>
      </div>
    </Card>
  )
}

export default Spots
