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
