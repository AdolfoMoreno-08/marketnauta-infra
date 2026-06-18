import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { serviceJsonLd, breadcrumbJsonLd, faqJsonLd, type FaqItem } from "@/lib/jsonld";
import { getLayer } from "@/lib/solutions";
import InteligenciaPredictivaPageContent from "@/components/blocks/InteligenciaPredictivaPageContent";

const faqs: FaqItem[] = [
  {
    q: "¿Qué es un modelo de churn y cómo ayuda a mi ecommerce?",
    a: "Un modelo de churn predice qué clientes están por dejar de comprar antes de que lo hagan, asignándoles una probabilidad de fuga. Con eso priorizas la retención donde más vale, en lugar de reaccionar cuando ya perdiste al cliente.",
  },
  {
    q: "¿Necesito mucha data para usar modelos predictivos?",
    a: "Trabajamos sobre el dato que ya administramos para ti en BigQuery. Con historial de transacciones y comportamiento suele bastar para empezar con recomendadores y modelos de recompra; calibramos según el volumen disponible.",
  },
  {
    q: "¿Un recomendador con IA realmente sube el ticket promedio?",
    a: "Sí: aprende del comportamiento real de tus compradores para sugerir el siguiente producto correcto (cross-sell y up-sell), en la web y en campañas. Es una de las palancas más directas para subir el ticket promedio.",
  },
  {
    q: "¿Cómo funciona el pricing dinámico para el Black Friday peruano?",
    a: "Monitoreamos competencia y demanda para recomendar precios por producto según la estacionalidad, con foco en picos como el Black Friday peruano, para no dejar margen sobre la mesa ni perder competitividad.",
  },
];

const CANONICAL = "https://www.marketnauta.com/soluciones/inteligencia-predictiva";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.marketnauta.com"),
  title: "Inteligencia Predictiva: modelos de churn, recompra y recomendación | Marketnauta",
  description:
    "Anticipa qué cliente compra, cuál se va y qué producto recomendar. Modelos predictivos de churn y recompra, recomendadores con IA y pricing dinámico sobre tu propio dato en BigQuery.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Inteligencia Predictiva | Marketnauta",
    description:
      "Recomendadores con IA, modelos de churn/recompra, clustering e inteligencia de precios sobre tu propio dato.",
    url: CANONICAL,
    siteName: "Marketnauta",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Marketnauta — Inteligencia Predictiva" }],
    locale: "es_PE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Inteligencia Predictiva | Marketnauta",
    description: "Modelos de churn, recompra y recomendación con IA sobre tu propio dato.",
    images: ["/og-image.png"],
  },
};

export default function InteligenciaPredictivaPage() {
  return (
    <>
      <JsonLd data={serviceJsonLd(getLayer(4)!)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Inicio", url: "/" },
          { name: "Soluciones", url: "/#soluciones" },
          { name: "Inteligencia Predictiva", url: "/soluciones/inteligencia-predictiva" },
        ])}
      />
      <JsonLd data={faqJsonLd(faqs)} />
      <InteligenciaPredictivaPageContent faqs={faqs} />
    </>
  );
}
