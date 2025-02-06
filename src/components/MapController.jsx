import { useMap } from 'react-leaflet'
import { useEffect } from 'react'

const MapController = ({ center, zoom = 13 }) => {
  const map = useMap()

  useEffect(() => {
    if (
      center &&
      Array.isArray(center) &&
      center.length === 2 &&
      !isNaN(center[0]) &&
      !isNaN(center[1])
    ) {
      console.log('MapController: Flying to', center)

      // Force the map to invalidate its size before flying
      map.invalidateSize()

      // Use a timeout to ensure the map is ready
      setTimeout(() => {
        map.flyTo(center, zoom, {
          duration: 2, // Slightly longer duration for smoother animation
          easeLinearity: 0.25,
          noMoveStart: true, // Prevents the flyTo from being interrupted
        })
      }, 100)
    }
  }, [center, zoom, map])

  return null
}

export default MapController
