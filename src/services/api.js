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
