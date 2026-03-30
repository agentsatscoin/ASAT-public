/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: '#050816',
        'navy-dark': '#03050d',
        'navy-light': '#0b1220',
        'navy-lighter': '#141d30',
        'electric-blue': '#9ab7ff',
        'electric-blue-dark': '#7d9ef5',
        gold: '#c8b27d',
        'gold-light': '#e7dcc4',
      },
      fontFamily: {
        display: ['Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      fontSize: {
        '8xl': ['5rem', { lineHeight: '1.02' }],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        glow: 'glow 4s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 0 rgba(0,0,0,0)' },
          '50%': { boxShadow: '0 0 18px rgba(154,183,255,0.10)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
