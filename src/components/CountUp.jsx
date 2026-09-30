import { useEffect, useState } from 'react'
import { fmt } from '../lib/scoring.js'
import { prefersReducedMotion } from '../lib/random.js'

// Número que sobe de 0 até o valor final (só quando animate = true).
export default function CountUp({ to, animate = false, duration = 900 }) {
  const [value, setValue] = useState(animate ? 0 : to)

  useEffect(() => {
    if (!animate || prefersReducedMotion()) {
      setValue(to)
      return undefined
    }
    let raf
    let start
    const tick = (now) => {
      start ??= now
      const p = Math.min(1, (now - start) / duration)
      setValue(Math.round(to * (1 - (1 - p) ** 3)))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [to, animate, duration])

  return <>{fmt(value)}</>
}
