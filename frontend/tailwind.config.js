/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#2563EB',
          saffron: '#E67E22',
          accent: '#E67E22',
          cream: '#FFF8EE',
          background: '#FFF8EE',
          dark: '#1F2937',
          success: '#15803D',
          card: '#FFFFFF',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
        button: ['Manrope', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 24px -4px rgba(31, 41, 55, 0.06)',
        'card': '0 2px 12px -2px rgba(31, 41, 55, 0.05)',
        'indian': '0 8px 30px -6px rgba(230, 126, 34, 0.12)',
        'glow-blue': '0 4px 20px -2px rgba(37, 99, 235, 0.25)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(12px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
      }
    },
  },
  plugins: [],
}

