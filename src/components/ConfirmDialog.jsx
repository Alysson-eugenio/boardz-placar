import Modal from './Modal.jsx'

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  text,
  confirmLabel,
  danger = false,
}) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="text-muted">{text}</p>
      <div className="mt-6 grid grid-cols-2 gap-3">
        <button type="button" className="btn btn-quiet" onClick={onClose}>
          Cancelar
        </button>
        <button
          type="button"
          className={`btn ${danger ? 'btn-danger' : 'btn-primary'}`}
          onClick={() => {
            onConfirm()
            onClose()
          }}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  )
}
