function parse(hex) {
  let h = hex.replace('#', '')
  if (h.length === 3) h = h.split('').map((c) => c + c).join('')
  const n = parseInt(h, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function toHex(rgb) {
  return '#' + rgb.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')
}

function luminance(hex) {
  const [r, g, b] = parse(hex).map((v) => {
    const s = v / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function mix(a, b, t) {
  const A = parse(a)
  const B = parse(b)
  return toHex(A.map((v, i) => v + (B[i] - v) * t))
}

// escolhe texto claro ou escuro, o que tiver mais contraste sobre a cor
export function readableInk(bg) {
  const L = luminance(bg)
  const onWhite = 1.05 / (L + 0.05)
  const onDark = (L + 0.05) / (luminance('#0b0e16') + 0.05)
  return onDark >= onWhite ? '#0b0e16' : '#ffffff'
}

// variáveis CSS que cada jogo injeta na tela dele
export function gameVars(color) {
  return {
    '--game': color,
    '--game-ink': readableInk(color),
    '--game-deep': mix(color, '#000000', 0.5),
  }
}
