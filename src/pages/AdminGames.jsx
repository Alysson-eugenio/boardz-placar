import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LogOut, Pencil, Plus, Trash2 } from 'lucide-react'
import { useGames } from '../context/GamesContext.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import { SCORE_TYPES } from '../lib/scoring.js'
import { gameVars } from '../lib/color.js'

export default function AdminGames() {
  const { games, removeGame, logout } = useGames()
  const navigate = useNavigate()
  const [toRemove, setToRemove] = useState(null)

  return (
    <main className="mx-auto max-w-3xl px-4 pb-8 pt-8 sm:px-6 sm:pt-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold sm:text-4xl">Jogos da casa</h1>
          <p className="mt-2 text-muted">
            {games.length} {games.length === 1 ? 'jogo cadastrado' : 'jogos cadastrados'}.
          </p>
        </div>
        <Link to="/admin/jogos/novo" className="btn btn-primary">
          <Plus size={18} />
          Adicionar jogo
        </Link>
      </div>

      {games.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-line p-8 text-center">
          <p className="font-display text-lg font-semibold">Nenhum jogo ainda</p>
          <p className="mt-2 text-muted">Cadastre o primeiro jogo para ele aparecer na biblioteca.</p>
        </div>
      ) : (
        <ul className="mt-8 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
          {games.map((g) => (
            <li key={g.id} className="flex flex-wrap items-center gap-3 p-3 sm:p-4" style={gameVars(g.color)}>
              <span
                aria-hidden="true"
                className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[var(--game)] text-2xl"
              >
                {g.emoji}
              </span>
              <div className="min-w-0 flex-1 basis-40">
                <p className="truncate font-semibold">{g.name}</p>
                <p className="text-sm text-muted">{SCORE_TYPES[g.type].label}</p>
              </div>
              <div className="flex gap-2">
                <Link to={`/admin/jogos/${g.id}`} className="btn btn-quiet btn-small">
                  <Pencil size={16} />
                  Editar
                </Link>
                <button type="button" className="btn btn-quiet btn-small" onClick={() => setToRemove(g)}>
                  <Trash2 size={16} />
                  Remover
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-8 flex flex-wrap gap-3">
        <Link to="/" className="btn btn-quiet btn-small">
          Ver a biblioteca
        </Link>
        <button
          type="button"
          className="btn btn-quiet btn-small"
          onClick={() => {
            logout()
            navigate('/admin')
          }}
        >
          <LogOut size={16} />
          Sair
        </button>
      </div>

      <ConfirmDialog
        open={toRemove !== null}
        onClose={() => setToRemove(null)}
        onConfirm={() => removeGame(toRemove.id)}
        title={`Remover ${toRemove?.name ?? 'jogo'}?`}
        text="O jogo some da biblioteca dos clientes."
        confirmLabel="Remover jogo"
        danger
      />
    </main>
  )
}
