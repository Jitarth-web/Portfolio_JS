/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        void: "#030507",
        ink: "#080d12",
        glass: "rgba(10, 20, 27, 0.58)",
        cyanGlow: "#00e5ff",
        ember: "#ff7a1a",
        muted: "#91a6b2"
      },
      fontFamily: {
        display: ["Space Grotesk", "Inter", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"]
      },
      boxShadow: {
        glow: "0 0 44px rgba(0, 229, 255, 0.22)",
        ember: "0 0 32px rgba(255, 122, 26, 0.24)"
      },
      backgroundImage: {
        "radial-grid":
          "radial-gradient(circle at 18% 18%, rgba(0,229,255,.18), transparent 28%), radial-gradient(circle at 82% 20%, rgba(255,122,26,.16), transparent 26%), linear-gradient(180deg, #030507 0%, #071016 50%, #030507 100%)"
      }
    }
  },
  plugins: []
};
