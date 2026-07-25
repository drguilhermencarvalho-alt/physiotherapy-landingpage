/**
 * Corte lateral de dois corpos vertebrais lombares, anterior à esquerda.
 * O loop encadeia a causa: a vértebra de cima desce, o disco comprime, o núcleo
 * migra pra trás virando copper, escapa como protrusão e alcança a raiz nervosa.
 *
 * Animação é CSS pura (`quiro.css`) — transform, fill e opacity, sem JS.
 * Em `prefers-reduced-motion` congela no estado herniado, que é o que o desenho
 * precisa ensinar.
 */
export function DiscHernia({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 140 102" className={className} aria-hidden role="presentation" fill="none">
      {/* vértebra superior — desce sob carga */}
      <rect
        className="q-hd-top"
        x="20"
        y="12"
        width="76"
        height="29"
        rx="7"
        fill="currentColor"
        opacity="0.3"
      />

      {/* ânulo do disco — achata */}
      <rect
        className="q-hd-annulus"
        x="20"
        y="41"
        width="76"
        height="20"
        rx="10"
        fill="currentColor"
        opacity="0.16"
      />

      {/* núcleo — migra pra trás e vira o material herniado */}
      <ellipse className="q-hd-nucleus" cx="52" cy="52" rx="15" ry="5" opacity="0.9" />

      {/* protrusão — o que escapa do ânulo */}
      <path className="q-hd-bulge" d="M96 45c19 0 21 14 0 14z" fill="var(--q-copper)" />

      {/* vértebra inferior */}
      <rect x="20" y="61" width="76" height="29" rx="7" fill="currentColor" opacity="0.3" />

      {/* raiz nervosa — acende quando é comprimida */}
      <path
        className="q-hd-nerve"
        d="M120 6c-7 22-7 66 0 90"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  )
}
