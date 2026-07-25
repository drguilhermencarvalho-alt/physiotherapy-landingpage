"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { ANCHOR, BodyMap, VIEW_H, VIEW_W, type Region } from "@/components/quiropraxia/body-map"
import { DiscHernia } from "@/components/quiropraxia/disc-hernia"
import { Reveal } from "@/components/quiropraxia/reveal"
import { QuiroWhatsButton } from "@/components/quiropraxia/whats-button"
import { track } from "@/lib/analytics"
import { WHATSAPP_BASE } from "@/lib/config"

type Zone = Region

/** Ordem de cima pra baixo no corpo. `hernia` e `atletas` não são pontos: só chip. */
const ZONES: readonly Zone[] = [
  "cervical",
  "ombro",
  "escapulas",
  "lombar",
  "hernia",
  "quadril",
  "ciatico",
  "atletas",
]

/** As que têm ponto no corpo — ANCHOR é a fonte única. */
const PINNED = Object.keys(ANCHOR) as (keyof typeof ANCHOR)[]

/** Raio da zona clicável em unidades do viewBox (px da imagem). */
const HIT_R = 70

const px = (u: number) => `${(u / VIEW_W) * 100}%`
const py = (u: number) => `${(u / VIEW_H) * 100}%`

export function WhereItHurts() {
  const t = useTranslations("quiro.conditions")
  const [active, setActive] = useState<Zone>("lombar")

  function select(zone: Zone) {
    setActive(zone)
    track("quiro_region_select", { region: zone, page: "quiropraxia" })
  }

  return (
    <section id="tratamos" className="scroll-mt-20 bg-[var(--q-bg)] py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal section="conditions" className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--q-copper)]">
            {t("tagline")}
          </p>
          <h2 className="mt-3 font-serif text-3xl font-bold text-[var(--q-text)] text-balance sm:text-4xl md:text-5xl">
            {t("title")}
          </h2>
          <p className="mt-4 text-sm text-[var(--q-muted)] sm:text-base">{t("subtitle")}</p>
        </Reveal>

        <div className="mt-12 grid gap-8 md:grid-cols-[minmax(0,340px)_1fr] md:items-start md:gap-12">
          {/* Corpo + zonas clicáveis */}
          <div>
            <div className="relative mx-auto aspect-[640/2066] w-full max-w-[150px] sm:max-w-[190px]">
              <BodyMap region={active} />

              {PINNED.map((zone) => {
                const [x, y] = ANCHOR[zone]
                const on = active === zone
                return (
                  <button
                    key={zone}
                    type="button"
                    onClick={() => select(zone)}
                    aria-pressed={on}
                    aria-label={t(`items.${zone}.label`)}
                    style={{
                      left: px(x),
                      top: py(y),
                      width: px(HIT_R * 2),
                      height: py(HIT_R * 2),
                    }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--q-copper)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--q-bg)] ${
                      on
                        ? "border-[var(--q-copper)] bg-[var(--q-copper)]/15"
                        : "border-[var(--q-copper)]/25 hover:border-[var(--q-copper)]/70 hover:bg-[var(--q-copper)]/10"
                    }`}
                  />
                )
              })}
            </div>

            <div
              role="group"
              aria-label={t("pick")}
              className="mt-6 flex flex-wrap justify-center gap-2"
            >
              {ZONES.map((zone) => {
                const on = active === zone
                return (
                  <button
                    key={zone}
                    type="button"
                    onClick={() => select(zone)}
                    aria-pressed={on}
                    className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--q-copper)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--q-bg)] ${
                      on
                        ? "border-[var(--q-copper)] bg-[var(--q-copper)]/15 text-[var(--q-copper)]"
                        : "border-[var(--q-border)] text-[var(--q-muted)] hover:border-[var(--q-copper)]/60 hover:text-[var(--q-text)]"
                    }`}
                  >
                    {t(`items.${zone}.label`)}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Painéis — todos no DOM (indexáveis), só o ativo visível */}
          <div aria-live="polite">
            {ZONES.map((zone) => (
              <div
                key={zone}
                hidden={active !== zone}
                className="rounded-2xl border border-[var(--q-border)] bg-[var(--q-card)] p-6 sm:p-8"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--q-copper)]">
                  {t(`items.${zone}.condition`)}
                </p>
                <p className="mt-4 font-serif text-xl leading-snug text-[var(--q-text)] text-balance sm:text-2xl">
                  “{t(`items.${zone}.feels`)}”
                </p>
                {zone === "hernia" && (
                  <figure className="mt-6 rounded-xl border border-[var(--q-border)] bg-[var(--q-bg)] px-4 py-5">
                    <DiscHernia className="mx-auto h-24 w-auto text-[var(--q-text)]" />
                    <figcaption className="mt-3 text-center text-xs leading-relaxed text-[var(--q-muted)]">
                      {t("items.hernia.diagram")}
                    </figcaption>
                  </figure>
                )}
                <p className="mt-5 text-sm leading-relaxed text-[var(--q-muted)] sm:text-base">
                  {t(`items.${zone}.does`)}
                </p>
                <QuiroWhatsButton
                  location={`conditions_${zone}`}
                  href={`${WHATSAPP_BASE}${encodeURIComponent(t(`items.${zone}.message`))}`}
                  className="mt-7 w-full sm:w-auto"
                >
                  {t("cta")}
                </QuiroWhatsButton>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
