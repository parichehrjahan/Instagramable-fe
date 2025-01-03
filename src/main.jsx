import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import './index.css'
import { UserProvider } from './contexts/UserContext'

import App from './App.jsx'
import SpotPage from './SpotPage.jsx'
import Layout from './components/Layout'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<App />} />
            <Route path="/spot/:id" element={<SpotPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </UserProvider>
  </StrictMode>
)
