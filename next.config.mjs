import createNextIntlPlugin from "next-intl/plugin"

const withNextIntl = createNextIntlPlugin("./i18n/request.ts")

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      // /laudo é uma página HTML estática e independente (public/laudo/index.html),
      // sem o layout, o cabeçalho e o rodapé do site.
      { source: "/laudo", destination: "/laudo/index.html" },
    ]
  },
}

export default withNextIntl(nextConfig)
