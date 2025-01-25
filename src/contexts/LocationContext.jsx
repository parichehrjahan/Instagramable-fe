import { createContext, useContext, useState } from 'react'

const LocationContext = createContext()

export function LocationProvider({ children }) {
  const [location, setLocation] = useState({
    lat: null,
    lng: null,
    address: '',
  })
  const [searchRadius, setSearchRadius] = useState(50) // Default 50km radius

  const updateLocation = (newLocation) => {
    setLocation(newLocation)
  }

  const updateSearchRadius = (radius) => {
    setSearchRadius(radius)
  }

  return (
    <LocationContext.Provider
      value={{
        location,
        searchRadius,
        updateLocation,
        updateSearchRadius,
      }}
    >
      {children}
    </LocationContext.Provider>
  )
}

export const useLocation = () => {
  const context = useContext(LocationContext)
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider')
  }
  return context
}
