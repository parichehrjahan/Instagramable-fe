import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3003'

export const getSpots = async () => {
  try {
    const response = await axios.get(`${API_URL}/spots`)
    return response.data
  } catch (error) {
    console.error('Error fetching spots:', error)
    throw error
  }
}

export const getSpotById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/spots/${id}`)
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching spot:', error)
    throw error
  }
}

export const createReview = async (reviewData) => {
  try {
    const response = await fetch(`${API_URL}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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
    const response = await fetch(`${API_URL}/reviews/spot/${spotId}`)
    return await response.json()
  } catch (error) {
    console.error('Error fetching reviews:', error)
    throw error
  }
}
