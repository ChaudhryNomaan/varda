import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Luxury Brand Palette
        charcoal: "#1A1A1B", // Deep, soft black for Atelier sections
        gold: "#C5A059",     // Rich gold for accents and hovers
        bone: "#FAF9F6",     // Soft off-white for sections/backgrounds
        espresso: "#2D2926", // Main text color (softer than pure black)
        taupe: "#8C8179",    // Muted secondary text/border color
        alabaster: "#F3F3F3", // Very light grey for product cards
        burgundy: "#4A0E0E",  // Deep red for sale/exclusive badges
      },
      fontFamily: {
        // Use these if you want to explicitly separate Serif and Sans in CSS
        serif: ["var(--font-inter)", "serif"], // Or your specific serif font
      },
      letterSpacing: {
        "widest-plus": ".3em",
        "editorial": ".5em",
      },
      animation: {
        "slide-down": "slide-down 2s cubic-bezier(0.4, 0, 0.2, 1) infinite",
      },
      keyframes: {
        "slide-down": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;