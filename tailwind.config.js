import { breakPoints } from "./breakPoints";
/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // // Or if using `src` directory:
    // "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: Object.fromEntries(
      Object.entries(breakPoints).map(([breakpoint, size]) => [
        breakpoint,
        size + "px",
      ])
    ),
    extend: {
      colors: {
        textPrimary: "#000000",
        textSecondary: "#FFFF00",
        textAccent: "#FFFFFF",
        accent: "#EE9999",
        secondary: "#EEFFEE",
        primary: "#99EE99",
        disabled: "#888888",
        secondaryAccent: "#EEFFEE",
        white: "#FFFFFF",
      },

      keyframes: {
        "fade-out": {
          "0%": { opacity: 1 },
          "100%": { opacity: 0 },
        },

        "fade-in": {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
      },
      animation: {
        "fade-out": "fade-out 0.7s linear",
        "fade-in": "fade-in 0.7s linear",
      },
    },
  },
  plugins: [],
};
