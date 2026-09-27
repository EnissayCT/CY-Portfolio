import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0a1628',
          800: '#0d2137',
          700: '#112b45',
          600: '#153654',
          500: '#1c4566',
        },
        accent: {
          DEFAULT: '#4fc3f7',
          light: '#81d4fa',
          dark: '#0395d6',
          glow: 'rgba(79, 195, 247, 0.3)',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        display: ['Raleway', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        grain: 'grain 8s steps(10) infinite',
        'nudge-right': 'nudgeRight 1.5s ease-in-out infinite',
      },
      keyframes: {
        nudgeRight: {
          '0%, 100%': { transform: 'translateX(0)', opacity: '0.5' },
          '50%': { transform: 'translateX(8px)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(79, 195, 247, 0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(79, 195, 247, 0.6)' },
        },
        grain: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '10%': { transform: 'translate(-5%, -10%)' },
          '20%': { transform: 'translate(-15%, 5%)' },
          '30%': { transform: 'translate(7%, -25%)' },
          '40%': { transform: 'translate(-5%, 25%)' },
          '50%': { transform: 'translate(-15%, 10%)' },
          '60%': { transform: 'translate(15%, 0%)' },
          '70%': { transform: 'translate(0%, 15%)' },
          '80%': { transform: 'translate(3%, 35%)' },
          '90%': { transform: 'translate(-10%, 10%)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config
