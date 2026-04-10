/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2E7D32',    // Vert foncé de la maquette
        secondary: '#1B5E20',  // Vert très foncé
        accent: '#FF6B00',     // Orange/Ambre pour les accents
      },
    },
  },
  plugins: [],
}