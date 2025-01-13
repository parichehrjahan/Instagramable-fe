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
  const [filteredSpots, setFilteredSpots] = useState([])

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

  const handleFilterChange = useCallback(
    ({ location, distance, categories, userLocation }) => {
      if (!spotsData) return

      setFilteredSpots((currentSpots) => {
        let filtered = [...spotsData]

        if (location) {
          filtered = filtered.filter((spot) =>
            spot.address.toLowerCase().includes(location.toLowerCase())
          )
        }

        if (userLocation && distance) {
          filtered = filtered.filter((spot) => {
            const spotDistance = calculateDistance(
              userLocation.lat,
              userLocation.lng,
              spot.latitude,
              spot.longitude
            )
            return spotDistance <= distance
          })
        }

        if (categories && categories.length > 0) {
          filtered = filtered.filter((spot) =>
            spot.spot_categories.some((sc) =>
              categories.includes(sc.category_id)
            )
          )
        }

        return filtered
      })
    },
    [spotsData]
  )

  if (loading) {
    return (
      <>
        <Sidebar
          onFilterChange={handleFilterChange}
          categories={[]}
          loading={loading}
          error={error}
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
      />
      <div className="flex-1 ml-64">
        <SpotGrid
          spots={filteredSpots.length > 0 ? filteredSpots : spotsData}
          savedSpotIds={savedSpotsData}
          onSaveToggle={handleSaveToggle}
        />
      </div>
    </>
  )
}

export default HomePage
