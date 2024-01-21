import { breakPoints } from "./breakPoints";
/** @type {import('tailwindcss').Config} */

module.exports = {
  darkMode: "class",
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
      minWidth: {
        6: "6rem",
        12: "12rem",
      },
      colors: {
        main: "rgb(var(--color-main) / <alpha-value>)",
        primary: "rgb(var(--color-primary) / <alpha-value>)",
        secondary: "rgb(var(--color-secondary) / <alpha-value>)",
        accent: "rgb(var(--color-accent) / <alpha-value>)",
        warning: "rgb(var(--color-warning) / <alpha-value>)",
        disabled: "rgb(var(--color-disabled) / <alpha-value>)",
        textPrimary: "rgb(var(--color-textPrimary) / <alpha-value>)",
        textSecondary: "rgb(var(--color-textSecondary) / <alpha-value>)",
        textAccent: "rgb(var(--color-textAccent) / <alpha-value>)",
        textwarning: "rgb(var(--color-textWarning) / <alpha-value>)",
        textDisabled: "rgb(var(--color-textDisabled) / <alpha-value>)",
        transparent: "transparent",
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
