import { useState } from 'react'
import { ThumbsUp, ThumbsDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toggleReviewInteraction } from '@/services/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export default function ReviewInteraction({ review, userReviewInteractions }) {
  const queryClient = useQueryClient()
  const [isLoading, setIsLoading] = useState(false)

  const toggleInteractionMutation = useMutation({
    mutationFn: async (isLiked) => {
      return toggleReviewInteraction(review.id, isLiked, review.spot_id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['reviewInteraction', review.id])
      queryClient.invalidateQueries(['spot', review.spot_id])
    },
  })

  const handleInteraction = async (isLiked) => {
    if (isLoading) return

    try {
      setIsLoading(true)
      await toggleInteractionMutation.mutateAsync(isLiked)
    } catch (error) {
      console.error('Error toggling interaction:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const userInteraction = userReviewInteractions?.find(
    (interaction) => interaction.review_id === review.id
  )?.is_liked

  const counts = {
    likes: review.like_count,
    dislikes: review.dislike_count,
  }

  return (
    <div className="flex gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleInteraction(true)}
        disabled={isLoading}
        className={`flex items-center gap-1 ${
          userInteraction === true ? 'text-black' : 'text-gray-500'
        }`}
      >
        <ThumbsUp
          className={`h-4 w-4 ${
            userInteraction === true ? 'fill-black stroke-black' : ''
          }`}
        />
        <span>{counts.likes || 0}</span>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleInteraction(false)}
        disabled={isLoading}
        className={`flex items-center gap-1 ${
          userInteraction === false ? 'text-black' : 'text-gray-500'
        }`}
      >
        <ThumbsDown
          className={`h-4 w-4 ${
            userInteraction === false ? 'fill-black stroke-black' : ''
          }`}
        />
        <span>{counts.dislikes || 0}</span>
      </Button>
    </div>
  )
}
