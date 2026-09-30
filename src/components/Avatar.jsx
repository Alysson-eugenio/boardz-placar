import Pawn from './Pawn.jsx'
import { getRole } from '../lib/roles.js'

// Ficha do jogador: a classe (ou o peão) na cor dele, dentro de um círculo.
export default function Avatar({ player, size = 32, className = '' }) {
  const role = getRole(player.role)
  const Icon = role.Icon
  return (
    <span
      aria-hidden="true"
      className={`inline-grid shrink-0 place-items-center rounded-full ${className}`}
      style={{
        width: size,
        height: size,
        background: `color-mix(in srgb, ${player.color} 20%, transparent)`,
        boxShadow: `inset 0 0 0 1.5px ${player.color}`,
      }}
    >
      {Icon ? (
        <Icon size={Math.round(size * 0.54)} color={player.color} strokeWidth={2.2} />
      ) : (
        <Pawn color={player.color} size={Math.round(size * 0.62)} />
      )}
    </span>
  )
}
