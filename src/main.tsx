import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Routes, Route } from 'react-router'
import Games from './pages/Games.tsx'
import Login from './pages/Login.tsx'
import Register from './pages/Register.tsx'

import Backlog from './pages/GameBacklog.tsx'
import GameDetails from './pages/GameDetails.tsx'


createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/games" element={<Games />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
       <Route path="/backlog" element={<Backlog />} />
      <Route path="/games/:id" element={<GameDetails />} />

    </Routes>
  </BrowserRouter>,
)
