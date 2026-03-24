import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        electric: 'hsl(var(--electric))',
        neon: 'hsl(var(--neon))',
        blue: 'hsl(var(--blue))',
        charcoal: 'hsl(var(--charcoal))',
        surface: 'hsl(var(--surface))',
        card: 'hsl(var(--card))',
        border: 'hsl(var(--border))',
        'border-bright': 'hsl(var(--border-bright))',
        text: 'hsl(var(--text))',
        muted: 'hsl(var(--muted))',
        accent: 'hsl(var(--accent))',
        green: 'hsl(var(--green))',
        yellow: 'hsl(var(--yellow))',
        red: 'hsl(var(--red))',
      },
      fontFamily: {
        sans: ['var(--font-syne)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
}
export default config
