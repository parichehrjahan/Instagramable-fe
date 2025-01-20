import Sidebar from '@/components/Sidebar'
import { useState, useCallback } from 'react'
import {
  getSpots,
  getCurrentUserStoredSpots,
  getCategories,
} from '@/services/api'
import SpotGrid from '@/components/SpotGrid'
import { calculateDistance } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { useQuery } from '@tanstack/react-query'
import FullScreenMap from '@/components/ui/FullScreenMap'
import { useHeader } from '@/contexts/HeaderContext'

const SpotCardSkeleton = () => (
  <div className="overflow-hidden rounded-lg">
    <Skeleton className="h-[400px] w-full" />
    <div className="p-4 space-y-2">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="flex gap-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-8" />
      </div>
    </div>
  </div>
)

const SpotGridSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
    {[...Array(6)].map((_, i) => (
      <SpotCardSkeleton key={i} />
    ))}
  </div>
)

const HomePage = () => {
  const [spots, setSpots] = useState([])
  const [filteredSpots, setFilteredSpots] = useState([])
  const { isFullScreenMapOpen, setIsFullScreenMapOpen } = useHeader()

  const {
    data: spotsData,
    isLoading: spotsLoading,
    error: spotsError,
  } = useQuery({
    queryKey: ['spots'],
    queryFn: getSpots,
    select: (data) => data.data || [], // Transform the response
  })

  const { data: savedSpotsData, isLoading: savedSpotsLoading } = useQuery({
    queryKey: ['savedSpots'],
    queryFn: getCurrentUserStoredSpots,
    select: (data) => data.data?.map((item) => item.spot_id) || [],
  })

  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    select: (data) => data.data || [],
  })

  const loading = spotsLoading || savedSpotsLoading || categoriesLoading
  const error = spotsError

  const handleSaveToggle = useCallback((spotId) => {
    // We'll handle this with a mutation in a future update
    setSavedSpotIds((prev) =>
      prev.includes(spotId)
        ? prev.filter((id) => id !== spotId)
        : [...prev, spotId]
    )
  }, [])

  const handleFilterChange = ({
    categories,
    distance,
    location,
    searchQuery,
  }) => {
    if (!Array.isArray(spots)) {
      console.error('Spots data is not an array:', spots)
      return
    }

    let filtered = [...spots]

    // Filter by location and distance if both are provided
    if (location && distance) {
      filtered = filtered.filter((spot) => {
        if (!spot.latitude || !spot.longitude) return false

        // Calculate distance using Haversine formula
        const R = 6371 // Earth's radius in kilometers
        const lat1 = (location.lat * Math.PI) / 180
        const lon1 = (location.lng * Math.PI) / 180
        const lat2 = (spot.latitude * Math.PI) / 180
        const lon2 = (spot.longitude * Math.PI) / 180

        const dLat = lat2 - lat1
        const dLon = lon2 - lon1

        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(lat1) *
            Math.cos(lat2) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2)

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
        const d = R * c // Distance in kilometers

        return d <= distance
      })
    }

    // Keep existing search query filter
    if (searchQuery?.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (spot) =>
          (spot?.name || '').toLowerCase().includes(query) ||
          (spot?.description || '').toLowerCase().includes(query) ||
          (spot?.location || '').toLowerCase().includes(query)
      )
    }

    setFilteredSpots(filtered)
  }

  const handleViewChange = (isMapView) => {
    setIsFullScreenMapOpen(isMapView)
  }

  if (loading) {
    return (
      <>
        <Sidebar
          onFilterChange={handleFilterChange}
          categories={[]}
          loading={loading}
          error={error}
          isFullScreenMapOpen={isFullScreenMapOpen}
          onViewChange={handleViewChange}
        />
        <div className="flex-1 ml-64">
          <SpotGridSkeleton />
        </div>
      </>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center p-8 text-red-500">
        Error: {error.message}
      </div>
    )
  }

  return (
    <>
      <Sidebar
        onFilterChange={handleFilterChange}
        categories={categoriesData}
        loading={loading}
        error={error}
        spots={spotsData}
        isFullScreenMapOpen={isFullScreenMapOpen}
        onViewChange={handleViewChange}
      />
      <div className="flex-1 ml-64">
        {isFullScreenMapOpen ? (
          <FullScreenMap
            spots={spotsData || []}
            isOpen={true}
            onClose={() => setIsFullScreenMapOpen(false)}
          />
        ) : (
          <SpotGrid
            spots={filteredSpots.length > 0 ? filteredSpots : spotsData}
            savedSpotIds={savedSpotsData}
            onSaveToggle={handleSaveToggle}
          />
        )}
      </div>
    </>
  )
}

export default HomePage
