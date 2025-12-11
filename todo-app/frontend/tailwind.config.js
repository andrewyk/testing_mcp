/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        priority: {
          high: '#EF4444',
          medium: '#F97316',
          low: '#3B82F6',
          none: '#6B7280',
        },
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}
