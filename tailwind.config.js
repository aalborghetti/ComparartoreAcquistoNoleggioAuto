/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        nlt: {
          light: '#06b6d4', // cyan-500
          DEFAULT: '#0891b2', // cyan-600
          dark: '#0e7490', // cyan-700
        },
        purchase: {
          light: '#f59e0b', // amber-500
          DEFAULT: '#d97706', // amber-600
          dark: '#b45309', // amber-700
        }
      }
    },
  },
  plugins: [],
}
