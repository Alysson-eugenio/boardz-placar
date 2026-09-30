import { useState } from 'react'
import PlayerLabel from '../PlayerLabel.jsx'
import ScoreTrack from '../ScoreTrack.jsx'
import StepPicker from '../StepPicker.jsx'
import { Floaters, useFloaters } from '../Floaters.jsx'
import { fmt, getTotals } from '../../lib/scoring.js'

function SumCard({ game, player, total, step, leader, ended, starter, dispatch }) {
  const [floats, push] = useFloaters()

  function change(delta) {
    dispatch({ type: 'bump', id: player.id, delta, start: 0 })
    push(delta > 0 ? `+${delta}` : `−${Math.abs(delta)}`, delta > 0 ? 'up' : 'down')
  }

  return (
    <li
      className={`rounded-2xl border bg-surface p-4 ${
        ended && leader ? 'border-[var(--game)]' : 'border-line'
      }`}
    >
      <PlayerLabel player={player} leader={leader} starter={starter} />
      <div className="mt-4 flex items-center justify-between gap-3">
        <button
          type="button"
          className="btn-step"
          aria-label={`Tirar ${step} de ${player.name}`}
          onClick={() => change(-step)}
        >
          −{step}
        </button>
        <div className="relative min-w-0 text-center">
          <Floaters items={floats} />
          <output
            key={total}
            aria-label={`${player.name}: ${total} pontos`}
            className="bump block truncate font-display text-4xl font-bold tabular-nums sm:text-5xl"
          >
            {fmt(total)}
          </output>
        </div>
        <button
          type="button"
          className="btn-step btn-step-plus"
          aria-label={`Somar ${step} para ${player.name}`}
          onClick={() => change(step)}
        >
          +{step}
        </button>
      </div>
      {game.meta != null && (
        <ScoreTrack
          value={total}
          meta={game.meta}
          color={player.color}
          label={`${player.name}: ${total} de ${game.meta} pontos`}
        />
      )}
    </li>
  )
}

// Soma simples: um total por jogador, com botões grandes de + e −.
export default function SumBoard({ game, match, dispatch, status }) {
  const steps = game.steps?.length ? game.steps : [1]
  const [step, setStep] = useState(steps[0])
  const active = steps.includes(step) ? step : steps[0]
  const totals = getTotals(game, match)
  const leaderIds = new Set(status.hasLeader ? status.leaders.map((l) => l.player.id) : [])

  return (
    <div>
      {steps.length > 1 && (
        <div className="mb-4">
          <StepPicker steps={steps} value={active} onChange={setStep} />
        </div>
      )}

      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {match.players.map((p) => (
          <SumCard
            key={p.id}
            game={game}
            player={p}
            total={totals[p.id]}
            step={active}
            leader={leaderIds.has(p.id)}
            ended={status.ended}
            starter={match.starterId === p.id}
            dispatch={dispatch}
          />
        ))}
      </ul>
    </div>
  )
}
