import fetch from 'node-fetch'
import { predefinedSpots } from '../src/data/predefinedSpots.js'

const API_URL = 'http://localhost:3000/api'

async function createSpot(spotData) {
  try {
    const response = await fetch(`${API_URL}/spots`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(spotData),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return { success: true, data }
  } catch (error) {
    console.error('Error creating spot:', error)
    throw error
  }
}

// Function to add all spots for a specific city
async function addSpotsForCity(cityName) {
  if (!predefinedSpots[cityName]) {
    console.error(`No predefined spots found for ${cityName}`)
    return {
      success: [],
      failed: [
        {
          name: 'City not found',
          error: `No predefined spots for ${cityName}`,
        },
      ],
    }
  }

  const citySpots = predefinedSpots[cityName]
  console.log(`Starting to add ${citySpots.length} spots for ${cityName}...`)

  const results = {
    success: [],
    failed: [],
  }

  for (const spot of citySpots) {
    try {
      console.log(`Adding spot: ${spot.name}`)

      const response = await createSpot({
        name: spot.name,
        description: spot.description,
        location: spot.location,
        latitude: spot.latitude,
        longitude: spot.longitude,
        imageURLs: spot.imageURLs,
        categories: spot.categoryIds || [],
      })

      console.log(`Successfully added ${spot.name}`)
      results.success.push({
        name: spot.name,
        id: response.data,
      })
    } catch (error) {
      console.error(`Failed to add ${spot.name}:`, error)
      results.failed.push({
        name: spot.name,
        error: error.message,
      })
    }
  }

  return results
}

// Function to automatically add all spots for all cities
async function addAllSpots() {
  const cities = Object.keys(predefinedSpots)
  const allResults = {
    success: [],
    failed: [],
  }

  console.log('Starting to add spots for all cities...')

  for (const city of cities) {
    console.log(`\nProcessing city: ${city}`)
    const results = await addSpotsForCity(city)
    allResults.success.push(...results.success)
    allResults.failed.push(...results.failed)
  }

  console.log('\nFinished adding all spots!')
  console.log(`Successfully added: ${allResults.success.length} spots`)
  console.log(`Failed to add: ${allResults.failed.length} spots`)

  return allResults
}

// Run the script
try {
  console.log('Starting to add all predefined spots...')
  const results = await addAllSpots()

  console.log('\nSummary:')
  console.log(
    'Successfully added spots:',
    results.success.map((s) => s.name).join(', ')
  )

  if (results.failed.length > 0) {
    console.log('\nFailed spots:')
    results.failed.forEach((f) => console.log(`${f.name}: ${f.error}`))
  }
} catch (error) {
  console.error('Error running script:', error)
}
