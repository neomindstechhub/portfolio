import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      fontSize: {
        display: ["2.25rem", { lineHeight: "2.5rem" }],
        "heading-1": ["1.875rem", { lineHeight: "2.25rem" }],
        "heading-2": ["1.5rem", { lineHeight: "1.75rem" }],
        "heading-3": ["1.25rem", { lineHeight: "1.5rem" }],
        "body-lg": ["1rem", { lineHeight: "1.625rem" }],
        body: ["0.875rem", { lineHeight: "1.5rem" }],
        caption: ["0.75rem", { lineHeight: "1.25rem" }],
      },
      colors: {
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        "primary-cta": {
          DEFAULT: "hsl(var(--primary-cta))",
          hover: "hsl(var(--primary-cta-hover))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
