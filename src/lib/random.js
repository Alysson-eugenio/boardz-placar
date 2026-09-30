// Sorteio justo (sem viés de módulo) usando o gerador do navegador.
export function randInt(max) {
  const limit = Math.floor(0x100000000 / max) * max
  const buf = new Uint32Array(1)
  do {
    crypto.getRandomValues(buf)
  } while (buf[0] >= limit)
  return buf[0] % max
}

export const rand = (min, max) => min + Math.random() * (max - min)

export function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true
  )
}

// vibração curtinha no celular (onde o navegador permite)
export function haptic(pattern = 20) {
  try {
    navigator.vibrate?.(pattern)
  } catch {
    /* sem suporte, tudo bem */
  }
}
