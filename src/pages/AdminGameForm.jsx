import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useGames } from '../context/GamesContext.jsx'
import GameCover from '../components/GameCover.jsx'
import { SCORE_TYPES } from '../lib/scoring.js'
import NotFound from './NotFound.jsx'

const EMOJIS = [
  '🎲', '🃏', '🎴', '🧩', '🏰', '🚂', '🏝️', '🗡️', '🎨', '🦄', '🐉', '🚀',
  '⚔️', '🏆', '🎯', '🧠', '🕵️', '🌾', '🚢', '🧙', '👑', '🔮', '🧊', '🐙',
]
const COLORS = [
  '#e07b39', '#e53935', '#d81b60', '#8e5bd6', '#1e88e5', '#26c6da',
  '#00897b', '#7cb342', '#f9a825', '#b5763a', '#546e7a', '#ff7043',
]
const STEP_OPTIONS = [1, 2, 5, 10, 20, 50]

const blank = {
  name: '',
  emoji: '🎲',
  color: COLORS[0],
  type: 'soma',
  minPlayers: '2',
  maxPlayers: '4',
  meta: '',
  lowestWins: false,
  steps: [1],
  startValue: '1',
  description: '',
}

const toForm = (g) => ({
  name: g.name,
  emoji: g.emoji,
  color: g.color,
  type: g.type,
  minPlayers: String(g.minPlayers),
  maxPlayers: String(g.maxPlayers),
  meta: g.meta == null ? '' : String(g.meta),
  lowestWins: Boolean(g.lowestWins),
  steps: g.steps?.length ? g.steps : [1],
  startValue: String(g.startValue ?? 1),
  description: g.description ?? '',
})

const toInt = (v, fallback) => (Number.isFinite(parseInt(v, 10)) ? parseInt(v, 10) : fallback)

function toGame(form) {
  const game = {
    name: form.name.trim(),
    emoji: form.emoji,
    color: form.color,
    type: form.type,
    minPlayers: toInt(form.minPlayers, 2),
    maxPlayers: toInt(form.maxPlayers, 4),
    meta: form.meta === '' ? null : toInt(form.meta, null),
    lowestWins: form.type !== 'nivel' && form.lowestWins,
    description: form.description.trim(),
  }
  if (form.type === 'soma') game.steps = [...form.steps].sort((a, b) => a - b)
  if (form.type === 'nivel') game.startValue = toInt(form.startValue, 1)
  return game
}

function validate(form) {
  const errors = {}
  const min = toInt(form.minPlayers, NaN)
  const max = toInt(form.maxPlayers, NaN)
  if (!form.name.trim()) errors.name = 'Dê um nome para o jogo.'
  if (!(min >= 1)) errors.minPlayers = 'Use pelo menos 1.'
  if (!(max >= 1)) errors.maxPlayers = 'Use pelo menos 1.'
  else if (max < min) errors.maxPlayers = 'O máximo não pode ser menor que o mínimo.'
  if (form.meta !== '' && !(toInt(form.meta, NaN) > 0)) errors.meta = 'Use um número maior que zero.'
  if (form.type === 'soma' && form.steps.length === 0) errors.steps = 'Escolha pelo menos um valor.'
  return errors
}

function Field({ label, hint, error, children }) {
  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      {children}
      {hint && !error && <p className="mt-1.5 text-sm text-muted">{hint}</p>}
      {error && (
        <p role="alert" className="mt-1.5 text-sm text-[#ff8a80]">
          {error}
        </p>
      )}
    </div>
  )
}

export default function AdminGameForm() {
  const { id } = useParams()
  const { getGame, addGame, updateGame } = useGames()
  const editing = id ? getGame(id) : null

  if (id && !editing) {
    return <NotFound title="Jogo não encontrado" text="Esse jogo não existe mais na lista." />
  }
  return <GameForm key={id ?? 'novo'} editing={editing} addGame={addGame} updateGame={updateGame} />
}

function GameForm({ editing, addGame, updateGame }) {
  const navigate = useNavigate()
  const [form, setForm] = useState(editing ? toForm(editing) : blank)
  const [errors, setErrors] = useState({})
  const set = (patch) => setForm((f) => ({ ...f, ...patch }))

  function toggleStep(step) {
    const has = form.steps.includes(step)
    set({ steps: has ? form.steps.filter((s) => s !== step) : [...form.steps, step] })
  }

  function submit(e) {
    e.preventDefault()
    const found = validate(form)
    setErrors(found)
    if (Object.keys(found).length > 0) return
    const data = toGame(form)
    if (editing) updateGame(editing.id, data)
    else addGame(data)
    navigate('/admin/jogos')
  }

  const preview = toGame(form)
  const metaLabel = form.type === 'nivel' ? 'Nível para vencer' : 'Pontos da meta'

  return (
    <main className="mx-auto max-w-5xl px-4 pb-8 pt-8 sm:px-6 sm:pt-12">
      <h1 className="font-display text-3xl font-bold sm:text-4xl">
        {editing ? `Editar ${editing.name}` : 'Adicionar jogo'}
      </h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_16rem]">
        <form onSubmit={submit} className="space-y-7" noValidate>
          <Field label="Nome do jogo" error={errors.name}>
            <input
              className="field"
              value={form.name}
              maxLength={40}
              onChange={(e) => set({ name: e.target.value })}
              placeholder="Ex.: Super Mario World"
            />
          </Field>

          <Field label="Ícone">
            <div className="grid grid-cols-6 gap-2 sm:grid-cols-8 lg:grid-cols-12">
              {EMOJIS.map((em) => (
                <button
                  key={em}
                  type="button"
                  aria-pressed={form.emoji === em}
                  aria-label={`Ícone ${em}`}
                  onClick={() => set({ emoji: em })}
                  className={`grid h-12 place-items-center rounded-xl border text-2xl ${
                    form.emoji === em ? 'border-brand bg-raised' : 'border-line bg-surface'
                  }`}
                >
                  {em}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Cor do jogo">
            <div className="flex flex-wrap items-center gap-2">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-pressed={form.color === c}
                  aria-label={`Cor ${c}`}
                  onClick={() => set({ color: c })}
                  className={`h-11 w-11 rounded-full border-4 ${
                    form.color === c ? 'border-ink' : 'border-transparent'
                  }`}
                  style={{ background: c }}
                />
              ))}
              <label className="ml-1 flex items-center gap-2 text-sm text-muted">
                Outra
                <input
                  type="color"
                  value={form.color}
                  onChange={(e) => set({ color: e.target.value })}
                  className="h-11 w-14 cursor-pointer rounded-lg border border-line bg-transparent"
                />
              </label>
            </div>
          </Field>

          <Field label="Tipo de placar">
            <div role="radiogroup" className="grid gap-2 sm:grid-cols-3">
              {Object.entries(SCORE_TYPES).map(([key, t]) => (
                <button
                  key={key}
                  type="button"
                  role="radio"
                  aria-checked={form.type === key}
                  onClick={() => set({ type: key })}
                  className={`rounded-2xl border p-4 text-left ${
                    form.type === key ? 'border-brand bg-raised' : 'border-line bg-surface'
                  }`}
                >
                  <span className="block font-semibold">{t.label}</span>
                  <span className="mt-1 block text-sm text-muted">{t.hint}</span>
                </button>
              ))}
            </div>
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Mínimo de jogadores" error={errors.minPlayers}>
              <input
                className="field"
                type="number"
                min="1"
                value={form.minPlayers}
                onChange={(e) => set({ minPlayers: e.target.value })}
              />
            </Field>
            <Field label="Máximo de jogadores" error={errors.maxPlayers}>
              <input
                className="field"
                type="number"
                min="1"
                value={form.maxPlayers}
                onChange={(e) => set({ maxPlayers: e.target.value })}
              />
            </Field>
          </div>

          <Field
            label={`${metaLabel} (opcional)`}
            error={errors.meta}
            hint="Quando alguém chega lá, o placar mostra o vencedor. Deixe vazio se o jogo não tem meta."
          >
            <input
              className="field"
              type="number"
              min="1"
              value={form.meta}
              placeholder="Sem meta"
              onChange={(e) => set({ meta: e.target.value })}
            />
          </Field>

          {form.type === 'nivel' && (
            <Field label="Nível inicial">
              <input
                className="field"
                type="number"
                value={form.startValue}
                onChange={(e) => set({ startValue: e.target.value })}
              />
            </Field>
          )}

          {form.type !== 'nivel' && (
            <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-line bg-surface p-4">
              <input
                type="checkbox"
                className="h-5 w-5 accent-[var(--color-brand)]"
                checked={form.lowestWins}
                onChange={(e) => set({ lowestWins: e.target.checked })}
              />
              <span>
                <span className="block font-medium">Vence quem tem menos pontos</span>
                <span className="block text-sm text-muted">Como no Skyjo.</span>
              </span>
            </label>
          )}

          {form.type === 'soma' && (
            <Field
              label="Valores dos botões rápidos"
              error={errors.steps}
              hint="O cliente escolhe quanto cada toque vale."
            >
              <div className="flex flex-wrap gap-2">
                {STEP_OPTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    aria-pressed={form.steps.includes(s)}
                    onClick={() => toggleStep(s)}
                    className={`h-11 min-w-14 rounded-xl border px-4 font-display text-sm font-semibold ${
                      form.steps.includes(s)
                        ? 'border-brand bg-brand text-white'
                        : 'border-line bg-surface text-muted'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </Field>
          )}

          <Field label="Descrição curta (opcional)">
            <input
              className="field"
              value={form.description}
              maxLength={100}
              onChange={(e) => set({ description: e.target.value })}
              placeholder="Ex.: Primeiro a chegar a 10 pontos vence."
            />
          </Field>

          <div className="flex flex-wrap gap-3 pt-2">
            <button type="submit" className="btn btn-primary">
              {editing ? 'Salvar alterações' : 'Adicionar jogo'}
            </button>
            <Link to="/admin/jogos" className="btn btn-quiet">
              Cancelar
            </Link>
          </div>
        </form>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <p className="mb-3 text-sm font-medium text-muted">Como aparece na biblioteca</p>
          <div className="max-w-56">
            <GameCover game={preview} preview />
          </div>
        </aside>
      </div>
    </main>
  )
}
