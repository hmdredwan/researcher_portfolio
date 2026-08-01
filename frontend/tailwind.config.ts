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
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
