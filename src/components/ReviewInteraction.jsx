import { useState } from 'react'
import { ThumbsUp, ThumbsDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toggleReviewInteraction } from '@/services/api'
import supabase from '@/lib/supabaseClient'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export default function ReviewInteraction({ review }) {
  const queryClient = useQueryClient()
  const [isLoading, setIsLoading] = useState(false)

  // Query for getting interaction status
  const { data: interactionData } = useQuery({
    queryKey: ['reviewInteraction', review.id],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return null

      const { data, error } = await supabase
        .from('review_interactions')
        .select('is_liked')
        .eq('review_id', review.id)
        .eq('user_id', user.id)
        .maybeSingle()

      if (error && error.code !== 'PGRST116') throw error
      return data
    },
    select: (data) => data?.is_liked,
  })

  // Mutation for toggling interaction
  const toggleInteractionMutation = useMutation({
    mutationFn: async ({ reviewId, isLiked }) => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      return toggleReviewInteraction(reviewId, isLiked)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['reviewInteraction', review.id])
      // Also invalidate the review counts if you have them
      queryClient.invalidateQueries(['reviewCounts', review.id])
    },
  })

  const handleInteraction = async (isLiked) => {
    try {
      setIsLoading(true)
      await toggleInteractionMutation.mutateAsync({
        reviewId: review.id,
        isLiked,
      })
    } catch (error) {
      console.error('Error toggling interaction:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleInteraction(true)}
        disabled={isLoading || toggleInteractionMutation.isPending}
        className={`flex items-center gap-1 ${
          interactionData === true ? 'text-black' : 'text-gray-500'
        }`}
      >
        <ThumbsUp
          className={`h-4 w-4 ${
            interactionData === true ? 'fill-black stroke-black' : ''
          }`}
        />
        <span>{review.like_count || 0}</span>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleInteraction(false)}
        disabled={isLoading || toggleInteractionMutation.isPending}
        className={`flex items-center gap-1 ${
          interactionData === false ? 'text-black' : 'text-gray-500'
        }`}
      >
        <ThumbsDown
          className={`h-4 w-4 ${
            interactionData === false ? 'fill-black stroke-black' : ''
          }`}
        />
        <span>{review.dislike_count || 0}</span>
      </Button>
    </div>
  )
}
