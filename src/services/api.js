import axios from 'axios'
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
