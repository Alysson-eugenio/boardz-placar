import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

// Usa o <dialog> nativo: já trava o foco e fecha com Esc.
// No celular vira uma folha que sobe de baixo.
export default function Modal({ open, onClose, title, children }) {
  const ref = useRef(null)
  const panelRef = useRef(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) {
      dialog.showModal()
      panelRef.current?.focus()
    }
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose()
      }}
      className="mx-auto mt-auto mb-0 max-h-[90dvh] w-full max-w-full overflow-y-auto rounded-t-3xl border border-line bg-surface p-0 text-ink sm:my-auto sm:max-w-md sm:rounded-3xl"
    >
      {open && (
        <div
          ref={panelRef}
          tabIndex={-1}
          className="p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] outline-none sm:p-6"
        >
          <div className="mb-4 flex items-start justify-between gap-4">
            <h2 className="font-display text-lg font-semibold leading-snug">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar"
              className="-mr-2 -mt-1 grid h-10 w-10 shrink-0 place-items-center rounded-full text-muted hover:bg-raised hover:text-ink"
            >
              <X size={20} />
            </button>
          </div>
          {children}
        </div>
      )}
    </dialog>
  )
}
