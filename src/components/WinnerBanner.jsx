import { Trophy } from 'lucide-react'
import Avatar from './Avatar.jsx'
import CountUp from './CountUp.jsx'

function joinNames(names) {
  if (names.length <= 2) return names.join(' e ')
  return `${names.slice(0, -1).join(', ')} e ${names[names.length - 1]}`
}

function reason(game) {
  if (game.type === 'nivel') return `Nível ${game.meta} alcançado.`
  if (game.lowestWins) return `Alguém chegou a ${game.meta} pontos. Vence quem tem menos.`
  return `Meta de ${game.meta} pontos atingida.`
}

// O momento do vencedor: anel dourado nas cores do jogo e o placar final contando.
export default function WinnerBanner({ game, leaders, animate, onRematch }) {
  const names = leaders.map((l) => l.player.name || 'Sem nome')
  const single = leaders.length === 1
  const title = single ? `${names[0]} venceu!` : `Empate entre ${joinNames(names)}`
  const top = leaders[0]

  return (
    <div
      className="story-ring win-ring mb-6 rounded-3xl"
      style={{
        '--ring-fill': 'var(--color-surface)',
        boxShadow: '0 0 44px color-mix(in srgb, var(--game) 30%, transparent)',
      }}
      role="status"
    >
      <div className="flex flex-wrap items-center gap-x-5 gap-y-4 p-4 sm:p-5">
        <div className="relative shrink-0">
          <Avatar player={top.player} size={64} />
          <span className="absolute -bottom-1 -right-1 grid h-7 w-7 place-items-center rounded-full bg-[#ffd166] text-[#0b0e16]">
            <Trophy size={16} />
          </span>
        </div>
        <div className="min-w-0 flex-1 basis-44">
          <p className="break-words font-display text-xl font-bold leading-tight sm:text-2xl">{title}</p>
          <p className="mt-1 text-sm text-muted">{reason(game)}</p>
        </div>
        <div className="flex w-full items-end justify-between gap-4 sm:w-auto sm:justify-end">
          <p className="font-display leading-none">
            <span className="block text-5xl font-bold tabular-nums">
              <CountUp to={top.total} animate={animate} />
            </span>
            <span className="mt-2 block text-sm text-muted">{game.type === 'nivel' ? 'nível' : 'pontos'}</span>
          </p>
          <button type="button" className="btn btn-game" onClick={onRematch}>
            Revanche
          </button>
        </div>
      </div>
    </div>
  )
}
