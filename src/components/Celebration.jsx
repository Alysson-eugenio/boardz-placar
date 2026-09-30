import { useEffect, useState } from 'react'
import Pawn from './Pawn.jsx'
import { rand } from '../lib/random.js'

function makePieces(colors) {
  return Array.from({ length: 44 }, (_, i) => {
    const kind = i % 3 === 0 ? 'die' : i % 3 === 1 ? 'pawn' : 'chip'
    return {
      id: i,
      kind,
      color: colors[i % colors.length],
      left: rand(2, 98),
      size: rand(16, 30),
      dx: rand(-90, 90),
      rot: rand(240, 760) * (i % 2 ? 1 : -1),
      delay: rand(0, 0.9),
      dur: rand(2.3, 3.7),
    }
  })
}

// Chuva de dados, peões e fichas nas cores da mesa. Dura ~4s e some sozinha.
export default function Celebration({ colors, onDone }) {
  const [pieces] = useState(() => makePieces(colors))

  useEffect(() => {
    const t = setTimeout(onDone, 4800)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div aria-hidden="true">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="confetti"
          style={{
            left: `${p.left}%`,
            '--dx': `${p.dx}px`,
            '--rot': `${p.rot}deg`,
            '--dur': `${p.dur}s`,
            '--delay': `${p.delay}s`,
          }}
        >
          {p.kind === 'die' && <span style={{ fontSize: p.size }}>🎲</span>}
          {p.kind === 'pawn' && <Pawn color={p.color} size={p.size} />}
          {p.kind === 'chip' && (
            <span
              className="block rounded-sm"
              style={{ width: p.size * 0.5, height: p.size * 0.8, background: p.color }}
            />
          )}
        </span>
      ))}
    </div>
  )
}
