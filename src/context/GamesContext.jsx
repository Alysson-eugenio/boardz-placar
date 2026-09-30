import { createContext, useContext, useMemo, useState } from 'react'
import { initialGames } from '../data/games.js'

const GamesContext = createContext(null)

const slug = (s) =>
  s
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

const ADMIN_KEY = 'boardz:admin'

// FASE 1: os jogos vivem só na memória (somem ao recarregar) e o login é de mentira.
// FASE 2: trocar por chamadas à API/banco e login real.
export function GamesProvider({ children }) {
  const [games, setGames] = useState(initialGames)
  const [isAdmin, setIsAdmin] = useState(() => {
    try {
      return sessionStorage.getItem(ADMIN_KEY) === '1'
    } catch {
      return false
    }
  })

  const value = useMemo(
    () => ({
      games,
      isAdmin,
      getGame: (id) => games.find((g) => g.id === id),
      addGame: (data) => {
        const id = `${slug(data.name) || 'jogo'}-${Math.random().toString(36).slice(2, 6)}`
        setGames((list) => [...list, { ...data, id }])
        return id
      },
      updateGame: (id, data) =>
        setGames((list) => list.map((g) => (g.id === id ? { ...g, ...data, id } : g))),
      removeGame: (id) => setGames((list) => list.filter((g) => g.id !== id)),
      login: () => {
        try {
          sessionStorage.setItem(ADMIN_KEY, '1')
        } catch {
          /* sem storage, segue só em memória */
        }
        setIsAdmin(true)
      },
      logout: () => {
        try {
          sessionStorage.removeItem(ADMIN_KEY)
        } catch {
          /* ignora */
        }
        setIsAdmin(false)
      },
    }),
    [games, isAdmin],
  )

  return <GamesContext.Provider value={value}>{children}</GamesContext.Provider>
}

export function useGames() {
  const ctx = useContext(GamesContext)
  if (!ctx) throw new Error('useGames precisa estar dentro de <GamesProvider>')
  return ctx
}
