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

// Helper function to get token
const getToken = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return session?.access_token || ''
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
    const token = await getToken()
    const response = await fetch(`${API_URL}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(reviewData),
    })
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error creating review:', error)
    throw error
  }
}

export const getReviewsBySpotId = async (spotId) => {
  try {
    const response = await fetch(`${API_URL}/reviews/spot/${spotId}`)
    const data = await response.json()
    return data
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
    const token = await getToken()
    const endpoint = isLiked ? 'like' : 'dislike'
    const response = await fetch(`${API_URL}/reviews/${reviewId}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error toggling review interaction:', error)
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
  try {
    const token = await getToken()
    const response = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error uploading image:', error)
    throw error
  }
}

export const getUserReviewInteractions = async (spotId) => {
  try {
    const token = await getToken()
    const response = await fetch(`${API_URL}/reviews/interactions/${spotId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching user review interactions:', error)
    throw error
  }
}
