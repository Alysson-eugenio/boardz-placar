import { useEffect } from 'react'
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { GamesProvider, useGames } from './context/GamesContext.jsx'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import DiceFab from './components/DiceFab.jsx'
import Library from './pages/Library.jsx'
import GamePage from './pages/GamePage.jsx'
import AdminLogin from './pages/AdminLogin.jsx'
import AdminGames from './pages/AdminGames.jsx'
import AdminGameForm from './pages/AdminGameForm.jsx'
import HallOfFame from './pages/HallOfFame.jsx'
import NotFound from './pages/NotFound.jsx'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function RequireAdmin() {
  const { isAdmin } = useGames()
  return isAdmin ? <Outlet /> : <Navigate to="/admin" replace />
}

export default function App() {
  return (
    <GamesProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Header />
        <Routes>
          <Route path="/" element={<Library />} />
          <Route path="/jogo/:id" element={<GamePage />} />
          <Route path="/hall-da-fama" element={<HallOfFame />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route element={<RequireAdmin />}>
            <Route path="/admin/jogos" element={<AdminGames />} />
            <Route path="/admin/jogos/novo" element={<AdminGameForm />} />
            <Route path="/admin/jogos/:id" element={<AdminGameForm />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
        <DiceFab />
      </BrowserRouter>
    </GamesProvider>
  )
}
