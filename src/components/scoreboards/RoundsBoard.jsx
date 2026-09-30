import { useEffect, useRef } from 'react'
import { Plus, Undo2 } from 'lucide-react'
import PlayerLabel from '../PlayerLabel.jsx'
import ScoreTrack from '../ScoreTrack.jsx'
import { fmt, getTotals } from '../../lib/scoring.js'

// Por rodada: uma tabela com os pontos de cada rodada e o total no topo.
export default function RoundsBoard({ game, match, dispatch, status }) {
  const { players, rounds } = match
  const totals = getTotals(game, match)
  const leaderIds = new Set(status.hasLeader ? status.leaders.map((l) => l.player.id) : [])

  // sempre existe pelo menos uma rodada pra preencher
  useEffect(() => {
    dispatch({ type: 'ensureRound' })
  }, [rounds.length, dispatch])

  // ao criar uma rodada nova, leva o cursor pra ela
  const prevLength = useRef(rounds.length)
  useEffect(() => {
    if (prevLength.current > 0 && rounds.length > prevLength.current) {
      document.querySelector(`[data-round="${rounds.length - 1}"] input`)?.focus()
    }
    prevLength.current = rounds.length
  }, [rounds.length])

  const rowHead =
    'sticky left-0 z-10 whitespace-nowrap bg-surface px-3 py-3 text-left text-sm font-medium text-muted'

  return (
    <div>
      <div
        className="overflow-x-auto rounded-2xl border border-line bg-surface"
        style={{ scrollPaddingLeft: '6.5rem' }}
      >
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <td className={rowHead} />
              {players.map((p) => (
                <th key={p.id} scope="col" className="min-w-28 p-3 text-left align-bottom">
                  <PlayerLabel
                    player={p}
                    leader={leaderIds.has(p.id)}
                    starter={match.starterId === p.id}
                    size={28}
                  />
                </th>
              ))}
            </tr>
            <tr className="border-b border-line">
              <th scope="row" className={rowHead}>
                Total
              </th>
              {players.map((p) => (
                <td key={p.id} className="p-3 align-top">
                  <output
                    key={totals[p.id]}
                    aria-label={`${p.name}: ${totals[p.id]} pontos`}
                    className="bump font-display text-3xl font-bold tabular-nums"
                  >
                    {fmt(totals[p.id])}
                  </output>
                  {game.meta != null && (
                    <ScoreTrack
                      value={totals[p.id]}
                      meta={game.meta}
                      color={p.color}
                      label={`${p.name}: ${totals[p.id]} de ${game.meta} pontos`}
                    />
                  )}
                </td>
              ))}
            </tr>
          </thead>
          <tbody>
            {rounds.map((round, i) => (
              <tr key={i} data-round={i} className="border-b border-line last:border-0">
                <th scope="row" className={rowHead}>
                  Rodada {i + 1}
                </th>
                {players.map((p) => (
                  <td key={p.id} className="p-2">
                    <input
                      className="cell"
                      type="number"
                      enterKeyHint="next"
                      aria-label={`${p.name}, rodada ${i + 1}`}
                      value={round[p.id] ?? ''}
                      onFocus={(e) => e.target.select()}
                      onChange={(e) =>
                        dispatch({
                          type: 'setCell',
                          round: i,
                          id: p.id,
                          value: e.target.value === '' ? '' : Number(e.target.value),
                        })
                      }
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <button type="button" className="btn btn-game" onClick={() => dispatch({ type: 'addRound' })}>
          <Plus size={18} />
          Nova rodada
        </button>
        <button
          type="button"
          className="btn btn-quiet"
          disabled={rounds.length <= 1}
          onClick={() => dispatch({ type: 'removeLastRound' })}
        >
          <Undo2 size={18} />
          Remover última rodada
        </button>
      </div>
    </div>
  )
}
