import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ChevronLeft, Eraser, Flag, RotateCcw, Users } from 'lucide-react'
import { useGames } from '../context/GamesContext.jsx'
import { useMatch } from '../hooks/useMatch.js'
import { gameVars } from '../lib/color.js'
import { haptic } from '../lib/random.js'
import { describeRules, getStatus } from '../lib/scoring.js'
import { reportResult } from '../lib/stats.js'
import Modal from '../components/Modal.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import PlayerEditor from '../components/PlayerEditor.jsx'
import WinnerBanner from '../components/WinnerBanner.jsx'
import Celebration from '../components/Celebration.jsx'
import FirstPlayerPicker from '../components/FirstPlayerPicker.jsx'
import SumBoard from '../components/scoreboards/SumBoard.jsx'
import RoundsBoard from '../components/scoreboards/RoundsBoard.jsx'
import LevelBoard from '../components/scoreboards/LevelBoard.jsx'
import NotFound from './NotFound.jsx'

const BOARDS = { soma: SumBoard, rodadas: RoundsBoard, nivel: LevelBoard }

export default function GamePage() {
  const { id } = useParams()
  const { getGame } = useGames()
  const game = getGame(id)

  if (!game) {
    return (
      <NotFound
        title="Jogo não encontrado"
        text="Esse jogo não está mais na biblioteca. Volte e escolha outro."
      />
    )
  }
  // key: cada jogo tem a sua própria partida
  return <GameScreen key={game.id} game={game} />
}

function GameScreen({ game }) {
  const [match, dispatch] = useMatch(game.id)
  const [dialog, setDialog] = useState(null) // 'players' | 'first' | 'rematch' | 'reset' | null
  const [celebrating, setCelebrating] = useState(false)
  const [animateWin, setAnimateWin] = useState(false)
  const status = getStatus(game, match)
  const Board = BOARDS[game.type]
  const close = () => setDialog(null)
  const stopCelebration = useCallback(() => setCelebrating(false), [])

  // A festa só acontece na hora em que a partida acaba, não ao reabrir uma partida já encerrada.
  const wasEnded = useRef(status.ended)
  useEffect(() => {
    if (status.ended && !wasEnded.current) {
      setCelebrating(true)
      setAnimateWin(true)
      haptic([60, 40, 60, 40, 120])
      reportResult(game, match, status)
    }
    wasEnded.current = status.ended
  }, [status.ended]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!animateWin) return undefined
    const t = setTimeout(() => setAnimateWin(false), 1600)
    return () => clearTimeout(t)
  }, [animateWin])

  function fillDefaultNames() {
    const total = Math.max(2, game.minPlayers)
    for (let i = match.players.length; i < total; i++) {
      dispatch({ type: 'addPlayer', name: `Jogador ${i + 1}` })
    }
  }

  const canDraw = match.players.length >= 2

  return (
    <div style={gameVars(game.color)}>
      <section className="bg-[var(--game)] text-[var(--game-ink)]">
        <div className="mx-auto max-w-6xl px-4 pb-6 pt-3 sm:px-6 sm:pb-8">
          <Link
            to="/"
            className="-ml-2 inline-flex h-11 items-center gap-1 rounded-full pl-1 pr-3 text-sm font-semibold hover:bg-black/10"
          >
            <ChevronLeft size={20} />
            Biblioteca
          </Link>
          <div className="mt-2 flex items-center gap-4">
            <span
              aria-hidden="true"
              className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-black/15 text-4xl sm:h-20 sm:w-20 sm:text-5xl"
            >
              {game.emoji}
            </span>
            <div className="min-w-0">
              <h1 className="break-words font-display text-2xl font-bold leading-tight sm:text-4xl">
                {game.name}
              </h1>
              {game.description && <p className="mt-1 text-sm sm:text-base">{game.description}</p>}
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 pb-4 pt-6 sm:px-6">
        <ul className="mb-6 flex flex-wrap gap-2">
          {describeRules(game).map((rule) => (
            <li key={rule} className="rounded-full border border-line px-3 py-1.5 text-sm text-muted">
              {rule}
            </li>
          ))}
        </ul>

        {!match.started ? (
          <section className="max-w-xl rounded-3xl border border-line bg-surface p-5 sm:p-6">
            <h2 className="font-display text-xl font-semibold">Quem vai jogar?</h2>
            <p className="mb-5 mt-1 text-sm text-muted">
              Adicione os nomes e escolha a classe de cada um. Dá pra mudar depois, no meio da partida.
            </p>
            <PlayerEditor
              players={match.players}
              max={game.maxPlayers}
              dispatch={dispatch}
              autoFocus
            />
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                className="btn btn-game"
                disabled={match.players.length === 0}
                onClick={() => dispatch({ type: 'start' })}
              >
                Começar partida
              </button>
              {canDraw && (
                <button type="button" className="btn btn-quiet" onClick={() => setDialog('first')}>
                  <Flag size={18} />
                  Quem começa?
                </button>
              )}
              {match.players.length < Math.max(2, game.minPlayers) && (
                <button type="button" className="btn btn-quiet" onClick={fillDefaultNames}>
                  Usar Jogador 1, 2...
                </button>
              )}
            </div>
          </section>
        ) : (
          <>
            {status.ended && (
              <WinnerBanner
                game={game}
                leaders={status.leaders}
                animate={animateWin}
                onRematch={() => setDialog('rematch')}
              />
            )}

            <div className="mb-5 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
              <button type="button" className="btn btn-quiet btn-small" onClick={() => setDialog('players')}>
                <Users size={16} />
                Jogadores
              </button>
              <button
                type="button"
                className="btn btn-quiet btn-small"
                disabled={!canDraw}
                onClick={() => setDialog('first')}
              >
                <Flag size={16} />
                Quem começa?
              </button>
              <button type="button" className="btn btn-quiet btn-small" onClick={() => setDialog('rematch')}>
                <RotateCcw size={16} />
                Revanche
              </button>
              <button type="button" className="btn btn-quiet btn-small" onClick={() => setDialog('reset')}>
                <Eraser size={16} />
                Nova mesa
              </button>
            </div>

            <Board game={game} match={match} dispatch={dispatch} status={status} />
          </>
        )}
      </main>

      {celebrating && (
        <Celebration
          colors={[game.color, '#ffd166', '#ffffff', ...match.players.map((p) => p.color)]}
          onDone={stopCelebration}
        />
      )}

      <Modal open={dialog === 'players'} onClose={close} title="Jogadores da mesa">
        <PlayerEditor players={match.players} max={game.maxPlayers} dispatch={dispatch} />
        <button type="button" className="btn btn-game mt-6 w-full" onClick={close}>
          Pronto
        </button>
      </Modal>

      <Modal open={dialog === 'first'} onClose={close} title="Quem começa?">
        <FirstPlayerPicker
          players={match.players}
          onPick={(id) => dispatch({ type: 'setStarter', id })}
        />
        <button type="button" className="btn btn-quiet mt-3 w-full" onClick={close}>
          Fechar
        </button>
      </Modal>

      <ConfirmDialog
        open={dialog === 'rematch'}
        onClose={close}
        onConfirm={() => dispatch({ type: 'rematch' })}
        title="Começar a revanche?"
        text="Os pontos voltam a zero e os jogadores continuam os mesmos."
        confirmLabel="Zerar pontos"
      />
      <ConfirmDialog
        open={dialog === 'reset'}
        onClose={close}
        onConfirm={() => dispatch({ type: 'reset' })}
        title="Começar uma mesa nova?"
        text="Os jogadores e os pontos desta partida serão apagados."
        confirmLabel="Apagar tudo"
        danger
      />
    </div>
  )
}