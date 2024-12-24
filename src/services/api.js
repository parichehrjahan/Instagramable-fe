import axios from 'axios'

const API_URL = 'http://localhost:3003'

export const getSpots = async () => {
  try {
    const response = await axios.get(`${API_URL}/spots`)
    return response.data
  } catch (error) {
    console.error('Error fetching spots:', error)
    throw error
  }
}
