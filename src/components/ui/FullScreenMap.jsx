import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  ZoomControl,
} from 'react-leaflet'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router'
import MapController from '../MapController'
import { useLocation } from '@/contexts/LocationContext'

// Create a custom pin icon
const createPinIcon = (color = '#FF0000') =>
  L.divIcon({
    html: `
    <svg width="24" height="36" viewBox="0 0 24 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 9 12 24 12 24s12-15 12-24c0-6.63-5.37-12-12-12zm0 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" 
        fill="${color}"/>
    </svg>
  `,
    className: 'custom-pin-icon',
    iconSize: [24, 36],
    iconAnchor: [12, 36],
    popupAnchor: [0, -36],
  })

const defaultCenter = [0, 0] // Neutral starting point

const SpotPopup = ({ spot }) => {
  const navigate = useNavigate()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const images = spot.spot_images?.map((img) => img.image_url) || []

  const handleClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    navigate(`/spot/${spot.id}`)
  }

  return (
    <div
      onClick={handleClick}
      className="min-w-[120px] max-w-[150px] cursor-pointer hover:opacity-95 transition-opacity block"
    >
      {images.length > 0 ? (
        <div className="relative">
          <div className="relative h-20 w-full overflow-hidden rounded-t-md">
            <img
              src={images[currentImageIndex]}
              alt={`${spot.name}`}
              className="h-full w-full object-cover"
              onError={(e) => {
                console.error(
                  'Image failed to load:',
                  images[currentImageIndex]
                )
                e.target.src = '/placeholder-image.jpg'
              }}
            />
          </div>

          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setCurrentImageIndex((prev) =>
                    prev === 0 ? images.length - 1 : prev - 1
                  )
                }}
                className="absolute left-0.5 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-0.5 text-white hover:bg-black/70"
              >
                <ChevronLeft className="h-3 w-3" />
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setCurrentImageIndex((prev) =>
                    prev === images.length - 1 ? 0 : prev + 1
                  )
                }}
                className="absolute right-0.5 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-0.5 text-white hover:bg-black/70"
              >
                <ChevronRight className="h-3 w-3" />
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="bg-gray-100 h-20 w-full rounded-t-md flex items-center justify-center">
          <span className="text-gray-400 text-xs">No image</span>
        </div>
      )}

      <div className="bg-white p-1 rounded-b-md">
        <h3 className="text-xs font-medium text-center truncate">
          {spot.name}
        </h3>
      </div>
    </div>
  )
}

const SpotMarker = ({ spot }) => {
  const markerRef = useRef(null)
  const popupRef = useRef(null)

  useEffect(() => {
    // Open popup when marker is mounted
    if (markerRef.current) {
      markerRef.current.openPopup()
    }
  }, [])

  return (
    <Marker
      ref={markerRef}
      position={[parseFloat(spot.latitude), parseFloat(spot.longitude)]}
      icon={createPinIcon('#FF4136')}
    >
      <Popup
        ref={popupRef}
        className="custom-popup"
        closeButton={false}
        autoClose={false}
        closeOnClick={false}
      >
        <SpotPopup spot={spot} />
      </Popup>
    </Marker>
  )
}

const FullScreenMap = ({ spots = [], isOpen, onClose }) => {
  const { location } = useLocation()
  const [userLocation, setUserLocation] = useState(null)
  const [mapCenter, setMapCenter] = useState(null)

  // Get user location immediately
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = [
            position.coords.latitude,
            position.coords.longitude,
          ]
          setUserLocation(newLocation)
          // Set map center if location context is not available
          if (!location?.lat && !location?.lng) {
            setMapCenter(newLocation)
          }
        },
        (error) => {
          console.error('Error getting location:', error)
          // Fall back to location context if geolocation fails
          if (location?.lat && location?.lng) {
            setMapCenter([location.lat, location.lng])
          }
        }
      )
    }
  }, [])

  // Update center when location context changes
  useEffect(() => {
    if (location?.lat && location?.lng) {
      setMapCenter([location.lat, location.lng])
    }
  }, [location?.lat, location?.lng])

  if (!isOpen) return null
  if (!mapCenter) return null // Don't render map until we have a valid center

  const validSpots =
    spots?.filter((spot) => spot?.latitude && spot?.longitude) || []

  return (
    <div className="fixed inset-0 z-40">
      <div className="absolute top-0 left-64 right-0 backdrop-blur-md z-[1000] px-4 py-2 flex items-center justify-between border-b border-white/10">
        <div className="flex-1" />
        <div className="flex items-center gap-2">
          {userLocation && (
            <Button
              onClick={() => setMapCenter(userLocation)}
              variant="secondary"
              className="bg-white/10 hover:bg-white/20"
              title="Go to my location"
            >
              📍
            </Button>
          )}
          <Button
            onClick={onClose}
            variant="secondary"
            className="bg-white/10 hover:bg-white/20"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <MapContainer
        center={mapCenter}
        zoom={13}
        style={{ height: '100vh', width: '100vw' }}
        zoomControl={false}
      >
        <MapController center={mapCenter} />
        <ZoomControl position="bottomright" />
        <TileLayer
          attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>'
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
          className="map-tiles"
        />

        {userLocation && (
          <Marker position={userLocation} icon={createPinIcon('#4A90E2')}>
            <Popup className="custom-popup">
              <div className="p-2">
                <h3 className="font-semibold">Your Location</h3>
              </div>
            </Popup>
          </Marker>
        )}

        {validSpots.map((spot) => (
          <SpotMarker key={spot.id} spot={spot} />
        ))}
      </MapContainer>

      <style>{`
        .custom-popup .leaflet-popup-content-wrapper {
          background: none;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          padding: 0;
        }

        .custom-popup .leaflet-popup-content {
          margin: 0;
          min-width: 120px;
          max-width: 150px;
        }

        .custom-popup .leaflet-popup-tip {
          background: white;
        }

        .map-tiles {
          filter: saturate(1.2) contrast(1.1);
        }

        .leaflet-container {
          font-family: system-ui, -apple-system, sans-serif;
          padding-top: 64px;
        }

        .custom-pin-icon {
          background: none;
          border: none;
          filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.5));
          transition: transform 0.2s, filter 0.2s;
        }

        .custom-pin-icon:hover {
          transform: scale(1.1) translateY(-5px);
          filter: drop-shadow(0 4px 4px rgba(0, 0, 0, 0.5));
        }

        .custom-popup:hover {
          transform: translateY(-1px);
          transition: transform 0.2s;
        }

        .leaflet-popup-content {
          max-height: calc(100vh - 200px);
          overflow-y: auto;
        }
      `}</style>
    </div>
  )
}

export default FullScreenMap
