/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#E11D48',
          50: '#FCE7EB',
          100: '#F9CFD7',
          200: '#F3A0AF',
          300: '#ED7087',
          400: '#E7415F',
          500: '#E11D48',
          600: '#B4173A',
          700: '#87112B',
          800: '#5A0C1D',
          900: '#2D060E',
        },
        secondary: {
          DEFAULT: '#F97316',
          50: '#FEF3E7',
          100: '#FDE7CF',
          200: '#FBCF9F',
          300: '#F9B76F',
          400: '#F79F3F',
          500: '#F97316',
          600: '#C75C12',
          700: '#95450D',
          800: '#642E09',
          900: '#321704',
        },
        whatsapp: {
          DEFAULT: '#25D366',
          dark: '#128C7E',
          light: '#DCF8C6',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
        serif: ['Lora', 'serif'],
        devanagari: ['Noto Sans Devanagari', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'glow': '0 0 20px rgba(225, 29, 72, 0.3)',
      },
    },
  },
  plugins: [],
}
