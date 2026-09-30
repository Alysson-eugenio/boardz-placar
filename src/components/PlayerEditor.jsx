import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import Avatar from './Avatar.jsx'
import { ROLES } from '../lib/roles.js'

export default function PlayerEditor({ players, max, dispatch, autoFocus = false }) {
  const [name, setName] = useState('')
  const [picking, setPicking] = useState(null) // id do jogador escolhendo classe
  const full = players.length >= max

  function add(e) {
    e.preventDefault()
    const value = name.trim()
    if (!value || full) return
    dispatch({ type: 'addPlayer', name: value })
    setName('')
  }

  return (
    <div>
      {players.length > 0 && (
        <ul className="mb-4 space-y-2">
          {players.map((p, i) => (
            <li key={p.id}>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label={`Escolher a classe de ${p.name || `jogador ${i + 1}`}`}
                  aria-expanded={picking === p.id}
                  onClick={() => setPicking(picking === p.id ? null : p.id)}
                  className="grid h-12 w-12 shrink-0 place-items-center rounded-xl hover:bg-raised"
                >
                  <Avatar player={p} size={38} />
                </button>
                <input
                  className="field flex-1"
                  value={p.name}
                  maxLength={20}
                  autoComplete="off"
                  aria-label={`Nome do jogador ${i + 1}`}
                  onChange={(e) => dispatch({ type: 'renamePlayer', id: p.id, name: e.target.value })}
                  onBlur={() => {
                    if (!p.name.trim())
                      dispatch({ type: 'renamePlayer', id: p.id, name: `Jogador ${i + 1}` })
                  }}
                />
                <button
                  type="button"
                  aria-label={`Remover ${p.name || 'jogador'}`}
                  className="grid h-12 w-12 shrink-0 place-items-center rounded-xl text-muted hover:bg-raised hover:text-ink"
                  onClick={() => dispatch({ type: 'removePlayer', id: p.id })}
                >
                  <X size={20} />
                </button>
              </div>

              {picking === p.id && (
                <div
                  role="radiogroup"
                  aria-label={`Classe de ${p.name}`}
                  className="mt-2 grid grid-cols-4 gap-2 rounded-2xl border border-line bg-night p-2"
                >
                  {ROLES.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      role="radio"
                      aria-checked={(p.role ?? 'peao') === r.id}
                      onClick={() => {
                        dispatch({ type: 'setRole', id: p.id, role: r.id })
                        setPicking(null)
                      }}
                      className={`flex flex-col items-center gap-1 rounded-xl border px-0.5 py-2 text-[11px] leading-tight ${
                        (p.role ?? 'peao') === r.id
                          ? 'border-brand bg-raised text-ink'
                          : 'border-transparent text-muted hover:bg-surface'
                      }`}
                    >
                      <Avatar player={{ ...p, role: r.id }} size={36} />
                      <span>{r.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={add} className="flex gap-2">
        <input
          className="field min-w-0 flex-1"
          placeholder={full ? `Máximo de ${max} jogadores` : 'Nome do jogador'}
          aria-label="Nome do novo jogador"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={full}
          maxLength={20}
          autoFocus={autoFocus}
          autoComplete="off"
          autoCapitalize="words"
          enterKeyHint="done"
        />
        <button type="submit" className="btn btn-quiet" disabled={full || !name.trim()}>
          <Plus size={18} />
          Adicionar
        </button>
      </form>
    </div>
  )
}
