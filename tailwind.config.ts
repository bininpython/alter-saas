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
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        accent: "var(--accent)",
        muted: "var(--muted)",
        card: "var(--card)",
        border: "var(--border)",
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
        '5xl': '3rem',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      fontWeight: {
        black: '900',
      }
    },
  },
  plugins: [],
};
export default config;
