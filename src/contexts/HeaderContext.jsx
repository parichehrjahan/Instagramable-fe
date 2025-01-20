import { createContext, useContext, useState } from 'react'

const HeaderContext = createContext()

export function HeaderProvider({ children }) {
  const [isFullScreenMapOpen, setIsFullScreenMapOpen] = useState(false)

  const value = {
    isFullScreenMapOpen,
    setIsFullScreenMapOpen,
  }

  return (
    <HeaderContext.Provider value={value}>{children}</HeaderContext.Provider>
  )
}

export function useHeader() {
  const context = useContext(HeaderContext)
  if (context === undefined) {
    throw new Error('useHeader must be used within a HeaderProvider')
  }
  return context
}
