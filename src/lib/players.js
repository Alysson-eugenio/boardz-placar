// cores dos "peões" dos jogadores
export const PAWN_COLORS = [
  '#ff6b6b',
  '#ffd166',
  '#4ecdc4',
  '#6c9bff',
  '#c084fc',
  '#ff9f5a',
  '#7ee081',
  '#f472b6',
]

export function nextPawnColor(players) {
  const used = players.map((p) => p.color)
  return PAWN_COLORS.find((c) => !used.includes(c)) ?? PAWN_COLORS[players.length % PAWN_COLORS.length]
}

export const uid = () => Math.random().toString(36).slice(2, 9)
