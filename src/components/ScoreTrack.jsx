// Trilha de pontos, no estilo das bordas de Carcassonne: o peão anda até a meta.
export default function ScoreTrack({ value, meta, color, label }) {
  const pct = Math.max(0, Math.min(1, value / meta)) * 100
  const ticks = meta <= 20 ? meta : 10

  return (
    <div className="mt-4" role="img" aria-label={label}>
      <div
        className="relative h-3 rounded-full bg-night"
        style={{
          backgroundImage: `repeating-linear-gradient(90deg, transparent 0, transparent calc(100% / ${ticks} - 1px), rgb(255 255 255 / 0.14) calc(100% / ${ticks} - 1px), rgb(255 255 255 / 0.14) calc(100% / ${ticks}))`,
        }}
      >
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-300"
          style={{ width: `${pct}%`, background: color, opacity: 0.85 }}
        />
        <span
          className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-night transition-[left] duration-300"
          style={{ left: `${pct}%`, background: color }}
        />
      </div>
      <div className="mt-1.5 flex justify-between text-xs text-muted">
        <span>0</span>
        <span>{meta}</span>
      </div>
    </div>
  )
}
