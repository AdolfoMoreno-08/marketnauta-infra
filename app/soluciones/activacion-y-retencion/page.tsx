import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle, ShoppingCart, Mail, Sparkles, ArrowRight } from "lucide-react";
import Breadcrumbs from "@/components/blocks/Breadcrumbs";
import RelatedServices from "@/components/blocks/RelatedServices";
import TrackedCTA from "@/components/blocks/TrackedCTA";
import JsonLd from "@/components/JsonLd";
import { serviceJsonLd, breadcrumbJsonLd, faqJsonLd, type FaqItem } from "@/lib/jsonld";
import { getLayer } from "@/lib/solutions";

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

const subTemas = [
  {
    id: "whatsapp-crm",
    icon: MessageCircle,
    title: "WhatsApp Business como CRM",
    benefit: "El canal #1 de apertura en Perú, convertido en motor de ventas.",
    body: "Flujos automatizados con intervención humana en los momentos críticos: cotización, seguimiento y recompra. Cada conversación queda registrada sobre tu propio dato, no en una app aislada.",
  },
  {
    id: "recuperacion-carritos",
    icon: ShoppingCart,
    title: "Recuperación de carritos",
    benefit: "Ataque directo al 40% de abandono por causas internas.",
    body: "Secuencias por email + WhatsApp segmentadas por intención de compra. Recuperamos ventas que ya estaban a un clic, sin gastar un sol más en pauta.",
  },
  {
    id: "email-comportamiento",
    icon: Mail,
    title: "Email por comportamiento",
    benefit: "Retención con ROI alto, tratada como contenido, no como folleto.",
    body: "Disparadores según lo que el usuario hace (o deja de hacer): bienvenida, post-compra, reactivación. Medido server-side de punta a punta.",
  },
  {
    id: "personalizacion",
    icon: Sparkles,
    title: "Personalización dinámica",
    benefit: "La misma web, distinta para cada visitante.",
    body: "Adaptamos contenido y oferta según origen de tráfico, industria y momento del funnel, aprovechando el stack de datos que ya administramos para ti.",
  },
];

export default function ActivacionRetencionPage() {
  return (
    <div className="bg-abisal-950 overflow-x-hidden min-h-screen">
      <JsonLd data={serviceJsonLd(getLayer(3)!)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Inicio", url: "/" },
          { name: "Soluciones", url: "/#soluciones" },
          { name: "Activación & Retención", url: "/soluciones/activacion-y-retencion" },
        ])}
      />
      <JsonLd data={faqJsonLd(faqs)} />

      <Breadcrumbs
        items={[
          { label: "Inicio", href: "/" },
          { label: "Soluciones", href: "/#soluciones" },
          { label: "Activación & Retención" },
        ]}
      />

      {/* HERO — abre con el dolor peruano antes del detalle técnico */}
      <section className="px-6 pt-10 pb-20 max-w-5xl mx-auto">
        <span className="font-mono text-[10px] text-marketnauta-primary uppercase tracking-[0.3em]">
          Capa 3 · RETENER
        </span>
        <h1 className="text-4xl md:text-6xl font-display font-bold text-white tracking-tighter leading-[1.05] mt-4 mb-6">
          El tráfico ya lo pagaste.<br />
          <span className="text-marketnauta-primary">Ahora recupéralo.</span>
        </h1>
        <p className="text-slate-400 text-lg font-light max-w-2xl leading-relaxed">
          En Perú el ecommerce convierte cerca del <strong className="text-white">0,5%</strong> y
          hasta <strong className="text-white">40%</strong> de los carritos se abandona por causas
          internas. Activamos tu propio dato —el que ya capturamos en la{" "}
          <Link href="/soluciones/auditoria-de-datos" data-evt="internal_link_click" data-from-layer={3} data-to-layer={1} data-link-position="content" className="text-marketnauta-primary underline-offset-4 hover:underline">
            Fundación de Datos
          </Link>
          — para recuperar ventas con WhatsApp y email, sin gastar más en pauta.
        </p>
        <TrackedCTA
          href="?modal=auditoria"
          eventName="hub_activacion_cta"
          className="mt-8 inline-flex items-center gap-2.5 px-7 py-4 rounded-full bg-marketnauta-primary text-abisal-950 font-bold text-sm hover:shadow-neon-long transition-all active:scale-95"
        >
          Diagnóstico de retención <ArrowRight className="w-4 h-4" />
        </TrackedCTA>
      </section>

      {/* SUB-TEMAS (spokes con id) */}
      <section className="px-6 pb-20 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5">
        {subTemas.map((t) => {
          const Icon = t.icon;
          return (
            <article key={t.id} id={t.id} className="scroll-mt-28 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-7">
              <Icon className="w-6 h-6 text-marketnauta-primary mb-4" />
              <h2 className="text-white font-display font-bold text-xl mb-1.5">{t.title}</h2>
              <p className="text-marketnauta-primary/90 text-sm font-medium mb-3">{t.benefit}</p>
              <p className="text-slate-400 text-sm font-light leading-relaxed">{t.body}</p>
            </article>
          );
        })}
      </section>

      {/* ENLACE ESCALERA hacia capa 4 */}
      <section className="px-6 pb-10 max-w-5xl mx-auto">
        <p className="text-slate-400 text-base font-light">
          Una vez que activamos tu dato propio, el siguiente nivel es{" "}
          <Link href="/soluciones/inteligencia-predictiva" data-evt="internal_link_click" data-from-layer={3} data-to-layer={4} data-link-position="content" className="text-marketnauta-primary font-medium underline-offset-4 hover:underline">
            anticipar la recompra y el churn con modelos predictivos
          </Link>.
        </p>
      </section>

      {/* FAQ — bloques citables por AI Overviews (coincide con FAQPage JSON-LD) */}
      <section className="px-6 pb-20 max-w-3xl mx-auto" aria-label="Preguntas frecuentes">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-8">Preguntas frecuentes</h2>
        <div className="space-y-5">
          {faqs.map((f) => (
            <details key={f.q} className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
              <summary className="cursor-pointer text-white font-medium text-base list-none flex justify-between gap-4">
                {f.q}
                <span className="text-marketnauta-primary group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="text-slate-400 text-sm font-light leading-relaxed mt-3">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <RelatedServices step={3} />
    </div>
  );
}
