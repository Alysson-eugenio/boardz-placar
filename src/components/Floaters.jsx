import { useCallback, useEffect, useRef, useState } from 'react'
import { uid } from '../lib/players.js'

// "+5" que sobe e some perto do placar quando os pontos mudam.
export function useFloaters() {
  const [items, setItems] = useState([])
  const timers = useRef([])

  useEffect(() => {
    const list = timers.current
    return () => list.forEach(clearTimeout)
  }, [])

  const push = useCallback((text, tone = 'up') => {
    const id = uid()
    setItems((list) => [...list.slice(-4), { id, text, tone }])
    timers.current.push(setTimeout(() => setItems((list) => list.filter((x) => x.id !== id)), 900))
  }, [])

  return [items, push]
}

export function Floaters({ items }) {
  return (
    <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-1 flex justify-center">
      {items.map((item) => (
        <span
          key={item.id}
          className={`float-up absolute font-display text-xl font-bold ${
            item.tone === 'up' ? 'text-[var(--game)]' : 'text-[#ff8a80]'
          }`}
        >
          {item.text}
        </span>
      ))}
    </span>
  )
}
