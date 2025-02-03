import Sidebar from '@/components/Sidebar'
import { useState, useCallback, useMemo } from 'react'
import {
  getSpots,
  getCurrentUserStoredSpots,
  getCategories,
} from '@/services/api'
import SpotGrid from '@/components/SpotGrid'
import { useQuery } from '@tanstack/react-query'
import { useHeader } from '@/contexts/HeaderContext'
import { useQueryClient } from '@tanstack/react-query'
import { useSavedSpots } from '@/contexts/SavedSpotsContext'
import FullScreenMap from '@/components/ui/FullScreenMap'

const HomePage = () => {
  const queryClient = useQueryClient()
  const [filteredSpots, setFilteredSpots] = useState([])
  const { isFullScreenMapOpen, setIsFullScreenMapOpen } = useHeader()
  const { showSavedOnly } = useSavedSpots()
  const [mapCenter, setMapCenter] = useState({
    lat: 43.6532,
    lng: -79.3832,
  })

  const {
    data: spotsData,
    isLoading: spotsLoading,
    error: spotsError,
  } = useQuery({
    queryKey: ['spots'],
    queryFn: getSpots,
    select: (data) => data.data || [],
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

  const handleFilterChange = useCallback(({ spots: newFilteredSpots }) => {
    if (Array.isArray(newFilteredSpots)) {
      setFilteredSpots(newFilteredSpots)
    }
  }, [])

  const handleViewChange = useCallback(
    (isMapView) => {
      setIsFullScreenMapOpen(isMapView)
    },
    [setIsFullScreenMapOpen]
  )

  const displayableSpots = useMemo(() => {
    return showSavedOnly
      ? spotsData?.filter((spot) => savedSpotsData?.includes(spot.id)) || []
      : spotsData || []
  }, [showSavedOnly, spotsData, savedSpotsData])

  const displaySpots = useMemo(() => {
    return filteredSpots.length > 0 ? filteredSpots : displayableSpots
  }, [filteredSpots, displayableSpots])

  return (
    <>
      <Sidebar
        onFilterChange={handleFilterChange}
        categories={categoriesData}
        loading={loading}
        error={error}
        spots={displayableSpots}
        isFullScreenMapOpen={isFullScreenMapOpen}
        onViewChange={handleViewChange}
        mapCenter={mapCenter}
        setMapCenter={setMapCenter}
      />
      <div className="flex-1 ml-64">
        {isFullScreenMapOpen ? (
          <FullScreenMap
            spots={displaySpots}
            isOpen={isFullScreenMapOpen}
            onClose={() => setIsFullScreenMapOpen(false)}
          />
        ) : (
          <SpotGrid
            spots={displaySpots}
            savedSpotIds={savedSpotsData}
            onSaveToggle={async () => {
              await queryClient.invalidateQueries(['spots'])
              await queryClient.invalidateQueries(['savedSpots'])
            }}
          />
        )}
      </div>
    </>
  )
}

export default HomePage
