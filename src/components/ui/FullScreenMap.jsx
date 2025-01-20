import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  ZoomControl,
} from 'react-leaflet'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useState, useEffect } from 'react'

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

const FullScreenMap = ({
  spots = [],
  isOpen,
  onClose,
  onUserLocationChange,
}) => {
  const [userLocation, setUserLocation] = useState(null)

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = [
            position.coords.latitude,
            position.coords.longitude,
          ]
          setUserLocation(newLocation)
          // Share user location with parent component
          onUserLocationChange?.(newLocation)
        },
        (error) => {
          console.log('Error getting location:', error)
        }
      )
    }
  }, [onUserLocationChange])

  if (!isOpen) return null

  const validSpots =
    spots?.filter((spot) => spot?.latitude && spot?.longitude) || []
  const bounds = validSpots.map((spot) => [
    parseFloat(spot.latitude),
    parseFloat(spot.longitude),
  ])

  // Determine initial center: user location > first spot > default center
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
                const map =
                  document.querySelector('.leaflet-container')?._leafletRef
                if (map) {
                  map.setView(userLocation, 13)
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
        center={initialCenter}
        zoom={13}
        style={{ height: '100vh', width: '100vw' }}
        zoomControl={false}
        bounds={bounds.length > 0 ? bounds : undefined}
      >
        <ZoomControl position="bottomright" />
        <TileLayer
          attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>'
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
          className="map-tiles"
        />

        {/* User location marker */}
        {userLocation && (
          <Marker
            position={userLocation}
            icon={createPinIcon('#4A90E2')} // Blue pin for user location
          >
            <Popup className="custom-popup">
              <div className="p-2">
                <h3 className="font-semibold">Your Location</h3>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Spots markers */}
        {validSpots.map((spot) => {
          const position = [
            parseFloat(spot.latitude),
            parseFloat(spot.longitude),
          ]

          return (
            <Marker
              key={spot.id}
              position={position}
              icon={createPinIcon('#FF4136')}
            >
              <Popup className="custom-popup">
                <div className="p-2 min-w-[200px]">
                  <h3 className="font-semibold text-lg mb-1">{spot.name}</h3>
                  {spot.image_url && (
                    <img
                      src={spot.image_url}
                      alt={spot.name}
                      className="w-full h-32 object-cover rounded-md mb-2"
                    />
                  )}
                  <p className="text-sm text-gray-600 mb-1">
                    {spot.description}
                  </p>
                  {spot.location && (
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <span>📍</span> {spot.location}
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>

      <style>
        {`
          .custom-popup .leaflet-popup-content-wrapper {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(8px);
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
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
        `}
      </style>
    </div>
  )
}

export default FullScreenMap
