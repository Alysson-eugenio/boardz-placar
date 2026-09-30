import { useEffect, useReducer } from 'react'
import { nextPawnColor, uid } from '../lib/players.js'
import { nextRole } from '../lib/roles.js'

// A partida fica só neste aparelho e expira sozinha.
const TTL = 1000 * 60 * 60 * 8 // 8 horas
const storageKey = (gameId) => `boardz:partida:${gameId}`

const empty = () => ({
  started: false,
  starterId: null, // quem começa (sorteio)
  players: [],
  values: {}, // soma e nível: { [idJogador]: número }
  rounds: [], // rodadas: [{ [idJogador]: número | '' }]
  updatedAt: Date.now(),
})

function load(gameId) {
  try {
    const raw = localStorage.getItem(storageKey(gameId))
    if (!raw) return empty()
    const data = JSON.parse(raw)
    if (Date.now() - data.updatedAt > TTL) {
      localStorage.removeItem(storageKey(gameId))
      return empty()
    }
    return { ...empty(), ...data }
  } catch {
    return empty()
  }
}

function omit(obj, key) {
  const { [key]: _removed, ...rest } = obj
  return rest
}

function reducer(state, action) {
  switch (action.type) {
    case 'addPlayer':
      return {
        ...state,
        players: [
          ...state.players,
          {
            id: uid(),
            name: action.name,
            color: nextPawnColor(state.players),
            role: nextRole(state.players),
          },
        ],
      }
    case 'renamePlayer':
      return {
        ...state,
        players: state.players.map((p) => (p.id === action.id ? { ...p, name: action.name } : p)),
      }
    case 'setRole':
      return {
        ...state,
        players: state.players.map((p) => (p.id === action.id ? { ...p, role: action.role } : p)),
      }
    case 'setStarter':
      return { ...state, starterId: action.id }
    case 'removePlayer':
      return {
        ...state,
        starterId: state.starterId === action.id ? null : state.starterId,
        players: state.players.filter((p) => p.id !== action.id),
        values: omit(state.values, action.id),
        rounds: state.rounds.map((r) => omit(r, action.id)),
      }
    case 'start':
      return { ...state, started: true }
    case 'bump': {
      const current = state.values[action.id] ?? action.start
      let next = current + action.delta
      if (action.min != null) next = Math.max(action.min, next)
      return { ...state, values: { ...state.values, [action.id]: next } }
    }
    case 'ensureRound':
      return state.rounds.length ? state : { ...state, rounds: [{}] }
    case 'addRound':
      return { ...state, rounds: [...state.rounds, {}] }
    case 'removeLastRound':
      return { ...state, rounds: state.rounds.slice(0, -1) }
    case 'setCell':
      return {
        ...state,
        rounds: state.rounds.map((r, i) =>
          i === action.round ? { ...r, [action.id]: action.value } : r,
        ),
      }
    case 'rematch': // mesmos jogadores, pontos zerados
      return { ...state, starterId: null, values: {}, rounds: [] }
    case 'reset': // mesa nova
      return empty()
    default:
      return state
  }
}

export function useMatch(gameId) {
  const [state, dispatch] = useReducer(reducer, gameId, load)

  useEffect(() => {
    try {
      localStorage.setItem(storageKey(gameId), JSON.stringify({ ...state, updatedAt: Date.now() }))
    } catch {
      /* modo privado ou storage cheio: a partida segue só em memória */
    }
  }, [gameId, state])

  return [state, dispatch]
}
