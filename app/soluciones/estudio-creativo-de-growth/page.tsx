import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { serviceJsonLd, breadcrumbJsonLd, faqJsonLd, type FaqItem } from "@/lib/jsonld";
import { getLayer } from "@/lib/solutions";
import EstudioCreativoPageContent from "@/components/blocks/EstudioCreativoPageContent";

const faqs: FaqItem[] = [
  {
    q: "¿Cuál es la diferencia entre un anuncio 'lindo' y un anuncio que detiene el scroll?",
    a: "Un anuncio lindo es decorativo. Detiene el scroll cuando tiene un hook —una promesa instantánea de valor que le hace al usuario querer saber más. Nos enfocamos en psychology: ¿qué lo hace parar en el feed? Ese es el test, no la estética.",
  },
  {
    q: "¿Por qué las variantes de creatividad importan más que subir presupuesto?",
    a: "Porque el presupuesto solo amplifica lo que tienes. Si el hook es débil, amplificar es quemar dinero. Las variantes (ángulos, formatos, offers) te permiten descubrir qué resonancia con cada audiencia. Cada variante es una hipótesis que el mercado vota con clics.",
  },
  {
    q: "¿Cómo medimos creatividad si no es por Likes o Shares?",
    a: "Medimos performance neto: CTR, tasa de conversión, costo por resultado y ventana de fatiga por variante. Cada pieza registra su servidor-side. No confundimos vanity metrics con resultados que mueven la aguja de ROAS.",
  },
  {
    q: "¿Necesito un equipo creativo in-house o ustedes producen?",
    a: "Ambas vías. Diseñamos el sistema, entrenamos a tu equipo en test-and-learn creativo, y si necesitas volumen modular (statics, Reels templates, UGC-style carruseles), nuestro estudio corre en paralelo. El control sigue siendo tuyo.",
  },
];

const CANONICAL = "https://www.marketnauta.com/soluciones/estudio-creativo-de-growth";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.marketnauta.com"),
  title: "Estudio Creativo de Growth: Piezas como hipótesis medibles | Marketnauta",
  description:
    "Diseñamos anuncios como variables de un sistema de crecimiento. Cada pieza es una hipótesis testeable, producida a escala modular y medida server-side para maximizar ROAS.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Estudio Creativo de Growth | Marketnauta",
    description:
      "Piezas publicitarias como hipótesis medibles, producidas a escala y medidas en tiempo real para maximizar ROAS.",
    url: CANONICAL,
    siteName: "Marketnauta",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Marketnauta — Estudio Creativo de Growth" }],
    locale: "es_PE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Estudio Creativo de Growth | Marketnauta",
    description: "Diseña anuncios como variables de crecimiento. Mide, itera, escala.",
    images: ["/og-image.png"],
  },
};

export default function EstudioCreativoPage() {
  const layer = getLayer(6)!;
  return (
    <>
      <JsonLd data={serviceJsonLd(layer)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Inicio", url: "/" },
          { name: "Soluciones", url: "/#soluciones" },
          { name: "Estudio Creativo de Growth", url: CANONICAL },
        ])}
      />
      <JsonLd data={faqJsonLd(faqs)} />
      <EstudioCreativoPageContent faqs={faqs} />
    </>
  );
}
