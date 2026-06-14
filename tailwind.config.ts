import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                abisal: {
                    950: "#030712",
                    900: "#0B132B",
                    800: "#1C2541",
                },
                marketnauta: {
                    primary: "#00E5FF",
                    secondary: "#0077FF",
                    orange: "#FF6B35",
                },
            },
            fontFamily: {
                sans: ["var(--font-inter)"],
                display: ["var(--font-space)"],
                mono: ["var(--font-space)", "ui-monospace", "monospace"],
            },
            backgroundImage: {
                "ocean-glow": "radial-gradient(circle at 50% 50%, rgba(0, 229, 255, 0.05) 0%, transparent 100%)",
                "pain-glow": "radial-gradient(circle at 50% 0%, rgba(255,107,53,0.10) 0%, transparent 70%)",
                "data-grid": `linear-gradient(rgba(0,229,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.04) 1px, transparent 1px)`,
                "neon-border": "linear-gradient(135deg, rgba(0,229,255,0.6), rgba(0,119,255,0.3), rgba(0,229,255,0.1))",
            },
            animation: {
                "fade-in-up": "fadeInUp 0.8s ease-out forwards",
                "pulse-slow": "pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                "flicker": "flicker 4s linear infinite",
                "scan-line": "scanLine 4s linear infinite",
                "data-flow": "dataFlow 2.5s linear infinite",
                "radar-spin": "radarSpin 5s linear infinite",
                "glow-pulse": "glowPulse 2.5s ease-in-out infinite",
                "border-flow": "borderFlow 3s linear infinite",
                "count-up": "fadeInUp 0.5s ease-out forwards",
            },
            keyframes: {
                fadeInUp: {
                    "0%": { opacity: "0", transform: "translateY(20px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                flicker: {
                    "0%, 89%, 91%, 93%, 100%": { opacity: "1" },
                    "90%": { opacity: "0.35" },
                    "92%": { opacity: "0.7" },
                },
                scanLine: {
                    "0%": { transform: "translateY(-100%)", opacity: "0" },
                    "10%": { opacity: "1" },
                    "90%": { opacity: "1" },
                    "100%": { transform: "translateY(200%)", opacity: "0" },
                },
                dataFlow: {
                    "0%": { strokeDashoffset: "1000" },
                    "100%": { strokeDashoffset: "0" },
                },
                radarSpin: {
                    "0%": { transform: "rotate(0deg)" },
                    "100%": { transform: "rotate(360deg)" },
                },
                glowPulse: {
                    "0%, 100%": { boxShadow: "0 0 10px rgba(0,229,255,0.3), 0 0 20px rgba(0,229,255,0.08)" },
                    "50%": { boxShadow: "0 0 30px rgba(0,229,255,0.7), 0 0 60px rgba(0,229,255,0.2)" },
                },
                borderFlow: {
                    "0%": { backgroundPosition: "0% 50%" },
                    "50%": { backgroundPosition: "100% 50%" },
                    "100%": { backgroundPosition: "0% 50%" },
                },
            },
            boxShadow: {
                "neon-short": "0 0 10px rgba(0, 229, 255, 0.35), 0 0 25px rgba(0, 229, 255, 0.1)",
                "neon-long":  "0 0 25px rgba(0, 229, 255, 0.3), 0 0 70px rgba(0, 229, 255, 0.12), 0 0 120px rgba(0, 229, 255, 0.05)",
                "neon-orange": "0 0 15px rgba(255, 107, 53, 0.45), 0 0 50px rgba(255, 107, 53, 0.12)",
                "neon-blue":  "0 0 15px rgba(0, 119, 255, 0.4), 0 0 40px rgba(0, 119, 255, 0.1)",
                "glass": "0 8px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.05)",
                "card-hover": "0 20px 60px rgba(0,0,0,0.5), 0 0 30px rgba(0,229,255,0.08)",
            },
        },
    },
    plugins: [],
};
export default config;
