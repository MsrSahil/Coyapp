/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        coy: {
          bg: '#FAF8F5',       // Warm cream/off-white background
          surface: '#FFFFFF',  // Crisp card surface
          subtle: '#F4F1EA',   // Secondary cream surface
          border: '#EAE6DF',   // Soft warm border
          charcoal: '#191716', // Deep charcoal typography
          body: '#423E3B',     // Secondary charcoal text
          muted: '#857F7A',    // Muted captions
          coral: '#FF4458',    // Coy signature warm coral accent
          coralHover: '#E63448',
          coralLight: '#FFF0F2',
          gold: '#D97706',     // Super Like golden accent
          goldLight: '#FEF3C7',
          emerald: '#059669',  // Match emerald accent
          emeraldLight: '#D1FAE5',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Instrument Serif', 'Georgia', 'serif']
      },
      boxShadow: {
        'card': '0 12px 36px -8px rgba(25, 23, 22, 0.12), 0 4px 12px -2px rgba(25, 23, 22, 0.05)',
        'card-hover': '0 20px 48px -10px rgba(25, 23, 22, 0.18), 0 6px 16px -2px rgba(25, 23, 22, 0.08)',
        'button': '0 6px 20px -4px rgba(255, 68, 88, 0.35)',
        'pill': '0 2px 8px -2px rgba(25, 23, 22, 0.08)',
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
}
