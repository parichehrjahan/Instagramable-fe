import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Bookmark, Star, Trash2 } from 'lucide-react'
import { toggleSavedSpot, deleteSpot } from '@/services/api'
import ImageCarousel from './ImageCarousel'
import DeleteSpotDialog from './DeleteSpotDialog'

const SpotCard = ({ spot, savedSpotIds, onSaveToggle }) => {
  const navigate = useNavigate()
  const [isSaved, setIsSaved] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    setIsSaved(savedSpotIds.includes(spot.id))
  }, [savedSpotIds, spot.id])

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

  const handleDelete = async (e) => {
    e.stopPropagation()
    setIsDeleting(true)
    try {
      const response = await deleteSpot(spot.id)
      if (response.success) {
        window.location.reload()
      }
    } catch (error) {
      console.error('Error deleting spot:', error)
    } finally {
      setIsDeleting(false)
      setIsDeleteDialogOpen(false)
    }
  }

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

    const reviewText = reviewCount === 1 ? 'review' : 'reviews'
    return (
      <div className="flex items-center gap-2">
        {renderStars(rating)}
        <span className="text-sm font-medium">{rating.toFixed(1)}</span>
        <span className="text-sm text-gray-500">•</span>
        <span className="text-sm text-gray-500">
          {reviewCount} {reviewText}
        </span>
      </div>
    )
  }

  return (
    <>
      <Card
        className="overflow-hidden rounded-lg cursor-pointer"
        onClick={() => navigate(`/spot/${spot.id}`)}
      >
        <ImageCarousel images={spot.spot_images} />
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-semibold">{spot.name}</h3>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  setIsDeleteDialogOpen(true)
                }}
                className="hover:bg-transparent p-2"
              >
                <Trash2 className="h-5 w-5 text-red-500" />
              </Button>
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
          </div>
          <p className="text-sm text-gray-500 mb-2">{spot.address}</p>
          <p className="text-sm text-gray-600 line-clamp-2">
            {spot.description}
          </p>
          <div className="flex items-center justify-between mt-2">
            {getRatingText(spot.average_rating, spot.review_count)}
          </div>
        </div>
      </Card>

      <DeleteSpotDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        spotName={spot.name}
        onDelete={handleDelete}
        isDeleting={isDeleting}
      />
    </>
  )
}

export default SpotCard
