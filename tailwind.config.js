/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#fef3c7",
          100: "#fde68a",
          200: "#fcd34d",
          300: "#fbbf24",
          400: "#f59e0b",
          500: "#d97706",
          600: "#b45309",
          700: "#92400e",
          800: "#78350f",
          900: "#451a03",
        },
        chess: {
          light: "#f0d9b5",
          dark: "#b58863",
          highlight: "#ffff00",
          check: "#ff0000",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
