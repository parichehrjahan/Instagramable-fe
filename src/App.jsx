import { Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import HomePage from './pages/HomePage'
import SpotPage from './pages/SpotPage'
import AddSpotPage from './pages/AddSpotPage'
import ProfilePage from './pages/ProfilePage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import { LocationProvider } from './contexts/LocationContext'
import AddPredefinedSpotsPage from './pages/AddPredefinedSpotsPage'
import AddSanFranciscoSpotsPage from './pages/AddSanFranciscoSpotsPage'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LocationProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/spot/:id" element={<SpotPage />} />
          <Route path="/add-spot" element={<AddSpotPage />} />
          <Route
            path="/add-predefined-spots"
            element={<AddPredefinedSpotsPage />}
          />
          <Route path="/add-sf-spots" element={<AddSanFranciscoSpotsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
      </LocationProvider>
    </QueryClientProvider>
  )
}

export default App
