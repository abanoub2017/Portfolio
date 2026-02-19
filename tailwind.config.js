/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  // purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],

  // Classes stored in Firestore and applied dynamically at runtime.
  // Tailwind can't detect these at build time, so they must be safelisted.
  safelist: [
    // Progress-bar colours (barColor field)
    "bg-orange-400",
    "bg-indigo-500",
    "bg-teal-500",
    "bg-purple-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-red-500",
    "bg-yellow-400",
    "bg-pink-500",
    "bg-cyan-500",

    // Light bar-bg variants
    "bg-indigo-100",
    "bg-orange-100",
    "bg-teal-100",
    "bg-purple-100",
    "bg-blue-100",
    "bg-green-100",
    "bg-red-100",
    "bg-yellow-100",
    "bg-pink-100",
    "bg-cyan-100",

    // Icon background colours (iconBg field — light mode)
    "bg-orange-50",
    "bg-indigo-50",
    "bg-teal-50",
    "bg-purple-50",
    "bg-blue-50",
    "bg-green-50",
    "bg-red-50",
    "bg-yellow-50",
    "bg-pink-50",
    "bg-cyan-50",

    // Icon background colours (iconBg field — dark mode)
    "dark:bg-orange-900/30",
    "dark:bg-indigo-900/30",
    "dark:bg-teal-900/30",
    "dark:bg-purple-900/30",
    "dark:bg-blue-900/30",
    "dark:bg-green-900/30",
    "dark:bg-red-900/30",
    "dark:bg-yellow-900/30",
    "dark:bg-pink-900/30",
    "dark:bg-cyan-900/30",
  ],

  media: "class", // or 'media' or 'class',
  darkMode: "class",
  theme: {
    extend: {
      spacing: {
        big: "48rem",
      },
      fontFamily: {
        nunito: ["Nunito", "sans-serif"],
      },
    },
    screens: {
      sm: "480px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
    },
  },
  plugins: [],
};
