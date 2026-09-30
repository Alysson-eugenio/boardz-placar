import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Dices } from 'lucide-react'
import Modal from './Modal.jsx'
import DiceRoller from './DiceRoller.jsx'

// Botão flutuante de dados, disponível em todas as telas dos clientes.
export default function DiceFab() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  if (pathname.startsWith('/admin')) return null

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Rolar dados"
        className="fixed right-4 z-40 grid h-14 w-14 place-items-center rounded-full bg-brand text-white shadow-[0_8px_24px_rgb(0_0_0/0.5)] transition-transform active:scale-90"
        style={{ bottom: 'calc(1rem + env(safe-area-inset-bottom))' }}
      >
        <Dices size={26} />
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="Rolar dados">
        <DiceRoller />
      </Modal>
    </>
  )
}
