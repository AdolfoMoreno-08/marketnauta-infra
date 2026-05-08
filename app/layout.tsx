import type { Metadata } from "next"; // Importante para el SEO
import { inter, spaceGrotesk } from "./fonts";
import "./globals.css";
import NavbarWrapper from "@/components/blocks/NavbarWrapper";
import FooterWrapper from "@/components/blocks/FooterWrapper";

// Metadatos avanzados para SEO y Redes Sociales (Open Graph)
export const metadata: Metadata = {
  title: "Marketnauta | Dirección Estratégica en el Océano de Datos",
  description: "Transformamos el ruido digital en mapas de crecimiento claros mediante ingeniería de datos y performance marketing.",
  openGraph: {
    title: "Marketnauta | Ingeniería de Datos y Growth",
    description: "Transformamos el ruido digital en ventajas competitivas.",
    url: "https://marketnauta.com",
    siteName: "Marketnauta",
    images: [
      {
        url: "/og-image.jpg", // Asegúrate de crear una imagen de 1200x630px en tu carpeta /public
        width: 1200,
        height: 630,
        alt: "Marketnauta Dashboard Architecture",
      },
    ],
    locale: "es_PE",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="min-h-screen selection:bg-marketnauta-primary/30 flex flex-col bg-abisal-950">

        <NavbarWrapper />

        <main className="flex-grow">
          {children}
        </main>

        <FooterWrapper />

      </body>
    </html>
  );
}