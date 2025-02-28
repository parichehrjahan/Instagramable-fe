import AddPredefinedSpotsPage from './pages/AddPredefinedSpotsPage'
import AddSanFranciscoSpotsPage from './pages/AddSanFranciscoSpotsPage'

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
