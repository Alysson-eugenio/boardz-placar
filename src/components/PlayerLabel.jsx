import { Crown, Flag } from 'lucide-react'
import Avatar from './Avatar.jsx'

export default function PlayerLabel({ player, leader = false, starter = false, size = 32 }) {
  return (
    <span className="flex min-w-0 items-center gap-2">
      <Avatar player={player} size={size} />
      <span className="truncate font-semibold">{player.name || 'Sem nome'}</span>
      {leader && <Crown size={16} className="shrink-0 text-[#ffd166]" aria-label="Na frente" />}
      {starter && (
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-line px-2 py-0.5 text-xs text-muted">
          <Flag size={12} aria-hidden="true" />
          Começa
        </span>
      )}
    </span>
  )
}
