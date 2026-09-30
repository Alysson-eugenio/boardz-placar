export default function StepPicker({ steps, value, onChange }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span id="step-label" className="text-sm text-muted">
        Cada toque vale
      </span>
      <div
        role="radiogroup"
        aria-labelledby="step-label"
        className="inline-flex rounded-2xl border border-line bg-surface p-1"
      >
        {steps.map((s) => (
          <button
            key={s}
            type="button"
            role="radio"
            aria-checked={s === value}
            onClick={() => onChange(s)}
            className={`h-11 min-w-14 rounded-xl px-4 font-display text-sm font-semibold transition-colors ${
              s === value ? 'bg-[var(--game)] text-[var(--game-ink)]' : 'text-muted hover:text-ink'
            }`}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  )
}
