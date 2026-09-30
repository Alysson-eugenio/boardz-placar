import { useEffect, useRef, useState } from 'react'
import { Dices, Minus, Plus } from 'lucide-react'
import { haptic, prefersReducedMotion, randInt } from '../lib/random.js'

const SIDES = [4, 6, 8, 10, 12, 20, 100]

// posições dos pontinhos numa face de d6 (grade 3x3, índices 0 a 8)
const PIPS = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
}

function Die({ sides, value, rolling }) {
  const crit = sides === 20 && !rolling ? (value === 20 ? 'hit' : value === 1 ? 'miss' : null) : null
  const ring =
    crit === 'hit'
      ? 'ring-2 ring-[#ffd166] shadow-[0_0_22px_rgb(255_209_102/0.55)]'
      : crit === 'miss'
        ? 'ring-2 ring-[#ff6b6b] shadow-[0_0_22px_rgb(255_107_107/0.45)]'
        : ''

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        key={rolling ? 'rolling' : value}
        className={`${rolling ? '' : 'bump'} grid h-[4.5rem] w-[4.5rem] place-items-center rounded-2xl bg-ink text-night ${ring}`}
      >
        {sides === 6 ? (
          <div className="grid h-14 w-14 grid-cols-3 grid-rows-3 place-items-center">
            {Array.from({ length: 9 }, (_, i) => (
              <span
                key={i}
                className={`h-3 w-3 rounded-full ${PIPS[value]?.includes(i) ? 'bg-night' : 'bg-transparent'}`}
              />
            ))}
          </div>
        ) : (
          <span className="font-display text-2xl font-bold tabular-nums">{value}</span>
        )}
      </div>
      <span className="text-xs text-muted" aria-hidden="true">
        {crit === 'hit' ? 'Crítico!' : crit === 'miss' ? 'Falha crítica' : `d${sides}`}
      </span>
    </div>
  )
}

export default function DiceRoller() {
  const [sides, setSides] = useState(6)
  const [qty, setQty] = useState(2)
  const [values, setValues] = useState([])
  const [rolling, setRolling] = useState(false)
  const [history, setHistory] = useState([])
  const timer = useRef(null)

  useEffect(() => () => clearInterval(timer.current), [])

  function finish(finals, s) {
    setValues(finals)
    setRolling(false)
    setHistory((h) =>
      [{ id: Date.now(), label: `${finals.length}d${s}`, values: finals, total: finals.reduce((a, b) => a + b, 0) }, ...h].slice(0, 5),
    )
    haptic(28)
  }

  function roll() {
    if (rolling) return
    const finals = Array.from({ length: qty }, () => randInt(sides) + 1)
    if (prefersReducedMotion()) {
      finish(finals, sides)
      return
    }
    setRolling(true)
    haptic(12)
    let ticks = 0
    timer.current = setInterval(() => {
      ticks += 1
      if (ticks >= 10) {
        clearInterval(timer.current)
        finish(finals, sides)
      } else {
        setValues(Array.from({ length: qty }, () => randInt(sides) + 1))
      }
    }, 70)
  }

  const total = values.reduce((a, b) => a + b, 0)

  return (
    <div>
      <div role="radiogroup" aria-label="Tipo de dado" className="flex flex-wrap gap-2">
        {SIDES.map((s) => (
          <button
            key={s}
            type="button"
            role="radio"
            aria-checked={sides === s}
            onClick={() => {
              setSides(s)
              setValues([])
            }}
            className={`h-11 min-w-14 rounded-xl border px-3 font-display text-sm font-semibold ${
              sides === s ? 'border-brand bg-brand text-white' : 'border-line bg-night text-muted hover:text-ink'
            }`}
          >
            d{s}
          </button>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="text-sm text-muted">Quantos dados</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Menos um dado"
            disabled={qty <= 1 || rolling}
            onClick={() => {
              setQty(qty - 1)
              setValues([])
            }}
            className="grid h-11 w-11 place-items-center rounded-xl border border-line bg-night disabled:opacity-40"
          >
            <Minus size={18} />
          </button>
          <span className="w-8 text-center font-display text-xl font-bold tabular-nums" aria-live="polite">
            {qty}
          </span>
          <button
            type="button"
            aria-label="Mais um dado"
            disabled={qty >= 6 || rolling}
            onClick={() => {
              setQty(qty + 1)
              setValues([])
            }}
            className="grid h-11 w-11 place-items-center rounded-xl border border-line bg-night disabled:opacity-40"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>

      <div
        className="mt-5 flex min-h-32 flex-wrap items-center justify-center gap-4 rounded-2xl border border-dashed border-line p-4"
        aria-live="polite"
      >
        {values.length > 0 ? (
          values.map((v, i) => <Die key={i} sides={sides} value={v} rolling={rolling} />)
        ) : (
          <p className="text-center text-sm text-muted">Escolha o dado e toque em Rolar.</p>
        )}
      </div>

      {values.length > 1 && !rolling && (
        <p className="mt-3 text-center text-sm text-muted">
          Total <span className="font-display text-xl font-bold text-ink">{total}</span>
        </p>
      )}

      <button type="button" className="btn btn-primary mt-4 w-full" onClick={roll} disabled={rolling}>
        <Dices size={20} />
        {rolling ? 'Rolando...' : 'Rolar'}
      </button>

      {history.length > 0 && (
        <div className="mt-5">
          <p className="mb-2 text-sm font-medium text-muted">Últimas rolagens</p>
          <ul className="space-y-1.5 text-sm">
            {history.map((h) => (
              <li key={h.id} className="flex justify-between gap-3 rounded-lg bg-night px-3 py-2">
                <span className="text-muted">{h.label}</span>
                <span className="truncate tabular-nums">
                  {h.values.join(' + ')}
                  {h.values.length > 1 && <strong className="ml-2">= {h.total}</strong>}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
