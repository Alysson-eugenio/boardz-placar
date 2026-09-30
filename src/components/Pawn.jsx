// Peão (meeple) na cor do jogador
export default function Pawn({ color, size = 28, className = '' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={`shrink-0 ${className}`}
      aria-hidden="true"
    >
      <g fill={color} stroke={color} strokeWidth="1.4" strokeLinejoin="round">
        <circle cx="12" cy="5.4" r="3.1" />
        <path d="M9 9.2 3 11.4l.4 2.2L8 13.2 6 21h4.6l1.4-3.4 1.4 3.4H18l-2-7.8 4.6.4.4-2.2-6-2.2z" />
      </g>
    </svg>
  )
}
