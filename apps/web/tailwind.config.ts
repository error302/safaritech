import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        safaridark: "#0A0A0A",
        safarigray: "#111111",
        safariborder: "#1F1F1F",
        neon: "#00FF9F",
        "neon-dim": "#00CC7A",
        electric: "#00B8FF",
        "electric-dim": "#0099D6",
      },
      fontFamily: {
        display: ["var(--font-outfit)", "sans-serif"],
        body: ["var(--font-dm-sans)", "sans-serif"],
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease forwards",
        "slide-in": "slideIn 0.4s ease forwards",
        pulse_neon: "pulseNeon 2s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          from: { opacity: "0", transform: "translateX(-10px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        pulseNeon: {
          "0%, 100%": { boxShadow: "0 0 8px #00FF9F55" },
          "50%": { boxShadow: "0 0 20px #00FF9F99" },
        },
      },
    },
  },
  plugins: [],
};
export default config;