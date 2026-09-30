import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useGames } from '../context/GamesContext.jsx'
import Logo from '../components/Logo.jsx'

// FASE 1: login de mentira, só pra validar o fluxo. Qualquer e-mail e senha entram.
// FASE 2: trocar por autenticação de verdade.
export default function AdminLogin() {
  const { isAdmin, login } = useGames()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  if (isAdmin) return <Navigate to="/admin/jogos" replace />

  function submit(e) {
    e.preventDefault()
    if (!email.trim() || !password) {
      setError('Preencha o e-mail e a senha.')
      return
    }
    login()
    navigate('/admin/jogos')
  }

  return (
    <main className="mx-auto max-w-md px-4 py-12 sm:py-16">
      <Logo size={64} />
      <h1 className="mt-6 font-display text-3xl font-bold">Área do dono</h1>
      <p className="mt-2 text-muted">Entre para cadastrar e editar os jogos da casa.</p>

      <form onSubmit={submit} className="mt-8 space-y-4" noValidate>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">E-mail</span>
          <input
            className="field"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">Senha</span>
          <input
            className="field"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        {error && (
          <p role="alert" className="text-sm text-[#ff8a80]">
            {error}
          </p>
        )}
        <button type="submit" className="btn btn-primary w-full">
          Entrar
        </button>
      </form>

      <p className="mt-6 rounded-2xl border border-dashed border-line p-4 text-sm text-muted">
        Modo demonstração: qualquer e-mail e senha entram. O login de verdade entra na próxima fase.
      </p>
    </main>
  )
}
