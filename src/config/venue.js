// ─────────────────────────────────────────────────────────────
// TEMA DO ESTABELECIMENTO
// Para entregar pra outro bar/loja, troque só este arquivo
// (e, se tiver, coloque o logo em /public e aponte em logoSrc).
// ─────────────────────────────────────────────────────────────
export const venue = {
  name: 'BoardZ Game Pub',
  shortName: 'BoardZ',
  initial: 'B', // usado no logo provisório
  tagline: 'O 1º bar de CWB com jogos de tabuleiro',
  logoSrc:'/logo.png',

  colors: {
    night: '#0b0e16', // fundo
    surface: '#131926', // cartões
    raised: '#1c2438', // botões secundários
    line: '#273048', // bordas
    ink: '#f4eef8', // texto
    muted: '#a79fb6', // texto de apoio
    brand: '#9440a0', // roxo da marca
    'brand-deep': '#4d1f58',
  },

  // degradê do anel (logo e vencedor)
  ring: ['#0c0c0b', '#36023c', '#460379', '#524251'],
}

export function applyTheme() {
  const root = document.documentElement
  for (const [name, value] of Object.entries(venue.colors)) {
    root.style.setProperty(`--color-${name}`, value)
  }
  root.style.setProperty('--ring-gradient', `linear-gradient(45deg, ${venue.ring.join(', ')})`)
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', venue.colors.night)
  document.title = `${venue.shortName} Placar`
}
