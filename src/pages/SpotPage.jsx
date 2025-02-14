import { useParams } from 'react-router'
import { Card } from '@/components/ui/card'
import { ChevronLeft, ChevronRight, X, Plus } from 'lucide-react'
import { getSpotById } from '@/services/api'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import ReviewForm from '@/components/ReviewForm'
import ReviewInteractions from '@/components/ReviewInteraction'
import SpotReview from '@/components/SpotReview'
import { useState, useEffect } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import supabase from '@/lib/supabaseClient'
import { optimizeImage } from '@/lib/imageUtils'
import { Dialog, DialogContent } from '@/components/ui/dialog'

const SpotPage = () => {
  const { id } = useParams()
  const [currentImage, setCurrentImage] = useState(0)
  const queryClient = useQueryClient()
  const [currentUserId, setCurrentUserId] = useState(null)
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  // Add this useEffect to get the current user
  useEffect(() => {
    const getCurrentUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (session) {
        setCurrentUserId(session.user.id)
      }
    }
    getCurrentUser()
  }, [])

  // Fetch spot data
  const {
    data: spot,
    isLoading: spotLoading,
    error: spotError,
  } = useQuery({
    queryKey: ['spot', id],
    queryFn: async () => {
      const response = await getSpotById(id)
      if (!response.success) throw new Error('Failed to fetch spot details')
      return response.data
    },
  })

  const spotImages = spot?.spot_images
  const reviews = spot?.reviews
  const userReviewInteractions = spot?.user_review_interaction

  // Filter images based on is_gallery flag
  const carouselImages = spotImages
  const galleryImages =
    spotImages?.filter((image) => image.is_gallery === true) || [] // Only true for gallery

  // Add autoplay interval (5 seconds)
  useEffect(() => {
    if (carouselImages?.length > 1) {
      const interval = setInterval(() => {
        setCurrentImage((prev) => (prev + 1) % carouselImages.length)
      }, 3000) // Change image every 3 seconds

      return () => clearInterval(interval)
    }
  }, [carouselImages])

  const nextImage = (e) => {
    e.stopPropagation()
    setCurrentImage((prev) => (prev + 1) % carouselImages.length)
  }

  const prevImage = (e) => {
    e.stopPropagation()
    setCurrentImage(
      (prev) => (prev - 1 + carouselImages.length) % carouselImages.length
    )
  }

  const handleReviewSubmitted = () => {
    // React Query will automatically refetch the reviews
    queryClient.invalidateQueries(['reviews', id])
  }

  const handleDeleteImage = async (imageUrl) => {
    try {
      const {
        data: { session },
        error: authError,
      } = await supabase.auth.getSession()

      if (authError || !session) {
        throw new Error('Please login to delete images')
      }

      const { error } = await supabase.rpc('delete_spot_and_user_image', {
        p_image_url: imageUrl,
        p_user_id: session.user.id,
      })

      if (error) throw error

      // Refresh the spot data
      queryClient.invalidateQueries(['spot', id])
      await queryClient.refetchQueries(['spot', id])
    } catch (error) {
      console.error('Failed to delete image:', error)
      alert(error.message || 'Failed to delete image. Please try again.')
    }
  }

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      // Optimize image before upload
      const optimizedFile = await optimizeImage(file)

      const {
        data: { session },
        error: authError,
      } = await supabase.auth.getSession()

      if (authError || !session) {
        throw new Error('Please login to upload images')
      }

      // Create unique filename with .webp extension
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.webp`
      const filePath = `spots/${fileName}`

      // Upload optimized file to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, optimizedFile, {
          cacheControl: '3600',
          upsert: false,
          contentType: 'image/webp',
        })

      if (uploadError) {
        console.error('Upload error details:', uploadError)
        throw uploadError
      }

      // Get the public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from('images').getPublicUrl(filePath)

      // Start a Supabase transaction to insert into both tables
      const { error: transactionError } = await supabase.rpc(
        'add_spot_and_user_image',
        {
          p_spot_id: id,
          p_user_id: session.user.id,
          p_image_url: publicUrl,
          p_is_gallery: true,
        }
      )

      if (transactionError) {
        console.error('Transaction error:', transactionError)
        throw transactionError
      }

      // Refresh the spot data
      queryClient.invalidateQueries(['spot', id])
      await queryClient.refetchQueries(['spot', id])
    } catch (error) {
      console.error('Failed to upload image:', error)
      alert(error.message || 'Failed to upload image. Please try again.')
    }
  }

  const sortedReviews =
    reviews?.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at)) ||
    []

  const openImageModal = (index) => {
    setSelectedImageIndex(index)
    setIsImageModalOpen(true)
  }

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % galleryImages.length)
  }

  const handlePrevImage = () => {
    setSelectedImageIndex(
      (prev) => (prev - 1 + galleryImages.length) % galleryImages.length
    )
  }

  if (spotLoading)
    return (
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Image skeleton */}
        <Skeleton className="h-[400px] w-full rounded-lg" />

        {/* Title and rating skeleton */}
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-6 w-24" />
        </div>

        {/* Description skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-20 w-full" />
        </div>

        {/* Reviews skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    )
  if (spotError) return <div>Error: {spotError.message}</div>
  if (!spot) return <div>Spot not found</div>

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="relative h-[400px] bg-muted rounded-lg mb-6">
        {carouselImages.length > 0 ? (
          <>
            <img
              src={carouselImages[currentImage].image_url}
              alt={spot.name}
              className="w-full h-full object-cover rounded-lg"
            />
            {carouselImages.length > 1 && (
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
                  {carouselImages.map((_, idx) => (
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
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">No images available</p>
          </div>
        )}
      </div>

      {/* Spot Details */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">{spot.name}</h1>
          <SpotReview
            rating={spot.average_rating}
            reviewCount={spot.review_count}
          />
        </div>

        {/* Description */}
        <Card className="p-4">
          <h2 className="font-semibold mb-2">Description</h2>
          <p className="text-gray-600">{spot.description}</p>
        </Card>

        {/* Gallery Section */}
        <Card className="p-4">
          <h2 className="font-semibold mb-2">Gallery</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Share your photos of this spot
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {galleryImages.map((image, idx) => (
              <div key={idx} className="relative group">
                <img
                  src={image.image_url}
                  alt={`Spot image ${idx + 1}`}
                  className="w-full h-48 object-cover rounded-lg cursor-pointer"
                  onClick={() => openImageModal(idx)}
                />
                {image.user_id === currentUserId && (
                  <button
                    onClick={() => handleDeleteImage(image.image_url)}
                    className="absolute top-2 right-2 p-2 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
            <label className="border-2 border-dashed border-gray-300 rounded-lg h-48 flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <div className="text-center">
                <Plus className="h-8 w-8 mx-auto text-gray-400" />
                <span className="text-sm text-gray-500">Add Photo</span>
              </div>
            </label>
          </div>
        </Card>

        {/* Add the Image Modal */}
        <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
          <DialogContent className="max-w-[90vw] h-[90vh] p-0">
            <div className="relative w-full h-full flex items-center justify-center bg-black">
              <button
                onClick={() => setIsImageModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white z-50"
              >
                <X className="h-6 w-6" />
              </button>

              {galleryImages.length > 0 && (
                <img
                  src={galleryImages[selectedImageIndex].image_url}
                  alt={`Full size spot image ${selectedImageIndex + 1}`}
                  className="max-h-full max-w-full object-contain"
                />
              )}

              {galleryImages.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-4 p-2 rounded-full bg-black/50 text-white"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 p-2 rounded-full bg-black/50 text-white"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Reviews Section */}
        <div className="mt-8">
          <ReviewForm spotId={id} onReviewSubmitted={handleReviewSubmitted} />

          <div className="mt-6">
            <h2 className="font-semibold mb-4">Reviews</h2>
            <div className="space-y-4">
              {sortedReviews.length === 0 ? (
                <Card className="p-4">
                  <p className="text-muted-foreground">No reviews yet</p>
                </Card>
              ) : (
                sortedReviews.map((review) => (
                  <Card key={review.id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <p>{review.content}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(review.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <ReviewInteractions
                        review={review}
                        userReviewInteractions={userReviewInteractions}
                      />
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SpotPage
