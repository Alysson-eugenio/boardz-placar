import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="mx-auto max-w-6xl px-4 pb-[calc(6rem+env(safe-area-inset-bottom))] pt-6 text-sm text-muted sm:px-6">
      <p>Os pontos ficam só neste aparelho e somem depois de algumas horas.</p>
      <Link to="/admin" className="mt-2 inline-block py-2 underline underline-offset-4 hover:text-ink">
        Área do dono
      </Link>
    </footer>
  )
}
