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
                    950: "#030712", // Fondo base (Océano profundo)
                    900: "#0B132B", // Profundidad media
                    800: "#1C2541", // Superficies y tarjetas
                },
                marketnauta: {
                    primary: "#00E5FF", // Cian Eléctrico (Accent)
                    secondary: "#0077FF", // Azul de marca
                },
            },
            fontFamily: {
                sans: ["var(--font-inter)"],
                display: ["var(--font-space)"],
            },
            backgroundImage: {
                "ocean-glow": "radial-gradient(circle at 50% 50%, rgba(0, 229, 255, 0.05) 0%, transparent 100%)",
            },
            animation: {
                "fade-in-up": "fadeInUp 0.8s ease-out forwards",
                "pulse-slow": "pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite",
            },
            keyframes: {
                fadeInUp: {
                    "0%": { opacity: "0", transform: "translateY(20px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
            },
            boxShadow: {
                'neon-short': "0 0 10px rgba(0, 229, 255, 0.3)",
                'neon-long': "0 0 20px rgba(0, 229, 255, 0.15), 0 0 40px rgba(0, 229, 255, 0.1)",
            },
        },
    },
    plugins: [],
};
export default config;