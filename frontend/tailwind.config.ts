import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glass: "0 8px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)",
        glow: "0 0 60px rgba(34,211,238,0.12)",
      },
      backgroundImage: {
        "mesh-radial":
          "radial-gradient(ellipse 120% 80% at 0% -20%, rgba(56,189,248,0.14), transparent 50%), radial-gradient(ellipse 90% 70% at 100% 0%, rgba(139,92,246,0.12), transparent 45%), radial-gradient(ellipse 60% 40% at 50% 100%, rgba(16,185,129,0.06), transparent 40%)",
      },
    },
  },
  plugins: [],
} satisfies Config;
