import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        indigo: {
          DEFAULT: "#4f46e5",
        },
        ink: {
          50: "#f6f7fb",
          100: "#eceef6",
          200: "#d4d8ea",
          300: "#a9b1d1",
          400: "#7681ab",
          500: "#525f8a",
          600: "#3d4770",
          700: "#2f3759",
          800: "#1e2440",
          900: "#13182f",
        },
      },
      fontFamily: {
        serif: ["Georgia", "Cambria", "Times New Roman", "serif"],
        sans: ["ui-sans-serif", "system-ui", "Segoe UI", "Roboto", "sans-serif"],
      },
      backgroundImage: {
        "hero-grid":
          "radial-gradient(circle at 20% 20%, rgba(79,70,229,0.25), transparent 40%), radial-gradient(circle at 80% 0%, rgba(56,189,248,0.18), transparent 35%), radial-gradient(circle at 50% 100%, rgba(129,140,248,0.18), transparent 40%)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-30px)" },
        },
        "float-delayed": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-40px)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.8" },
        },
        "rotate-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "gradient-shift": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        "blob-1": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(30px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
        },
        "blob-2": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(-30px, 50px) scale(0.9)" },
          "66%": { transform: "translate(20px, -30px) scale(1.1)" },
        },
        "shimmer": {
          "0%": { opacity: "0", transform: "translateX(-100%)" },
          "50%": { opacity: "1" },
          "100%": { opacity: "0", transform: "translateX(100%)" },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "0.2", transform: "scale(1)" },
          "50%": { opacity: "0.6", transform: "scale(1.2)" },
        },
        "glow-pulse-delayed": {
          "0%, 100%": { opacity: "0.15", transform: "scale(1)" },
          "50%": { opacity: "0.5", transform: "scale(1.15)" },
        },
        "light-ray": {
          "0%": { transform: "translateY(-100%) rotate(-45deg)", opacity: "0" },
          "50%": { opacity: "0.3" },
          "100%": { transform: "translateY(100%) rotate(-45deg)", opacity: "0" },
        },
        "float-smooth-1": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "25%": { transform: "translate(20px, -30px) scale(1.05)" },
          "50%": { transform: "translate(-10px, -50px) scale(0.95)" },
          "75%": { transform: "translate(-30px, 10px) scale(1.02)" },
        },
        "float-smooth-2": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "25%": { transform: "translate(-25px, 35px) scale(1.02)" },
          "50%": { transform: "translate(15px, 55px) scale(0.98)" },
          "75%": { transform: "translate(35px, -15px) scale(1.05)" },
        },
        "color-shift": {
          "0%": { filter: "hue-rotate(0deg)" },
          "50%": { filter: "hue-rotate(20deg)" },
          "100%": { filter: "hue-rotate(0deg)" },
        },
        "shine": {
          "0%": { backgroundPosition: "200% center" },
          "50%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        "shine-border": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        "glow-expand": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(129, 140, 248, 0.4), inset 0 0 20px rgba(129, 140, 248, 0.1)" },
          "50%": { boxShadow: "0 0 40px rgba(129, 140, 248, 0.6), inset 0 0 30px rgba(129, 140, 248, 0.2)" },
        },
        "wave": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        "wave-slow": {
          "0%": { backgroundPosition: "0% 0%" },
          "50%": { backgroundPosition: "100% 100%" },
          "100%": { backgroundPosition: "0% 0%" },
        },
        "wave-shine": {
          "0%": { transform: "translateX(-150%) skewY(-5deg)", opacity: "0" },
          "50%": { opacity: "1" },
          "100%": { transform: "translateX(150%) skewY(-5deg)", opacity: "0" },
        },
        "wave-shine-delayed": {
          "0%": { transform: "translateX(-150%) skewY(5deg)", opacity: "0" },
          "50%": { opacity: "0.8" },
          "100%": { transform: "translateX(150%) skewY(5deg)", opacity: "0" },
        },
        "light-wave": {
          "0%": { 
            backgroundPosition: "200% center",
            opacity: "0.3"
          },
          "50%": { 
            backgroundPosition: "-200% center",
            opacity: "1"
          },
          "100%": { 
            backgroundPosition: "-600% center",
            opacity: "0.3"
          },
        },
        "stat-hover": {
          "0%, 100%": { transform: "translateY(0) scale(1)" },
          "50%": { transform: "translateY(-4px) scale(1.02)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out both",
        "float": "float 4s ease-in-out infinite",
        "float-delayed": "float-delayed 4.5s ease-in-out infinite 0.8s",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        "rotate-slow": "rotate-slow 15s linear infinite",
        "gradient-shift": "gradient-shift 6s ease infinite",
        "blob-1": "blob-1 5s infinite",
        "blob-2": "blob-2 5.5s infinite 0.4s",
        "shimmer": "shimmer 2s ease-in-out infinite",
        "glow-pulse": "glow-pulse 3.5s ease-in-out infinite",
        "glow-pulse-delayed": "glow-pulse-delayed 4s ease-in-out infinite 0.8s",
        "light-ray": "light-ray 2s ease-in-out infinite",
        "light-ray-delayed": "light-ray 2.5s ease-in-out infinite 0.4s",
        "float-smooth-1": "float-smooth-1 5.5s ease-in-out infinite",
        "float-smooth-2": "float-smooth-2 6s ease-in-out infinite 0.3s",
        "color-shift": "color-shift 7s ease-in-out infinite",
        "shine": "shine 4s ease-in-out infinite",
        "shine-border": "shine-border 5s ease-in-out infinite",
        "glow-expand": "glow-expand 3s ease-in-out infinite",
        "wave": "wave 3s ease-in-out infinite",
        "wave-slow": "wave-slow 6s ease-in-out infinite",
        "wave-shine": "wave-shine 3.5s ease-in-out infinite",
        "wave-shine-delayed": "wave-shine-delayed 3.5s ease-in-out infinite 0.6s",
        "light-wave": "light-wave 4s ease-in-out infinite",
        "stat-hover": "stat-hover 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
