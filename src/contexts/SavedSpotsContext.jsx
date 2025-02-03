import { createContext, useContext, useState } from 'react'

const SavedSpotsContext = createContext()

export function SavedSpotsProvider({ children }) {
  const [showSavedOnly, setShowSavedOnly] = useState(false)

  const toggleSavedSpots = () => {
    setShowSavedOnly((prev) => !prev)
  }

  return (
    <SavedSpotsContext.Provider value={{ showSavedOnly, toggleSavedSpots }}>
      {children}
    </SavedSpotsContext.Provider>
  )
}

export function useSavedSpots() {
  const context = useContext(SavedSpotsContext)
  if (!context) {
    throw new Error('useSavedSpots must be used within a SavedSpotsProvider')
  }
  return context
}
