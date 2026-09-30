import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { useGames } from '../context/GamesContext.jsx'
import GameCover from '../components/GameCover.jsx'
import { SCORE_TYPES } from '../lib/scoring.js'

const normalize = (s) =>
  s
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()

const FILTERS = [
  { id: 'todos', label: 'Todos' },
  ...Object.entries(SCORE_TYPES).map(([id, t]) => ({ id, label: t.short })),
]

export default function Library() {
  const { games } = useGames()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('todos')

  const visible = useMemo(() => {
    const q = normalize(query.trim())
    return games.filter(
      (g) => (filter === 'todos' || g.type === filter) && normalize(g.name).includes(q),
    )
  }, [games, query, filter])

  return (
    <main className="mx-auto max-w-6xl px-4 pb-8 sm:px-6">
      <section className="pb-6 pt-8 sm:pb-8 sm:pt-12">
        <h1 className="font-display text-4xl font-bold sm:text-5xl">Biblioteca</h1>
        <p className="mt-3 max-w-md text-muted">
          Escolha o jogo da sua mesa e marque os pontos por aqui.
        </p>
      </section>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="relative block sm:w-80">
          <span className="sr-only">Buscar jogo</span>
          <Search
            size={18}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            type="search"
            className="field pl-11"
            placeholder="Buscar jogo"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>

        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0" role="group" aria-label="Filtrar por tipo de placar">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              aria-pressed={filter === f.id}
              onClick={() => setFilter(f.id)}
              className={`h-11 shrink-0 rounded-full border px-5 text-sm font-semibold transition-colors ${
                filter === f.id
                  ? 'border-brand bg-brand text-white'
                  : 'border-line bg-surface text-muted hover:text-ink'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {visible.length > 0 ? (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
          {visible.map((game, i) => (
            <li key={game.id}>
              <GameCover game={game} index={i} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-2xl border border-dashed border-line p-8 text-center">
          <p className="font-display text-lg font-semibold">Nenhum jogo encontrado</p>
          <p className="mt-2 text-muted">
            {games.length === 0
              ? 'A casa ainda não cadastrou nenhum jogo.'
              : 'Tente outro nome ou volte para "Todos".'}
          </p>
          {games.length > 0 && (
            <button
              type="button"
              className="btn btn-quiet mt-5"
              onClick={() => {
                setQuery('')
                setFilter('todos')
              }}
            >
              Limpar busca
            </button>
          )}
        </div>
      )}
    </main>
  )
}
