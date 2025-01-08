import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Bookmark, ChevronLeft, ChevronRight, Star } from 'lucide-react'
import {
  getSpots,
  getCurrentUserStoredSpots,
  toggleSavedSpot,
  getSpotImages,
} from '@/services/api'
import Sidebar from './sidebar'

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

const SpotCard = ({ spot, savedSpotIds, onSaveToggle }) => {
  const navigate = useNavigate()
  const [isSaved, setIsSaved] = useState(false)
  const [spotImages, setSpotImages] = useState([])

  useEffect(() => {
    setIsSaved(savedSpotIds.includes(spot.id))
  }, [savedSpotIds, spot.id])

  useEffect(() => {
    const fetchSpotImages = async () => {
      try {
        const response = await getSpotImages(spot.id)
        if (response.success) {
          setSpotImages(response.data)
        }
      } catch (error) {
        console.error('Error fetching spot images:', error)
      }
    }

    fetchSpotImages()
  }, [spot.id])

  const handleSaveToggle = async (e) => {
    e.stopPropagation()
    try {
      const response = await toggleSavedSpot(spot.id)
      if (response.success) {
        setIsSaved(!isSaved)
        onSaveToggle(spot.id)
      }
    } catch (error) {
      console.error('Error toggling saved spot:', error)
    }
  }

  return (
    <Card
      className="overflow-hidden rounded-lg cursor-pointer"
      onClick={() => navigate(`/spot/${spot.id}`)}
    >
      <ImageCarousel images={spotImages} />
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold">{spot.name}</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSaveToggle}
            className="hover:bg-transparent p-2"
          >
            <Bookmark
              className={`transform scale-150 ${
                isSaved ? 'fill-current' : 'text-gray-500'
              }`}
            />
          </Button>
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
  const [filteredSpots, setFilteredSpots] = useState([])
  const [savedSpotIds, setSavedSpotIds] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [spotsResponse, savedSpotsResponse] = await Promise.all([
          getSpots(),
          getCurrentUserStoredSpots(),
        ])

        if (spotsResponse.success) {
          setSpots(spotsResponse.data)
        }

        if (savedSpotsResponse.success) {
          const savedIds = savedSpotsResponse.data.map((item) => item.spot_id)
          setSavedSpotIds(savedIds)
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleSaveToggle = (spotId) => {
    setSavedSpotIds((prev) =>
      prev.includes(spotId)
        ? prev.filter((id) => id !== spotId)
        : [...prev, spotId]
    )
  }

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371 // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLon = ((lon2 - lon1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  const handleFilterChange = ({
    location,
    distance,
    categories,
    userLocation,
  }) => {
    let filtered = [...spots]

    // Filter by location search
    if (location) {
      filtered = filtered.filter((spot) =>
        spot.address.toLowerCase().includes(location.toLowerCase())
      )
    }

    // Filter by distance if user location is available
    if (userLocation && distance) {
      filtered = filtered.filter((spot) => {
        const spotDistance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          spot.latitude,
          spot.longitude
        )
        return spotDistance <= distance
      })
    }

    // Filter by categories
    if (categories.length > 0) {
      filtered = filtered.filter((spot) =>
        categories.some((category) => spot.categories.includes(category))
      )
    }

    setFilteredSpots(filtered)
  }

  if (loading)
    return <div className="flex justify-center p-8">Loading spots...</div>
  if (error)
    return (
      <div className="flex justify-center p-8 text-red-500">Error: {error}</div>
    )

  return (
    <div className="flex">
      <Sidebar onFilterChange={handleFilterChange} />
      <div className="flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {(filteredSpots.length > 0 ? filteredSpots : spots).map((spot) => (
            <SpotCard
              key={spot.id}
              spot={spot}
              savedSpotIds={savedSpotIds}
              onSaveToggle={handleSaveToggle}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Spots
