import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        brand: {
          50: '#f7fce8',
          100: '#eef9d1',
          200: '#ddf3a3',
          300: '#cced75',
          400: '#bbe747',
          500: '#98bf0e', // Huisstijl kleur
          600: '#7a990b',
          700: '#5c7308',
          800: '#3e4d06',
          900: '#202603',
        },
      },
    },
  },
  plugins: [],
}
export default config

