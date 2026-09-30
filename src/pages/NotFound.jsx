import { Link } from 'react-router-dom'

export default function NotFound({ title = 'Página não encontrada', text = 'Esse endereço não existe.' }) {
  return (
    <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl font-bold">{title}</h1>
      <p className="mt-3 max-w-md text-muted">{text}</p>
      <Link to="/" className="btn btn-primary mt-6">
        Voltar para a biblioteca
      </Link>
    </main>
  )
}
