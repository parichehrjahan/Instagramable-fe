import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getSpot, getStoredSpotStatus, toggleStoredSpot } from '@/services/api'
import { ThumbsUp, ThumbsDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Reviews from './Reviews'

function SpotDetail({ id }) {
  const queryClient = useQueryClient()

  // Query for spot details
  const {
    data: spot,
    isLoading: spotLoading,
    error: spotError,
  } = useQuery({
    queryKey: ['spot', id],
    queryFn: () => getSpot(id),
    select: (data) => data.data,
    enabled: !!id,
  })

  // Query for stored status
  const {
    data: storedStatus,
    isLoading: statusLoading,
    error: statusError,
  } = useQuery({
    queryKey: ['spotStatus', id],
    queryFn: () => getStoredSpotStatus(id),
    select: (data) => ({
      isLiked: data.data?.is_liked === true,
      isDisliked: data.data?.is_liked === false,
    }),
    enabled: !!id,
  })

  // Mutation for toggling stored spot
  const toggleStoredMutation = useMutation({
    mutationFn: ({ id, isLiked, shouldRemove }) =>
      toggleStoredSpot(id, shouldRemove ? null : isLiked),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries(['spotStatus', id])
    },
  })

  const handleStoredSpotToggle = async (isLiked) => {
    const shouldRemove =
      (isLiked && storedStatus?.isLiked) ||
      (!isLiked && storedStatus?.isDisliked)

    toggleStoredMutation.mutate({ id, isLiked, shouldRemove })
  }

  if (spotLoading || statusLoading) return <div>Loading...</div>
  if (spotError || statusError) return <div>Error loading spot details</div>
  if (!spot) return <div>Spot not found</div>

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{spot.name}</h1>

      <div className="flex items-center gap-2 mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleStoredSpotToggle(true)}
          disabled={toggleStoredMutation.isPending}
          className={`${
            storedStatus?.isLiked
              ? 'bg-green-500 hover:bg-green-600 border-green-500'
              : 'hover:bg-green-100'
          }`}
        >
          <ThumbsUp
            className={`h-5 w-5 ${
              storedStatus?.isLiked ? 'text-white' : 'text-green-500'
            }`}
          />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handleStoredSpotToggle(false)}
          disabled={toggleStoredMutation.isPending}
          className={`${
            storedStatus?.isDisliked
              ? 'bg-red-500 hover:bg-red-600 border-red-500'
              : 'hover:bg-red-100'
          }`}
        >
          <ThumbsDown
            className={`h-5 w-5 ${
              storedStatus?.isDisliked ? 'text-white' : 'text-red-500'
            }`}
          />
        </Button>
      </div>

      <div className="mb-8">
        {spot.description && (
          <p className="text-gray-600">{spot.description}</p>
        )}
      </div>

      <Reviews spotId={id} />
    </div>
  )
}

export default SpotDetail
