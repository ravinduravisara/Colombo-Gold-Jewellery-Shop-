import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: "#FAF6EB",
          100: "#F4ECCF",
          200: "#E9D8A3",
          300: "#DFC577",
          400: "#D4B351",
          500: "#C6A667", // Primary Luxury Gold
          600: "#B8923F",
          700: "#9E7B31",
          800: "#7A5F26",
          900: "#54411A",
        },
        luxury: {
          black: "#111111",
          obsidian: "#0A0A0A",
          charcoal: "#252525",
          muted: "#1C1C1C",
          ivory: "#FAF8F3",
          cream: "#F4EFE6",
          gold: "#C6A667",
        },
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #DFCA95 0%, #C6A667 50%, #9E7F3D 100%)",
        "gold-shimmer": "linear-gradient(90deg, #C6A667 0%, #F5E5C9 50%, #C6A667 100%)",
        "dark-radial": "radial-gradient(circle at center, #252525 0%, #111111 100%)",
      },
      boxShadow: {
        gold: "0 4px 20px -2px rgba(198, 166, 103, 0.25)",
        "gold-lg": "0 10px 30px -5px rgba(198, 166, 103, 0.35)",
        "luxury-dark": "0 20px 40px -15px rgba(0, 0, 0, 0.7)",
      },
      animation: {
        "pulse-subtle": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "shimmer": "shimmer 2.5s infinite linear",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};
export default config;

