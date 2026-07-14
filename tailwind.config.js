/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#10b981', // Emerald 500 for a vibrant, modern touch
        primaryDark: '#059669', // Emerald 600
        background: '#0f172a', // Slate 900 for modern dark mode
        cardBg: '#1e293b', // Slate 800 for cards
        textMain: '#f8fafc', // Slate 50
        textMuted: '#94a3b8', // Slate 400
      }
    },
  },
  plugins: [],
}
