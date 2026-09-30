import { useEffect, useRef, useState } from 'react'
import { Coins, Dices, Shuffle } from 'lucide-react'
import Avatar from './Avatar.jsx'
import { readableInk } from '../lib/color.js'
import { haptic, prefersReducedMotion, randInt } from '../lib/random.js'

const SPIN_MS = 4200

function polar(r, deg) {
  const a = (deg * Math.PI) / 180
  return [r * Math.sin(a), -r * Math.cos(a)]
}

const shortName = (name) => (name.length > 9 ? `${name.slice(0, 8)}…` : name || 'Sem nome')

function Result({ player }) {
  return (
    <div className="mt-5 flex items-center justify-center gap-3" role="status">
      <Avatar player={player} size={44} />
      <p key={player.id} className="bump font-display text-xl font-bold">{player.name || 'Sem nome'} começa!</p>
    </div>
  )
}

/* ───────── Roleta ───────── */
function Wheel({ players, onPick }) {
  const n = players.length
  const slice = 360 / n
  const [rotation, setRotation] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const [winner, setWinner] = useState(null)
  const timer = useRef(null)

  useEffect(() => () => clearTimeout(timer.current), [])

  function spin() {
    if (spinning) return
    const idx = randInt(n)
    const jitter = (Math.random() - 0.5) * slice * 0.7
    const target = 360 - (idx * slice + slice / 2 + jitter) // deixa a fatia sorteada sob o ponteiro
    const reduced = prefersReducedMotion()
    const done = () => {
      setSpinning(false)
      setWinner(players[idx])
      onPick(players[idx].id)
      haptic([30, 40, 30])
    }
    setWinner(null)
    setRotation((r) => r - (r % 360) + (reduced ? 0 : 5 * 360) + target)
    if (reduced) {
      done()
      return
    }
    setSpinning(true)
    timer.current = setTimeout(done, SPIN_MS + 100)
  }

  return (
    <div>
      <div className="relative mx-auto h-64 w-64 max-w-full">
        <svg
          viewBox="0 0 28 28"
          className="absolute left-1/2 top-0 z-10 h-7 w-7 -translate-x-1/2 -translate-y-2"
          aria-hidden="true"
        >
          <path d="M4 4h20L14 25z" fill="var(--color-ink)" stroke="var(--color-night)" strokeWidth="2" strokeLinejoin="round" />
        </svg>
        <svg
          viewBox="-100 -100 200 200"
          className="h-full w-full"
          role="img"
          aria-label={`Roleta com ${players.map((p) => p.name).join(', ')}`}
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: spinning ? `transform ${SPIN_MS}ms cubic-bezier(0.12, 0.6, 0.1, 1)` : 'none',
          }}
        >
          {players.map((p, i) => {
            const a0 = i * slice
            const a1 = (i + 1) * slice
            const [x0, y0] = polar(98, a0)
            const [x1, y1] = polar(98, a1)
            const mid = a0 + slice / 2
            return (
              <g key={p.id}>
                <path
                  d={`M0 0 L${x0} ${y0} A98 98 0 0 1 ${x1} ${y1} Z`}
                  fill={p.color}
                  stroke="var(--color-night)"
                  strokeWidth="2"
                />
                <text
                  transform={`rotate(${mid - 90})`}
                  x="88"
                  y="0"
                  textAnchor="end"
                  dominantBaseline="central"
                  fontSize={n <= 4 ? 11 : 9}
                  className="font-display"
                  fontWeight="700"
                  fill={readableInk(p.color)}
                >
                  {shortName(p.name)}
                </text>
              </g>
            )
          })}
          <circle r="15" fill="var(--color-night)" stroke="var(--color-ink)" strokeWidth="3" />
        </svg>
      </div>

      {winner && <Result player={winner} />}

      <button type="button" className="btn btn-primary mt-5 w-full" onClick={spin} disabled={spinning}>
        <Shuffle size={20} />
        {spinning ? 'Girando...' : winner ? 'Girar de novo' : 'Girar'}
      </button>
    </div>
  )
}

/* ───────── Iniciativa (d20) ───────── */
function Initiative({ players, onPick }) {
  const [shown, setShown] = useState(null)
  const [order, setOrder] = useState(null)
  const [rolling, setRolling] = useState(false)
  const timer = useRef(null)

  useEffect(() => () => clearInterval(timer.current), [])

  function roll() {
    if (rolling) return
    const finals = players.map((player) => ({
      player,
      main: randInt(20) + 1,
      tie: randInt(20) + 1, // só conta em caso de empate
    }))
    const sorted = [...finals].sort((a, b) => b.main - a.main || b.tie - a.tie)
    const finish = () => {
      setOrder(sorted)
      setRolling(false)
      onPick(sorted[0].player.id)
      haptic([30, 40, 30])
    }
    setOrder(null)
    if (prefersReducedMotion()) {
      finish()
      return
    }
    setRolling(true)
    let ticks = 0
    timer.current = setInterval(() => {
      ticks += 1
      if (ticks >= 12) {
        clearInterval(timer.current)
        finish()
      } else {
        setShown(players.map((player) => ({ player, main: randInt(20) + 1 })))
      }
    }, 70)
  }

  const rows = order ?? shown

  return (
    <div>
      <div className="min-h-32 rounded-2xl border border-dashed border-line p-3">
        {rows ? (
          <ol className="space-y-2">
            {rows.map((r, i) => {
              const tied = order && order.filter((o) => o.main === r.main).length > 1
              const first = order && i === 0
              return (
                <li
                  key={r.player.id}
                  className={`flex items-center gap-3 rounded-xl border px-3 py-2 ${
                    first ? 'border-brand bg-raised' : 'border-line bg-night'
                  }`}
                >
                  {order && <span className="w-6 font-display text-sm text-muted">{i + 1}º</span>}
                  <Avatar player={r.player} size={32} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold">{r.player.name || 'Sem nome'}</span>
                    {tied && <span className="block text-xs text-muted">Empate, desempate: {r.tie}</span>}
                    {order && r.main === 20 && <span className="block text-xs text-[#ffd166]">Crítico!</span>}
                    {order && r.main === 1 && <span className="block text-xs text-[#ff8a80]">Falha crítica</span>}
                  </span>
                  <span
                    key={rolling ? 'r' : r.main}
                    className={`${rolling ? '' : 'bump'} grid h-12 w-12 place-items-center rounded-xl bg-ink font-display text-lg font-bold tabular-nums text-night`}
                  >
                    {r.main}
                  </span>
                </li>
              )
            })}
          </ol>
        ) : (
          <p className="px-2 py-8 text-center text-sm text-muted">
            Cada jogador rola um d20. Quem tirar mais começa.
          </p>
        )}
      </div>

      {order && <Result player={order[0].player} />}

      <button type="button" className="btn btn-primary mt-5 w-full" onClick={roll} disabled={rolling}>
        <Dices size={20} />
        {rolling ? 'Rolando...' : order ? 'Rolar de novo' : 'Rolar iniciativa'}
      </button>
    </div>
  )
}

/* ───────── Moeda (só com 2 jogadores) ───────── */
function Face({ player, className }) {
  return (
    <div
      className={`${className} grid place-items-center rounded-full`}
      style={{
        background: 'linear-gradient(145deg, #ffe08a, #c8901c)',
        boxShadow: 'inset 0 0 0 4px #f6c453, inset 0 0 0 7px #a87414',
      }}
    >
      <span className="grid h-20 w-20 place-items-center rounded-full bg-night">
        <Avatar player={player} size={56} />
      </span>
    </div>
  )
}

function Coin({ players, onPick }) {
  const [flip, setFlip] = useState(null)
  const [result, setResult] = useState(null)
  const timer = useRef(null)

  useEffect(() => () => clearTimeout(timer.current), [])

  function toss() {
    if (flip && !result) return
    const idx = randInt(2)
    const done = () => {
      setResult(players[idx])
      onPick(players[idx].id)
      haptic([30, 40, 30])
    }
    setResult(null)
    setFlip({ key: Date.now(), end: idx === 0 ? 1800 : 1980 })
    if (prefersReducedMotion()) {
      done()
      return
    }
    timer.current = setTimeout(done, 1750)
  }

  const flipping = flip && !result

  return (
    <div>
      <div className="coin-stage mx-auto mt-10 grid h-40 w-40 place-items-center">
        <div
          key={flip?.key ?? 'rest'}
          className="coin relative h-32 w-32"
          style={
            flip
              ? {
                  '--end': `${flip.end}deg`,
                  animation:
                    'coin-flip 1.6s cubic-bezier(0.3, 0.7, 0.3, 1) forwards, coin-hop 1.6s ease-out',
                }
              : undefined
          }
        >
          <Face player={players[0]} className="coin-face absolute inset-0" />
          <Face player={players[1]} className="coin-face coin-back absolute inset-0" />
        </div>
      </div>

      <p className="mt-2 text-center text-sm text-muted">
        Cara: {players[0].name || 'Jogador 1'}. Coroa: {players[1].name || 'Jogador 2'}.
      </p>

      {result && <Result player={result} />}

      <button type="button" className="btn btn-primary mt-5 w-full" onClick={toss} disabled={flipping}>
        <Coins size={20} />
        {flipping ? 'No ar...' : result ? 'Jogar de novo' : 'Jogar a moeda'}
      </button>
    </div>
  )
}

/* ───────── Seletor ───────── */
export default function FirstPlayerPicker({ players, onPick }) {
  const modes = [
    { id: 'roleta', label: 'Roleta', Icon: Shuffle },
    { id: 'iniciativa', label: 'Iniciativa', Icon: Dices },
    ...(players.length === 2 ? [{ id: 'moeda', label: 'Moeda', Icon: Coins }] : []),
  ]
  const [mode, setMode] = useState('roleta')

  return (
    <div>
      <div role="radiogroup" aria-label="Como sortear" className="mb-5 flex gap-2">
        {modes.map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={mode === id}
            onClick={() => setMode(id)}
            className={`flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border text-sm font-semibold ${
              mode === id ? 'border-brand bg-brand text-white' : 'border-line bg-night text-muted hover:text-ink'
            }`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      {mode === 'roleta' && <Wheel key="roleta" players={players} onPick={onPick} />}
      {mode === 'iniciativa' && <Initiative key="iniciativa" players={players} onPick={onPick} />}
      {mode === 'moeda' && players.length === 2 && <Coin key="moeda" players={players} onPick={onPick} />}
    </div>
  )
}
