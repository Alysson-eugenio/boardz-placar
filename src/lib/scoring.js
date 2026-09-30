export const SCORE_TYPES = {
  soma: {
    label: 'Soma simples',
    short: 'Soma',
    hint: 'Um total por jogador, com botões de + e −.',
  },
  rodadas: {
    label: 'Por rodada',
    short: 'Rodadas',
    hint: 'Uma tabela com os pontos de cada rodada.',
  },
  nivel: {
    label: 'Por nível',
    short: 'Nível',
    hint: 'Cada jogador sobe de nível até chegar à meta.',
  },
}

const num = (v) => (Number.isFinite(v) ? v : 0)

// número com o sinal de menos tipográfico
export const fmt = (n) => String(n).replace('-', '−')

export function startValue(game) {
  return game.type === 'nivel' ? (game.startValue ?? 1) : 0
}

export function getTotals(game, match) {
  const totals = {}
  for (const p of match.players) {
    totals[p.id] =
      game.type === 'rodadas'
        ? match.rounds.reduce((sum, r) => sum + num(r[p.id]), 0)
        : num(match.values[p.id] ?? startValue(game))
  }
  return totals
}

// ranking com empates dividindo a mesma posição
export function getRanking(game, match) {
  const totals = getTotals(game, match)
  const dir = game.lowestWins ? 1 : -1
  const rows = match.players
    .map((player) => ({ player, total: totals[player.id] }))
    .sort((a, b) => dir * (a.total - b.total))

  let rank = 0
  let prev = null
  return rows.map((row, i) => {
    if (row.total !== prev) {
      rank = i + 1
      prev = row.total
    }
    return { ...row, rank }
  })
}

export function getStatus(game, match) {
  const ranking = getRanking(game, match)
  const leaders = ranking.filter((r) => r.rank === 1)
  const ended = game.meta != null && ranking.some((r) => r.total >= game.meta)
  // só existe "líder" quando não está todo mundo empatado
  const hasLeader = ranking.length > 1 && leaders.length < ranking.length
  return { ranking, leaders, ended, hasLeader }
}

export function describeRules(game) {
  const rules = []
  rules.push(
    game.minPlayers === game.maxPlayers
      ? `${game.minPlayers} jogadores`
      : `${game.minPlayers} a ${game.maxPlayers} jogadores`,
  )
  if (game.meta != null) {
    if (game.type === 'nivel') rules.push(`Vence quem chegar ao nível ${game.meta}`)
    else if (game.lowestWins)
      rules.push(`Acaba em ${game.meta} pontos e vence quem tem menos`)
    else rules.push(`Vence quem chegar a ${game.meta} pontos`)
  } else if (game.lowestWins) {
    rules.push('Vence quem tem menos pontos')
  }
  return rules
}
