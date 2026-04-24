/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        midnight: "#050816",
        ink: "#0b1220",
        panel: "rgba(10, 18, 32, 0.72)",
        accent: "#5eead4",
        gold: "#fbbf24",
        rose: "#fb7185"
      },
      boxShadow: {
        glow: "0 24px 80px rgba(15, 23, 42, 0.55)"
      },
      backgroundImage: {
        "aurora-grid":
          "radial-gradient(circle at top, rgba(94, 234, 212, 0.14), transparent 28%), radial-gradient(circle at bottom right, rgba(251, 191, 36, 0.14), transparent 22%), linear-gradient(160deg, rgba(5,8,22,1) 0%, rgba(9,14,28,1) 35%, rgba(2,6,23,1) 100%)"
      }
    }
  },
  plugins: []
};
