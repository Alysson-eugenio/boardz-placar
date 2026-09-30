// Dados de EXEMPLO do Hall da fama (fase 1).
// FASE 2: vem do banco, calculado a partir dos resultados das partidas.
const base = {
  vitorias: [
    { name: 'Vitor', role: 'mago', color: '#ffd166', wins: 9 },
    { name: 'Silvia', role: 'paladino', color: '#4ecdc4', wins: 7 },
    { name: 'João', role: 'guerreiro', color: '#ff6b6b', wins: 6 },
    { name: 'Ana', role: 'bardo', color: '#c084fc', wins: 4 },
    { name: 'Bruno', role: 'ladino', color: '#6c9bff', wins: 3 },
  ],
  jogos: [
    { gameId: 'catan', partidas: 14 },
    { gameId: 'uno', partidas: 11 },
    { gameId: 'munchkin', partidas: 8 },
    { gameId: 'carcassonne', partidas: 6 },
    { gameId: 'dixit', partidas: 4 },
  ],
}

const scale = (k) => ({
  vitorias: base.vitorias.map((v, i) => ({ ...v, wins: Math.max(1, Math.round(v.wins * k) - (i % 2)) })),
  jogos: base.jogos.map((j, i) => ({ ...j, partidas: Math.max(1, Math.round(j.partidas * k) + (i % 3)) })),
})

export const PERIODS = [
  { id: 'semana', label: 'Semana' },
  { id: 'mes', label: 'Mês' },
  { id: 'sempre', label: 'Sempre' },
]

export const hallOfFame = {
  semana: base,
  mes: scale(4),
  sempre: scale(14),
}
