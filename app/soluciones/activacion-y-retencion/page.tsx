import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { serviceJsonLd, breadcrumbJsonLd, faqJsonLd, type FaqItem } from "@/lib/jsonld";
import { getLayer } from "@/lib/solutions";
import ActivacionRetencionPageContent from "@/components/blocks/ActivacionRetencionPageContent";

const faqs: FaqItem[] = [
  {
    q: "¿Cómo recupero carritos abandonados en Perú con WhatsApp?",
    a: "Configuramos secuencias automáticas por WhatsApp y email que se disparan cuando un usuario deja productos en el carrito, segmentadas por intención. En Perú, donde WhatsApp tiene la mayor tasa de apertura, esto recupera ventas que ya estaban a un clic, sin gastar más en pauta.",
  },
  {
    q: "¿Sirve WhatsApp Business como CRM para un ecommerce peruano?",
    a: "Sí. Convertimos WhatsApp Business en un CRM con flujos automatizados e intervención humana en los momentos críticos (cotización, seguimiento, recompra). Cada conversación queda registrada sobre tu propio dato, no en una app aislada.",
  },
  {
    q: "¿Qué es el email marketing por comportamiento?",
    a: "Son envíos disparados por lo que el usuario hace o deja de hacer —bienvenida, post-compra, reactivación—, no campañas masivas. Tienen mayor ROI porque llegan en el momento correcto, y los medimos server-side de punta a punta.",
  },
  {
    q: "¿Necesito cambiar de plataforma para activar mi data?",
    a: "No. Activamos la información que ya capturamos en tu Fundación de Datos (BigQuery + tracking server-side); no migras de tienda ni de herramientas.",
  },
];

const CANONICAL = "https://www.marketnauta.com/soluciones/activacion-y-retencion";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.marketnauta.com"),
  title: "Activación & Retención: WhatsApp CRM y recuperación de carritos | Marketnauta",
  description:
    "Recupera el 40% de carritos que se abandonan y convierte más allá del 0,5%. WhatsApp Business como CRM, recuperación de carritos por email + WhatsApp y personalización sobre tu propio dato.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Activación & Retención | Marketnauta",
    description:
      "WhatsApp CRM, recuperación de carritos y email por comportamiento para retener clientes y subir la conversión del ecommerce peruano.",
    url: CANONICAL,
    siteName: "Marketnauta",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Marketnauta — Activación & Retención" }],
    locale: "es_PE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Activación & Retención | Marketnauta",
    description: "WhatsApp CRM, recuperación de carritos y email por comportamiento sobre tu propio dato.",
    images: ["/og-image.png"],
  },
};

export default function ActivacionRetencionPage() {
  return (
    <>
      <JsonLd data={serviceJsonLd(getLayer(3)!)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Inicio", url: "/" },
          { name: "Soluciones", url: "/#soluciones" },
          { name: "Activación & Retención", url: "/soluciones/activacion-y-retencion" },
        ])}
      />
      <JsonLd data={faqJsonLd(faqs)} />
      <ActivacionRetencionPageContent faqs={faqs} />
    </>
  );
}
