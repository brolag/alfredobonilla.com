import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        'cyber': {
          'black': '#0a0a0f',
          'dark': '#121317',
          'green': '#00ffaa',
          'blue': '#0088ff',
          'pink': '#ff53c6',
          'red': '#ff5353',
          'yellow': '#ffd553',
          'purple': '#9553ff',
          'teal': '#53fff1',
        },
        'terminal': {
          'bg': 'rgb(var(--background-rgb))',
          'text': 'rgb(var(--foreground-rgb))',
          'glow': 'rgb(var(--terminal-glow))',
          'highlight': 'rgb(var(--terminal-highlight))',
          'error': 'rgb(var(--terminal-error))',
          'warning': 'rgb(var(--terminal-warning))',
          'success': 'rgb(var(--terminal-success))',
        }
      },
      animation: {
        'blink': 'blink 1s step-end infinite',
        'scanline': 'scanline 6s linear infinite',
        'flicker': 'flicker 8s infinite',
        'text-glow': 'textShadowPulse 4s infinite',
      },
      boxShadow: {
        'terminal': '0 0 10px rgba(0, 255, 170, 0.2), inset 0 0 15px rgba(0, 255, 170, 0.1)',
        'terminal-glow': '0 0 20px rgba(0, 255, 170, 0.4), 0 0 30px rgba(0, 255, 170, 0.2)',
      },
    },
  },
  plugins: [],
};
export default config;
