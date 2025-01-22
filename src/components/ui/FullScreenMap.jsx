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

const defaultCenter = [-6.2088, 106.8456] // Fallback center

const SpotPopup = ({ spot }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  console.log('Spot data in popup:', spot)

  // Handle different possible image data structures
  const images =
    spot.images || [spot.image_url] || [spot.imageUrl] || [spot.photo] || [
      spot.photos,
    ] ||
    []

  // Filter out any null/undefined values and ensure we have valid URLs
  const validImages = images.filter((img) => img && typeof img === 'string')

  console.log('Valid images:', validImages)

  return (
    <div className="p-2 min-w-[300px]">
      <h3 className="font-semibold text-lg mb-2">{spot.name}</h3>

      {validImages.length > 0 ? (
        <div className="relative mb-3">
          <div className="relative h-48 w-full overflow-hidden rounded-lg">
            <img
              src={validImages[currentImageIndex]}
              alt={`${spot.name} - Image ${currentImageIndex + 1}`}
              className="h-full w-full object-cover"
              onError={(e) => {
                console.error(
                  'Image failed to load:',
                  validImages[currentImageIndex]
                )
                e.target.src = '/placeholder-image.jpg' // Add a fallback image
              }}
            />
          </div>

          {validImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setCurrentImageIndex((prev) =>
                    prev === 0 ? validImages.length - 1 : prev - 1
                  )
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1 text-white hover:bg-black/70"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setCurrentImageIndex((prev) =>
                    prev === validImages.length - 1 ? 0 : prev + 1
                  )
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1 text-white hover:bg-black/70"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                {validImages.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1.5 w-1.5 rounded-full transition-colors ${
                      currentImageIndex === index ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="bg-gray-100 h-48 w-full rounded-lg flex items-center justify-center mb-3">
          <span className="text-gray-400">No image available</span>
        </div>
      )}

      <p className="text-sm text-gray-600 mb-2">{spot.description}</p>
      {spot.location && (
        <p className="text-xs text-gray-500 flex items-center gap-1">
          <span>📍</span> {spot.location}
        </p>
      )}
    </div>
  )
}

const SpotMarker = ({ spot }) => {
  const markerRef = useRef(null)

  useEffect(() => {
    // Open popup after the marker is mounted
    const marker = markerRef.current
    if (marker) {
      marker.openPopup()
    }
  }, [])

  const position = [parseFloat(spot.latitude), parseFloat(spot.longitude)]

  return (
    <Marker ref={markerRef} position={position} icon={createPinIcon('#FF4136')}>
      <Popup
        className="custom-popup"
        closeButton={false} // Optional: removes the close button
      >
        <SpotPopup spot={spot} />
      </Popup>
    </Marker>
  )
}

const FullScreenMap = ({ spots = [], isOpen, onClose }) => {
  const [userLocation, setUserLocation] = useState(null)
  const mapRef = useRef(null)

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude])
        },
        (error) => {
          console.error('Error getting location:', error)
        }
      )
    }
  }, [])

  useEffect(() => {
    // Adjust map bounds to fit all markers
    if (mapRef.current && spots.length > 0) {
      const validSpots = spots.filter(
        (spot) => spot?.latitude && spot?.longitude
      )
      if (validSpots.length > 0) {
        const bounds = validSpots.map((spot) => [
          parseFloat(spot.latitude),
          parseFloat(spot.longitude),
        ])
        mapRef.current.fitBounds(bounds)
      }
    }
  }, [spots])

  if (!isOpen) return null

  const validSpots =
    spots?.filter((spot) => spot?.latitude && spot?.longitude) || []
  const initialCenter =
    userLocation ||
    (validSpots[0]
      ? [
          parseFloat(validSpots[0].latitude),
          parseFloat(validSpots[0].longitude),
        ]
      : defaultCenter)

  return (
    <div className="fixed inset-0 z-40">
      <div className="absolute top-0 left-64 right-0 backdrop-blur-md z-[1000] px-4 py-2 flex items-center justify-between border-b border-white/10">
        <div className="flex-1" />
        <div className="flex items-center gap-2">
          {userLocation && (
            <Button
              onClick={() => {
                if (mapRef.current) {
                  mapRef.current.setView(userLocation, 13)
                }
              }}
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
        ref={mapRef}
        center={initialCenter}
        zoom={13}
        style={{ height: '100vh', width: '100vw' }}
        zoomControl={false}
      >
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

      <style>
        {`
          .custom-popup .leaflet-popup-content-wrapper {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(8px);
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            padding: 0;
          }

          .custom-popup .leaflet-popup-content {
            margin: 0;
            min-width: 300px;
          }

          .custom-popup .leaflet-popup-tip {
            background: rgba(255, 255, 255, 0.95);
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

          .leaflet-popup {
            transition: transform 0.2s;
          }

          .leaflet-popup:hover {
            transform: scale(1.02);
          }

          /* Adjust popup max-height to prevent overflow */
          .leaflet-popup-content {
            max-height: calc(100vh - 200px);
            overflow-y: auto;
          }
        `}
      </style>
    </div>
  )
}

export default FullScreenMap
