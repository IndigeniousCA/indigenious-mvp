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
        primary: {
          start: '#667EEA',
          end: '#764BA2',
        },
        success: '#4ECDC4',
        danger: '#FF6B6B',
        dark: {
          start: '#0A0B0F',
          middle: '#1A1B2F',
          end: '#0F1419',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
        'gradient-dark': 'linear-gradient(180deg, #0A0B0F 0%, #1A1B2F 50%, #0F1419 100%)',
        'mesh-gradient': `
          radial-gradient(at 40% 20%, #667EEA 0px, transparent 50%),
          radial-gradient(at 80% 0%, #764BA2 0px, transparent 50%),
          radial-gradient(at 0% 50%, #4ECDC4 0px, transparent 50%),
          radial-gradient(at 80% 50%, #FF6B6B 0px, transparent 50%),
          radial-gradient(at 0% 100%, #667EEA 0px, transparent 50%)
        `,
      },
      backdropFilter: {
        'none': 'none',
        'blur': 'blur(12px)',
      },
      animation: {
        'gradient-shift': 'gradient-shift 15s ease infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        'gradient-shift': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center',
          },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'glow': {
          'from': { 'text-shadow': '0 0 10px #667EEA, 0 0 20px #667EEA, 0 0 30px #667EEA' },
          'to': { 'text-shadow': '0 0 20px #764BA2, 0 0 30px #764BA2, 0 0 40px #764BA2' },
        },
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glass-hover': '0 8px 32px 0 rgba(31, 38, 135, 0.5)',
        'glass-inset': 'inset 0 2px 4px 0 rgba(255, 255, 255, 0.06)',
      },
    },
  },
  plugins: [],
}

export default config