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

export const toggleReviewInteraction = async (reviewId, isLiked) => {
  try {
    const { data: existingInteraction } = await supabase
      .from('review_interactions')
      .select('is_liked')
      .eq('review_id', reviewId)
      .single()

    if (existingInteraction) {
      if (existingInteraction.is_liked === isLiked) {
        // Remove interaction if clicking the same button
        await supabase
          .from('review_interactions')
          .delete()
          .eq('review_id', reviewId)
      } else {
        // Update existing interaction
        await supabase
          .from('review_interactions')
          .update({ is_liked: isLiked })
          .eq('review_id', reviewId)
      }
    } else {
      // Create new interaction
      await supabase.from('review_interactions').insert({
        review_id: reviewId,
        is_liked: isLiked,
      })
    }

    // Get updated counts
    const { data: counts, error: countsError } = await supabase.rpc(
      'get_review_counts',
      { review_id: reviewId }
    )

    if (countsError) throw countsError

    return {
      success: true,
      data: counts,
    }
  } catch (error) {
    console.error('Error toggling review interaction:', error)
    return { success: false, error: error.message }
  }
}
