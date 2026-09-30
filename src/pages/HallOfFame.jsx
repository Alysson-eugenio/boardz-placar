import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, Crown } from 'lucide-react'
import Avatar from '../components/Avatar.jsx'
import { useGames } from '../context/GamesContext.jsx'
import { hallOfFame, PERIODS } from '../data/hallOfFame.js'

export default function HallOfFame() {
  const { games } = useGames()
  const [period, setPeriod] = useState('semana')
  const data = hallOfFame[period]
  const maxWins = Math.max(...data.vitorias.map((v) => v.wins))
  const played = data.jogos
    .map((j) => ({ ...j, game: games.find((g) => g.id === j.gameId) }))
    .filter((j) => j.game)
  const maxPlayed = Math.max(1, ...played.map((j) => j.partidas))

  return (
    <main className="mx-auto max-w-3xl px-4 pb-8 sm:px-6">
      <Link
        to="/"
        className="-ml-2 mt-3 inline-flex h-11 items-center gap-1 rounded-full pl-1 pr-3 text-sm font-semibold text-muted hover:text-ink"
      >
        <ChevronLeft size={20} />
        Biblioteca
      </Link>

      <section className="pb-6 pt-4 sm:pb-8">
        <h1 className="font-display text-4xl font-bold sm:text-5xl">Hall da fama</h1>
        <p className="mt-3 max-w-md text-muted">Quem mais venceu e o que mais rola na casa.</p>
        <p className="mt-4 inline-block rounded-full border border-dashed border-line px-3 py-1.5 text-sm text-muted">
          Dados de exemplo. Os números reais entram quando o banco de dados for ligado.
        </p>
      </section>

      <div role="group" aria-label="Período" className="mb-8 flex gap-2">
        {PERIODS.map((p) => (
          <button
            key={p.id}
            type="button"
            aria-pressed={period === p.id}
            onClick={() => setPeriod(p.id)}
            className={`h-11 rounded-full border px-5 text-sm font-semibold ${
              period === p.id
                ? 'border-brand bg-brand text-white'
                : 'border-line bg-surface text-muted hover:text-ink'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <section aria-labelledby="hf-wins">
        <h2 id="hf-wins" className="mb-4 font-display text-xl font-semibold">
          Mais vitórias
        </h2>
        <ol className="space-y-3">
          {data.vitorias.map((v, i) => (
            <li key={v.name} className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-3">
              <span className="w-7 text-center font-display text-sm text-muted">{i + 1}º</span>
              <span className={i === 0 ? 'story-ring win-ring rounded-full' : ''} style={{ '--ring-fill': 'var(--color-surface)' }}>
                <Avatar player={v} size={i === 0 ? 44 : 48} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-1.5 font-semibold">
                  <span className="truncate">{v.name}</span>
                  {i === 0 && <Crown size={16} className="shrink-0 text-[#ffd166]" aria-label="Campeão" />}
                </p>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-night">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${(v.wins / maxWins) * 100}%`, background: v.color }}
                  />
                </div>
              </div>
              <span className="w-16 text-right font-display text-lg font-bold tabular-nums">
                {v.wins}
                <span className="block text-xs font-normal text-muted">vitórias</span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="hf-games" className="mt-10">
        <h2 id="hf-games" className="mb-4 font-display text-xl font-semibold">
          Jogos mais jogados
        </h2>
        <ul className="space-y-3">
          {played.map((j) => (
            <li key={j.gameId} className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-3">
              <span
                aria-hidden="true"
                className="grid h-12 w-12 shrink-0 place-items-center rounded-xl text-2xl"
                style={{ background: j.game.color }}
              >
                {j.game.emoji}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{j.game.name}</p>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-night">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${(j.partidas / maxPlayed) * 100}%`, background: j.game.color }}
                  />
                </div>
              </div>
              <span className="w-20 text-right font-display text-lg font-bold tabular-nums">
                {j.partidas}
                <span className="block text-xs font-normal text-muted">partidas</span>
              </span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
