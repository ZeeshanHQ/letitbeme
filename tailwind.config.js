/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          warm: '#FAF9F6',
          pearl: '#F7F6F2',
          subtle: '#FAF9F6',
          slate: '#F8F7F4',
          pure: '#FFFFFF',
        },
        surface: {
          pure: '#FFFFFF',
          card: '#FFFFFF',
          glass: 'rgba(255, 255, 255, 0.85)',
        },
        solar: {
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#FF6B00', // Primary Signature Solar Orange
          600: '#EA580C',
          700: '#C2410C',
          800: '#9A3412',
          900: '#7C2D12',
          amber: '#F59E0B',
          gold: '#FBBF24',
        },
        obsidian: {
          DEFAULT: '#0B0F19',
          900: '#0F172A',
          800: '#1E293B',
          700: '#334155',
          600: '#475569',
        }
      },
      fontFamily: {
        heading: ['"Plus Jakarta Sans"', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        sans: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'solar-sm': '0 2px 8px -2px rgba(255, 107, 0, 0.15)',
        'solar-md': '0 12px 24px -6px rgba(255, 107, 0, 0.2)',
        'solar-lg': '0 20px 40px -12px rgba(255, 107, 0, 0.25)',
        'stripe': '0 13px 27px -5px rgba(50,50,93,0.05), 0 8px 16px -8px rgba(0,0,0,0.03)',
        'stripe-hover': '0 30px 60px -12px rgba(50,50,93,0.1), 0 18px 36px -18px rgba(0,0,0,0.06)',
        'glass-dock': '0 20px 50px -10px rgba(11, 15, 25, 0.12)',
      },
      backgroundImage: {
        'solar-gradient': 'linear-gradient(135deg, #FF6B00 0%, #F59E0B 100%)',
        'solar-aura': 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(255, 107, 0, 0.12), rgba(251, 191, 36, 0.05), transparent 70%)',
        'solar-card': 'linear-gradient(135deg, rgba(255, 247, 237, 0.9) 0%, rgba(255, 237, 213, 0.6) 100%)',
      }
    },
  },
  plugins: [],
}
