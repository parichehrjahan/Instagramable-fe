import { useParams } from 'react-router'
import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Star, Plus } from 'lucide-react'
import { getSpotById } from '@/services/api'

const SpotPage = () => {
  const { id } = useParams()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [spot, setSpot] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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

  // Auto-rotate images
  useEffect(() => {
    if (!spot?.image_urls?.length) return

    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === spot.image_urls.length - 1 ? 0 : prevIndex + 1
      )
    }, 4000)

    return () => clearInterval(timer)
  }, [spot?.image_urls?.length])

  const handleReviewClick = () => {
    // TODO: Implement review modal/popup
    console.log('Open review modal')
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
        {spot.image_urls && spot.image_urls.length > 0 ? (
          <>
            <div className="absolute inset-0 transition-opacity duration-500">
              <img
                src={spot.image_urls[currentImageIndex]}
                alt={spot.name}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>

            {/* Image Navigation Dots */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              {spot.image_urls.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
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
        <div>
          <h2 className="font-semibold mb-4">Reviews</h2>
          {/* Reviews will go here */}
          <div className="space-y-4">
            {/* Placeholder for reviews */}
            <Card className="p-4">
              <p className="text-gray-600">No reviews yet</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SpotPage
