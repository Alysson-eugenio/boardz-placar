import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { gameVars } from '../lib/color.js'
import { prefersReducedMotion } from '../lib/random.js'
import { SCORE_TYPES } from '../lib/scoring.js'

// Capa do jogo, no formato de uma caixa (com lombada).
// Ao tocar ou passar o mouse ela inclina e ganha um brilho de carta holográfica.
export default function GameCover({ game, preview = false, index = 0 }) {
  const ref = useRef(null)
  const Tag = preview ? 'div' : Link
  const linkProps = preview ? {} : { to: `/jogo/${game.id}` }
  const players =
    game.minPlayers === game.maxPlayers
      ? `${game.minPlayers} jogadores`
      : `${game.minPlayers} a ${game.maxPlayers} jogadores`

  function move(e) {
    const el = ref.current
    if (!el || prefersReducedMotion()) return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--px', ((e.clientX - r.left) / r.width).toFixed(3))
    el.style.setProperty('--py', ((e.clientY - r.top) / r.height).toFixed(3))
    el.dataset.hover = '1'
  }

  function leave() {
    const el = ref.current
    if (!el) return
    el.style.removeProperty('--px')
    el.style.removeProperty('--py')
    delete el.dataset.hover
  }

  return (
    <Tag
      {...linkProps}
      ref={ref}
      onPointerMove={move}
      onPointerDown={move}
      onPointerLeave={leave}
      onPointerUp={leave}
      onPointerCancel={leave}
      style={{ ...gameVars(game.color), '--i': index }}
      className="cover relative block aspect-[3/4] overflow-hidden rounded-2xl bg-[var(--game)] text-[var(--game-ink)] active:scale-[0.98]"
    >
      <span aria-hidden="true" className="absolute inset-y-0 left-0 w-3 bg-black/20" />
      <span
        aria-hidden="true"
        className="absolute left-1/2 top-[40%] aspect-square h-[66%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/10"
      />
      <span
        aria-hidden="true"
        className="absolute left-1/2 top-[40%] -translate-x-1/2 -translate-y-1/2 -rotate-6 text-[4.5rem] leading-none drop-shadow-[0_6px_0_rgba(0,0,0,0.18)] sm:text-[5rem]"
      >
        {game.emoji}
      </span>
      <span className="absolute inset-x-0 bottom-0 bg-[var(--game-deep)] py-3 pl-5 pr-3 text-white">
        <span className="block font-display text-sm font-semibold leading-tight sm:text-base">
          {game.name || 'Nome do jogo'}
        </span>
        <span className="mt-1 block text-xs text-white/80">{SCORE_TYPES[game.type].label}</span>
        <span className="block text-xs text-white/80">{players}</span>
      </span>
      <span aria-hidden="true" className="sheen" />
      {!preview && <span aria-hidden="true" className="sweep" />}
    </Tag>
  )
}
