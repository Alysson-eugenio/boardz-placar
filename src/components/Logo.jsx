import { venue } from '../config/venue.js'

// Logo provisório: monograma dentro do anel degradê.
// Para usar o logo real, coloque o arquivo em /public e aponte em venue.logoSrc.
export default function Logo({ size = 44, className = "" }) {
  return (
    <span
      aria-hidden="true"
      className={`story-ring inline-grid shrink-0 place-items-center rounded-full ${className}`}
      style={{ width: size, height: size, borderWidth: size >= 56 ? 3 : 2 }}
    >
      {venue.logoSrc ? (
        <img
          src={venue.logoSrc}
          alt=""
          className="h-full w-full rounded-full object-cover"
        />
      ) : (
        <span
          className="grid h-full w-full place-items-center rounded-full font-display font-black text-ink"
          style={{
            background:
              "linear-gradient(160deg, var(--color-brand), var(--color-brand-deep))",
            fontSize: size * 0.4,
          }}
        >
          {venue.initial}
        </span>
      )}
    </span>
  );
}
