/*
  Builders de JSON-LD (schema.org). Únicos — no duplicar en componentes.
  Organization + WebSite ya viven en app/layout.tsx (sitewide); aquí van los
  tipos por página: Service, BreadcrumbList, FAQPage.
*/

import type { SolutionLayer } from "@/lib/solutions";

const BASE = "https://www.marketnauta.com";

export function serviceJsonLd(layer: SolutionLayer) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: layer.title,
    serviceType: layer.title,
    description: layer.shortDesc,
    provider: { "@type": "Organization", "@id": `${BASE}/#organization` },
    areaServed: { "@type": "Country", name: "Perú" },
    url: `${BASE}${layer.slug}`,
  };
}

export function breadcrumbJsonLd(items: { name: string; url?: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      ...(it.url ? { item: it.url.startsWith("http") ? it.url : `${BASE}${it.url}` } : {}),
    })),
  };
}

export interface FaqItem {
  q: string;
  a: string;
}

export function faqJsonLd(faqs: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
