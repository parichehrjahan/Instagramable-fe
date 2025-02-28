import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import supabase from './supabaseClient'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371 // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Generic function to upload any image to Supabase
export const uploadImageToSupabase = async (
  file,
  bucket = 'images',
  folder = ''
) => {
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    const filePath = folder ? `${folder}/${fileName}` : fileName

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type,
      })

    if (uploadError) throw uploadError

    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(filePath)

    // Verify the URL is accessible
    const urlCheck = await fetch(publicUrl, { method: 'HEAD' })
    if (!urlCheck.ok) {
      throw new Error('Generated URL is not accessible')
    }

    return publicUrl
  } catch (error) {
    console.error('Error uploading image:', error)
    throw error
  }
}

// Function to upload profile image and update profile
export const updateProfileImage = async (file, userId) => {
  const fileName = `${userId}-${Date.now()}.webp`
  const filePath = `profiles/${fileName}`

  const { error: uploadError } = await supabase.storage
    .from('user_images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
      contentType: 'image/webp',
    })

  if (uploadError) {
    throw uploadError
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from('user_images').getPublicUrl(filePath)

  return publicUrl
}

// Function to upload multiple spot images
export const uploadSpotImages = async (files) => {
  try {
    const uploadPromises = files.map((file) =>
      uploadImageToSupabase(file, 'images', 'spots')
    )
    return await Promise.all(uploadPromises)
  } catch (error) {
    console.error('Error uploading spot images:', error)
    throw error
  }
}

// Function to add multiple predefined spots
export const addPredefinedSpots = async (spots, onProgress) => {
  const results = []
  let completed = 0

  for (const spot of spots) {
    try {
      // Create the spot
      const response = await createSpot({
        name: spot.name,
        description: spot.description,
        location: spot.location,
        latitude: spot.latitude,
        longitude: spot.longitude,
        imageURLs: spot.imageURLs,
        categories: spot.categories,
      })

      results.push({
        success: true,
        id: response.data,
        name: spot.name,
      })
    } catch (error) {
      console.error(`Error creating spot ${spot.name}:`, error)
      results.push({
        success: false,
        name: spot.name,
        error: error.message,
      })
    }

    completed++
    if (onProgress) {
      onProgress(completed, spots.length)
    }
  }

  return results
}
