/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,scss,ts}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#087B82',
          dark: '#065f65',
          light: '#def2f3',
          bg: '#f0fafb',
          50: '#f0fafb',
          100: '#def2f3',
          200: '#b6e5e7',
          300: '#7dd1d5',
          400: '#3cb5bb',
          500: '#087B82',
          600: '#065f65',
          700: '#054a4f',
          800: '#043c40',
          900: '#032f33',
        },
        accent: '#F1D217',
        surface: '#ffffff',
        muted: '#6b7280',
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans', 'Segoe UI', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 4px 0 rgba(0,0,0,0.07), 0 1px 2px -1px rgba(0,0,0,0.05)',
        'card-hover': '0 6px 20px 0 rgba(0,0,0,0.10), 0 2px 6px -1px rgba(0,0,0,0.07)',
        header: '0 2px 12px rgba(0,0,0,0.18)',
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
      },
      animation: {
        'fade-in': 'fadeIn 0.25s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
