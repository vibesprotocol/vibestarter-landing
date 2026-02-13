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
        primary: "#ffffff",
        accent: "#91D982",
        "accent-bright": "#0D8BCA",
        "accent-light": "#D9F1FC",
        muted: "#B8C4CE",
        border: "#1f1f1f",
        surface: "#0a0a0a",
        background: "#0A0A0A",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
        display: ["var(--font-display)", "monospace"],
      },
      animation: {
        "bounce-slow": "bounce-slow 2s infinite",
        "pulse-slow": "pulse 3s infinite",
        "fadeIn": "fadeIn 0.8s ease-out",
        "terminal-blink": "terminal-blink 1s step-end infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "terminal-blink": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
