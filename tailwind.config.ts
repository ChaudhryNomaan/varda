import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: "#1A1A1B",
        gold: "#C5A059",
        bone: "#FAF9F6",
        espresso: "#2D2926",
        taupe: "#8C8179",
        alabaster: "#F3F3F3",
        burgundy: "#4A0E0E",
      },
      fontFamily: {
        // FIXED: Pointed serif to playfair instead of inter
        serif: ["var(--font-playfair)", "serif"],
        sans: ["var(--font-inter)", "sans-serif"],
      },
      letterSpacing: {
        "widest-plus": ".3em",
        "editorial": ".5em",
      },
      animation: {
        "slide-down": "slide-down 2s cubic-bezier(0.4, 0, 0.2, 1) infinite",
        "hero-line": "hero-line 3s cubic-bezier(0.7, 0, 0.3, 1) infinite",
      },
      keyframes: {
        "slide-down": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        "hero-line": {
          "0%": { transform: "translateY(-100%)" },
          "50%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(100%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;