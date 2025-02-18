import supabase from '../lib/supabaseClient'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3003'

// Helper function to get auth headers
const getAuthHeaders = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return {
    Authorization: `Bearer ${session?.access_token || ''}`,
    'Content-Type': 'application/json',
  }
}

export const getSpots = async () => {
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_URL}/spots`, {
      headers,
    })
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching spots:', error)
    throw error
  }
}

export const getSpotById = async (id) => {
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_URL}/spots/${id}`, {
      headers,
    })
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching spot:', error)
    throw error
  }
}

export const createReview = async (reviewData) => {
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_URL}/reviews`, {
      method: 'POST',
      headers,
      body: JSON.stringify(reviewData),
    })
    return await response.json()
  } catch (error) {
    console.error('Error creating review:', error)
    throw error
  }
}

export const getReviewsBySpotId = async (spotId) => {
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_URL}/reviews/spot/${spotId}`, {
      headers,
    })
    return await response.json()
  } catch (error) {
    console.error('Error fetching reviews:', error)
    throw error
  }
}

export const toggleSavedSpot = async (spotId) => {
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_URL}/stored-spots`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        spot_id: spotId,
      }),
    })
    return await response.json()
  } catch (error) {
    console.error('Error toggling saved spot:', error)
    throw error
  }
}

export const getSavedSpotStatus = async (spotId) => {
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_URL}/stored-spots/${spotId}/status`, {
      headers,
    })
    return await response.json()
  } catch (error) {
    console.error('Error getting saved spot status:', error)
    throw error
  }
}

export const getCurrentUserStoredSpots = async () => {
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_URL}/stored-spots/user`, {
      headers,
    })
    return await response.json()
  } catch (error) {
    console.error('Error getting user stored spots:', error)
    throw error
  }
}

// Helper function to check if user is authenticated
export const isAuthenticated = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return !!session
}

export const getSpotImages = async (spotId) => {
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_URL}/spots/${spotId}/images`, {
      headers,
    })
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching spot images:', error)
    throw error
  }
}

export const createSpot = async (spotData) => {
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_URL}/spots`, {
      method: 'POST',
      headers,
      body: JSON.stringify(spotData),
    })
    return await response.json()
  } catch (error) {
    console.error('Error creating spot:', error)
    throw error
  }
}

export const deleteSpot = async (spotId) => {
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_URL}/spots/${spotId}`, {
      method: 'DELETE',
      headers,
    })
    return await response.json()
  } catch (error) {
    console.error('Error deleting spot:', error)
    throw error
  }
}

export const getCategories = async () => {
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_URL}/categories`, {
      headers,
    })
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching categories:', error)
    throw error
  }
}

export const updateSpotRating = async (spotId) => {
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_URL}/spots/${spotId}/rating`, {
      method: 'PUT',
      headers,
    })
    return await response.json()
  } catch (error) {
    console.error('Error updating spot rating:', error)
    throw error
  }
}

export const toggleReviewLike = async (reviewId) => {
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_URL}/reviews/${reviewId}/like`, {
      method: 'POST',
      headers,
    })
    return await response.json()
  } catch (error) {
    console.error('Error toggling review like:', error)
    throw error
  }
}

export const toggleReviewDislike = async (reviewId) => {
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_URL}/reviews/${reviewId}/dislike`, {
      method: 'POST',
      headers,
    })
    return await response.json()
  } catch (error) {
    console.error('Error toggling review dislike:', error)
    throw error
  }
}

export const checkUserInteraction = async (reviewId) => {
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_URL}/reviews/${reviewId}/interaction`, {
      headers,
    })
    return await response.json()
  } catch (error) {
    console.error('Error checking user interaction:', error)
    throw error
  }
}

export const toggleReviewInteraction = async (reviewId, isLiked, spotId) => {
  const getNewIsLiked = (existing, isLiked) => {
    if (isLiked) {
      return existing.is_liked ? null : true
    } else {
      return existing.is_liked ? false : null
    }
  }

  const getNewLikeDislikeCount = (currentReview, isLiked, existing) => {
    const existingLikeCount = currentReview.like_count ?? 0
    const existingDislikeCount = currentReview.dislike_count ?? 0

    if (existing) {
      if (isLiked && existing.is_liked) {
        return {
          like_count: existingLikeCount - 1,
          dislike_count: existingDislikeCount,
        }
      } else if (isLiked && !existing.is_liked) {
        return {
          like_count: existingLikeCount + 1,
          dislike_count: existingDislikeCount - 1,
        }
      } else if (!isLiked && existing.is_liked) {
        return {
          like_count: existingLikeCount - 1,
          dislike_count: existingDislikeCount + 1,
        }
      } else if (!isLiked && !existing.is_liked) {
        return {
          like_count: existingLikeCount,
          dislike_count: existingDislikeCount - 1,
        }
      }
    } else {
      return {
        like_count: existingLikeCount + (isLiked ? 1 : 0),
        dislike_count: existingDislikeCount + (isLiked ? 0 : 1),
      }
    }
  }

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    // First, try to get existing interaction
    const { data: existing } = await supabase
      .from('review_interactions')
      .select('*')
      .eq('review_id', reviewId)
      .eq('user_id', user.id)
      .eq('spot_id', spotId)
      .maybeSingle()

    const { data: currentReview } = await supabase
      .from('reviews')
      .select('like_count, dislike_count')
      .eq('id', reviewId)
      .maybeSingle()

    if (existing) {
      // Update existing interaction

      const updateData = getNewLikeDislikeCount(
        currentReview,
        isLiked,
        existing
      )

      const newIsLiked = getNewIsLiked(existing, isLiked)

      if (newIsLiked !== null) {
        await supabase
          .from('review_interactions')
          .update({ is_liked: newIsLiked })
          .eq('id', existing.id)
      } else {
        await supabase
          .from('review_interactions')
          .delete()
          .eq('id', existing.id)
      }

      await supabase.from('reviews').update(updateData).eq('id', reviewId)
    } else {
      // Create new interaction
      await supabase.from('review_interactions').insert({
        review_id: reviewId,
        user_id: user.id,
        is_liked: isLiked,
        spot_id: spotId,
      })

      await supabase
        .from('reviews')
        .update({
          like_count: isLiked
            ? (currentReview.like_count ?? 0) + 1
            : currentReview.like_count,
          dislike_count: isLiked
            ? currentReview.dislike_count
            : (currentReview.dislike_count ?? 0) + 1,
        })
        .eq('id', reviewId)
    }

    return true
  } catch (error) {
    console.error('Error in toggleReviewInteraction:', error)
    throw error
  }
}

// Function to get review counts
export const getReviewCounts = async (reviewId) => {
  try {
    const { data: likes, error: likesError } = await supabase
      .from('review_interactions')
      .select('id')
      .eq('review_id', reviewId)
      .eq('is_liked', true)

    const { data: dislikes, error: dislikesError } = await supabase
      .from('review_interactions')
      .select('id')
      .eq('review_id', reviewId)
      .eq('is_liked', false)

    if (likesError || dislikesError) throw likesError || dislikesError

    return {
      likes: likes?.length || 0,
      dislikes: dislikes?.length || 0,
    }
  } catch (error) {
    console.error('Error in getReviewCounts:', error)
    throw error
  }
}

export const updateUserProfile = async (userData) => {
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_URL}/users/profile`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(userData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to update profile')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error updating user profile:', error)
    throw error
  }
}

export const uploadImage = async (formData) => {
  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  })
  return response.json()
}
