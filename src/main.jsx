import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import { UserProvider } from '@/contexts/UserContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { LocationProvider } from '@/contexts/LocationContext'

import HomePage from '@/pages/HomePage.jsx'
import SpotPage from '@/pages/SpotPage.jsx'
import Layout from '@/components/Layout'
import AddSpotPage from '@/pages/AddSpotPage.jsx'
import { HeaderProvider } from '@/contexts/HeaderContext'
import './index.css'
import 'leaflet/dist/leaflet.css'
import SavedSpots from '@/components/SavedSpots'
import ProfilePage from '@/pages/ProfilePage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Data is considered fresh for 5 minutes
      cacheTime: 1000 * 60 * 30, // Cache is kept for 30 minutes
    },
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <HeaderProvider>
          <LocationProvider>
            <BrowserRouter>
              <Routes>
                <Route element={<Layout />}>
                  <Route index element={<HomePage />} />
                  <Route path="/spot/:id" element={<SpotPage />} />
                  <Route path="/add-spot" element={<AddSpotPage />} />
                  <Route path="/saved-spots" element={<SavedSpots />} />
                  <Route path="/profile" element={<ProfilePage />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </LocationProvider>
        </HeaderProvider>
      </UserProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>
)
