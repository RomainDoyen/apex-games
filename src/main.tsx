import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Routes, Route } from 'react-router'
import Games from './pages/Games.tsx'
import GameDetails from './pages/GameDetails.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/games" element={<Games />} />
      <Route path="/games/:id" element={<GameDetails />} />
    </Routes>
  </BrowserRouter>,
)
