import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, TrendingDown, Users, Tag, ArrowRight } from "lucide-react";
import Breadcrumbs from "@/components/blocks/Breadcrumbs";
import RelatedServices from "@/components/blocks/RelatedServices";
import TrackedCTA from "@/components/blocks/TrackedCTA";
import JsonLd from "@/components/JsonLd";
import { serviceJsonLd, breadcrumbJsonLd, faqJsonLd, type FaqItem } from "@/lib/jsonld";
import { getLayer } from "@/lib/solutions";

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

const subTemas = [
  {
    id: "recomendadores",
    icon: Sparkles,
    title: "Recomendadores con IA",
    benefit: "Sube el ticket promedio con cross-sell y up-sell automático.",
    body: "Modelos que aprenden del comportamiento real de tus compradores para sugerir el siguiente producto correcto, en la web y en tus campañas.",
  },
  {
    id: "churn-recompra",
    icon: TrendingDown,
    title: "Modelos de churn y recompra",
    benefit: "Sabe quién se va antes de que se vaya, y quién está listo para recomprar.",
    body: "Priorizamos la retención donde más vale: scoring de probabilidad de recompra y alertas de fuga para que el equipo actúe a tiempo.",
  },
  {
    id: "clustering",
    icon: Users,
    title: "Segmentación por clustering",
    benefit: "Audiencias reales, no demográficas genéricas.",
    body: "Agrupamos a tus clientes por patrón de compra para alimentar campañas y CRM hiperdirigidos —insumo directo de la capa de Activación.",
  },
  {
    id: "inteligencia-precios",
    icon: Tag,
    title: "Inteligencia competitiva y de precios",
    benefit: "Pricing dinámico para los picos del Black Friday peruano.",
    body: "Monitoreo de competencia y recomendación de precios según demanda y estacionalidad, para no dejar margen sobre la mesa.",
  },
];

export default function InteligenciaPredictivaPage() {
  return (
    <div className="bg-abisal-950 overflow-x-hidden min-h-screen">
      <JsonLd data={serviceJsonLd(getLayer(4)!)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Inicio", url: "/" },
          { name: "Soluciones", url: "/#soluciones" },
          { name: "Inteligencia Predictiva", url: "/soluciones/inteligencia-predictiva" },
        ])}
      />
      <JsonLd data={faqJsonLd(faqs)} />

      <Breadcrumbs
        items={[
          { label: "Inicio", href: "/" },
          { label: "Soluciones", href: "/#soluciones" },
          { label: "Inteligencia Predictiva" },
        ]}
      />

      <section className="px-6 pt-10 pb-20 max-w-5xl mx-auto">
        <span className="font-mono text-[10px] text-marketnauta-primary uppercase tracking-[0.3em]">
          Capa 4 · ANTICIPAR · Premium
        </span>
        <h1 className="text-4xl md:text-6xl font-display font-bold text-white tracking-tighter leading-[1.05] mt-4 mb-6">
          Deja de reaccionar.<br />
          <span className="text-marketnauta-primary">Empieza a anticipar.</span>
        </h1>
        <p className="text-slate-400 text-lg font-light max-w-2xl leading-relaxed">
          La capa de mayor margen y la más difícil de copiar: requiere el dato que ya
          administramos para ti. Sobre tu información en BigQuery construimos modelos que
          predicen recompra, churn y el siguiente producto —convirtiendo datos en decisiones de
          negocio, no en reportes.
        </p>
        <TrackedCTA
          href="?modal=auditoria"
          eventName="hub_predictiva_cta"
          className="mt-8 inline-flex items-center gap-2.5 px-7 py-4 rounded-full bg-marketnauta-primary text-abisal-950 font-bold text-sm hover:shadow-neon-long transition-all active:scale-95"
        >
          Explorar modelos predictivos <ArrowRight className="w-4 h-4" />
        </TrackedCTA>
      </section>

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

      {/* ENLACE ESCALERA hacia capa 5 */}
      <section className="px-6 pb-10 max-w-5xl mx-auto">
        <p className="text-slate-400 text-base font-light">
          Con la predicción funcionando, escalamos la adquisición con el{" "}
          <Link href="/soluciones/gestion-de-pauta" data-evt="internal_link_click" data-from-layer={4} data-to-layer={5} data-link-position="content" className="text-marketnauta-primary font-medium underline-offset-4 hover:underline">
            Motor de Performance: pauta con IA y retail media en Mercado Libre y Falabella
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

      <RelatedServices step={4} />
    </div>
  );
}
