import { useEffect, useState } from 'react'
import PlayerLabel from '../PlayerLabel.jsx'
import ScoreTrack from '../ScoreTrack.jsx'
import { Floaters, useFloaters } from '../Floaters.jsx'
import { fmt, getTotals, startValue } from '../../lib/scoring.js'
import { haptic } from '../../lib/random.js'

function LevelCard({ game, player, level, leader, ended, starter, dispatch }) {
  const min = startValue(game)
  const [floats, push] = useFloaters()
  const [up, setUp] = useState(0) // muda a cada "level up" pra reiniciar a animação

  useEffect(() => {
    if (!up) return undefined
    const t = setTimeout(() => setUp(0), 1200)
    return () => clearTimeout(t)
  }, [up])

  function down() {
    dispatch({ type: 'bump', id: player.id, delta: -1, start: min, min })
    push('−1', 'down')
  }

  function raise() {
    dispatch({ type: 'bump', id: player.id, delta: 1, start: min, min })
    setUp(Date.now())
    haptic(18)
  }

  return (
    <li
      className={`relative overflow-hidden rounded-2xl border bg-surface p-4 ${
        ended && leader ? 'border-[var(--game)]' : 'border-line'
      }`}
    >
      <PlayerLabel player={player} leader={leader} starter={starter} />
      <div className="mt-4 flex items-center justify-between gap-3">
        <button
          type="button"
          className="btn-step"
          disabled={level <= min}
          aria-label={`Descer um nível de ${player.name}`}
          onClick={down}
        >
          −1
        </button>
        <div className="relative min-w-0 text-center">
          <Floaters items={floats} />
          <p className="text-xs text-muted">Nível</p>
          <output
            key={level}
            aria-label={`${player.name}: nível ${level}`}
            className="bump font-display text-5xl font-bold tabular-nums"
          >
            {fmt(level)}
          </output>
        </div>
        <button
          type="button"
          className="btn-step btn-step-plus"
          aria-label={`Subir um nível de ${player.name}`}
          onClick={raise}
        >
          +1
        </button>
      </div>
      {game.meta != null && (
        <ScoreTrack
          value={level}
          meta={game.meta}
          color={player.color}
          label={`${player.name}: nível ${level} de ${game.meta}`}
        />
      )}

      {up > 0 && (
        <div key={up} aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="level-glow absolute inset-0 rounded-2xl" />
          <div className="level-pop absolute right-3 top-3">
            <span className="rounded-full bg-[var(--game)] px-4 py-1.5 font-display text-sm font-bold text-[var(--game-ink)] shadow-lg">
              Level up!
            </span>
          </div>
        </div>
      )}
    </li>
  )
}

// Nível: sobe e desce de 1 em 1 até a meta. Não desce abaixo do nível inicial.
export default function LevelBoard({ game, match, dispatch, status }) {
  const totals = getTotals(game, match)
  const leaderIds = new Set(status.hasLeader ? status.leaders.map((l) => l.player.id) : [])

  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {match.players.map((p) => (
        <LevelCard
          key={p.id}
          game={game}
          player={p}
          level={totals[p.id]}
          leader={leaderIds.has(p.id)}
          ended={status.ended}
          starter={match.starterId === p.id}
          dispatch={dispatch}
        />
      ))}
    </ul>
  )
}
