import type { CSSProperties, ReactNode } from "react"

export type Region =
  | "cervical"
  | "ombro"
  | "escapulas"
  | "lombar"
  | "hernia"
  | "quadril"
  | "ciatico"
  | "atletas"

/** Coordenadas = pixels de `body-back.webp` (640×2066), calibradas nos marcos do corpo. */
export const VIEW_W = 640
export const VIEW_H = 2066

/** [y, largura, altura] de cada vértebra. 0-2 cervical · 3-9 torácica · 10-12 lombar */
const SPINE = [
  [255, 44, 20],
  [280, 44, 20],
  [305, 44, 20],
  [355, 52, 26],
  [400, 54, 26],
  [445, 56, 26],
  [490, 56, 26],
  [535, 58, 26],
  [580, 60, 26],
  [625, 62, 26],
  [690, 70, 30],
  [738, 72, 30],
  [786, 74, 30],
] as const

const ALL_SPINE = SPINE.map((_, i) => i)

/** Só o que está afetado acende — sobre um corpo real, coluna fantasma vira adesivo. */
const HOT: Record<Region, readonly number[]> = {
  cervical: [0, 1, 2],
  escapulas: [], // o vão ENTRE os dois ossos é a marca
  lombar: [10, 11, 12],
  hernia: [], // no corpo o glifo é o disco escapando; o mecanismo fica no painel
  ciatico: [12],
  ombro: [],
  quadril: [],
  atletas: ALL_SPINE, // não é lesão: é a coluna inteira em performance
}

/** Centro e alcance do brilho de dor — [cx, cy, rx, ry] */
const GLOW: Record<Region, readonly [number, number, number, number]> = {
  cervical: [320, 310, 120, 95],
  ombro: [160, 405, 130, 120],
  escapulas: [320, 470, 200, 150],
  lombar: [320, 760, 200, 140],
  hernia: [350, 735, 185, 125],
  quadril: [205, 900, 125, 115],
  ciatico: [420, 1150, 150, 380],
  atletas: [320, 600, 240, 420],
}

/**
 * Onde fica cada região no corpo. Usado por `WhereItHurts` para posicionar as
 * zonas clicáveis sobre a imagem. `atletas` e `hernia` ficam de fora: não são
 * pontos do corpo — `hernia` mora no mesmo lugar da lombar e só existe como chip.
 */
export const ANCHOR: Record<Exclude<Region, "atletas" | "hernia">, readonly [number, number]> = {
  cervical: [320, 300],
  ombro: [160, 405],
  escapulas: [320, 450],
  lombar: [320, 760],
  quadril: [205, 900],
  ciatico: [425, 1150],
}

/** Estrutura que a vértebra sozinha não conta */
const EXTRA: Partial<Record<Region, ReactNode>> = {
  // escápulas: os dois ossos triangulares nas costas
  escapulas: <path d="M288 436 220 460 274 580zM352 436 420 460 366 580z" />,
  // ciático: o nervo descendo lombar → glúteo → posterior da coxa
  ciatico: (
    <path
      d="M334 806c62 46 90 132 90 234 4 140 8 280 12 420"
      stroke="var(--q-copper)"
      strokeWidth="16"
      strokeLinecap="round"
      fill="none"
    />
  ),
  // hérnia: o disco espremido entre L1 e L2, escapando pra trás
  hernia: (
    <>
      <rect x="288" y="715" width="64" height="20" rx="10" />
      <ellipse cx="366" cy="725" rx="22" ry="12" />
    </>
  ),
  // ombro: a glenoumeral
  ombro: <circle cx="160" cy="405" r="42" />,
  // quadril: a coxofemoral
  quadril: <circle cx="205" cy="900" r="42" />,
}

/**
 * Corpo de costas: imagem tratada + marcações vetoriais por cima. O SVG segue
 * em copper e temável; a imagem entrega a anatomia, que é o que bezier à mão
 * não alcança.
 *
 * Precisa de um pai posicionado na proporção VIEW_W/VIEW_H — os dois filhos são
 * absolutos e preenchem a caixa.
 */
export function BodyMap({
  region,
  className,
  style,
}: {
  region: Region
  className?: string
  style?: CSSProperties
}) {
  const hot = HOT[region]
  const [cx, cy, rx, ry] = GLOW[region]
  const glowId = `bm-glow-${region}`

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element -- webp já servido no tamanho final (14 KB); next/image só re-encodaria */}
      <img
        src="/quiropraxia/body-back.webp"
        alt=""
        width={VIEW_W}
        height={VIEW_H}
        loading="lazy"
        decoding="async"
        className={`absolute inset-0 h-full w-full object-contain ${className ?? ""}`}
        style={style}
      />

      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="absolute inset-0 h-full w-full"
        aria-hidden
        fill="none"
      >
        <defs>
          <radialGradient id={glowId}>
            <stop offset="0" stopColor="var(--q-copper)" stopOpacity="0.55" />
            <stop offset="0.6" stopColor="var(--q-copper)" stopOpacity="0.2" />
            <stop offset="1" stopColor="var(--q-copper)" stopOpacity="0" />
          </radialGradient>
        </defs>

        <ellipse className="q-bm-glow" cx={cx} cy={cy} rx={rx} ry={ry} fill={`url(#${glowId})`} />

        {SPINE.filter((_, i) => hot.includes(i)).map(([y, w, h]) => (
          <rect
            key={y}
            x={320 - w / 2}
            y={y}
            width={w}
            height={h}
            rx={h / 2}
            fill="var(--q-copper)"
          />
        ))}

        <g fill="var(--q-copper)">{EXTRA[region]}</g>
      </svg>
    </>
  )
}
