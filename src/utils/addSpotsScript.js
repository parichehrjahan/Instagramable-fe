import { createSpot } from '../services/api'
import { predefinedSpots } from '../data/predefinedSpots'

// Function to add all San Francisco spots
export async function addSFSpots() {
  const sfSpots = predefinedSpots['San Francisco']
  console.log(`Starting to add ${sfSpots.length} San Francisco spots...`)

  const results = {
    success: [],
    failed: [],
  }

  for (let i = 0; i < sfSpots.length; i++) {
    const spot = sfSpots[i]
    try {
      console.log(`Adding spot ${i + 1}/${sfSpots.length}: ${spot.name}`)

      // Create the spot with all the provided data
      const response = await createSpot({
        name: spot.name,
        description: spot.description,
        location: spot.location,
        latitude: spot.latitude,
        longitude: spot.longitude,
        imageURLs: spot.imageURLs,
        categories: spot.categoryIds || [], // Use categoryIds if available
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

  console.log(`Finished adding San Francisco spots!`)
  console.log(`Successfully added: ${results.success.length}`)
  console.log(`Failed: ${results.failed.length}`)

  return results
}

// Function to add spots for any city
export async function addSpotsForCity(cityName) {
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

  for (let i = 0; i < citySpots.length; i++) {
    const spot = citySpots[i]
    try {
      console.log(`Adding spot ${i + 1}/${citySpots.length}: ${spot.name}`)

      // Create the spot with all the provided data
      const response = await createSpot({
        name: spot.name,
        description: spot.description,
        location: spot.location,
        latitude: spot.latitude,
        longitude: spot.longitude,
        imageURLs: spot.imageURLs,
        categories: spot.categoryIds || [], // Use categoryIds if available
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

  console.log(`Finished adding ${cityName} spots!`)
  console.log(`Successfully added: ${results.success.length}`)
  console.log(`Failed: ${results.failed.length}`)

  return results
}
