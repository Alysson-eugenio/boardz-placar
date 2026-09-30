import { Link } from 'react-router-dom'
import { Trophy } from 'lucide-react'
import Logo from './Logo.jsx'
import { venue } from '../config/venue.js'

export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-night/90 pt-[env(safe-area-inset-top)] backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link to="/" className="flex min-w-0 items-center gap-3">
          <Logo size={44} />
          <span className="min-w-0 leading-tight">
            <span className="block truncate font-display text-sm font-semibold">{venue.name}</span>
            <span className="hidden truncate text-xs text-muted sm:block">{venue.tagline}</span>
          </span>
        </Link>
        <Link
          to="/hall-da-fama"
          className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-bold text-[#2b1a00] shadow-[0_0_18px_rgb(255_209_102/0.28)] transition-[filter,transform] hover:brightness-110 active:scale-95"
          style={{ background: 'linear-gradient(135deg, #ffe08a 0%, #ffd166 45%, #d9a021 100%)' }}
        >
          <Trophy size={16} />
          <span className="hidden min-[400px]:inline">Hall da fama</span>
          <span className="min-[400px]:hidden">Hall</span>
        </Link>
      </div>
    </header>
  )
}