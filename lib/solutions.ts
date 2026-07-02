/*
  FUENTE ÚNICA DE VERDAD — las 5 capas de valor (escalera de upsell).
  Usado por: SolutionsGrid (home), Navbar, Footer, RelatedServices, Breadcrumbs,
  sitemap y las páginas de cada hub. NO duplicar estos datos en otro sitio.

  Escalera: MEDIR → CONVERTIR → RETENER → ANTICIPAR → ESCALAR → (vuelve a MEDIR).
*/

export interface SolutionLayer {
  step: 1 | 2 | 3 | 4 | 5 | 6;
  slug: string; // ruta absoluta
  navLabel: string; // etiqueta corta para el nav
  title: string; // H1 del hub / título de card
  layerTag: string; // MEDIR | CONVERTIR | ...
  /** Anchor de beneficio (negocio primero, técnica de soporte) para enlazar HACIA esta capa. */
  inboundAnchor: string;
  /** Descripción corta localizada (Perú) para cards y related. */
  shortDesc: string;
}

export const SOLUTION_LAYERS: SolutionLayer[] = [
  {
    step: 1,
    slug: "/soluciones/auditoria-de-datos",
    navLabel: "Auditoría",
    title: "Auditoría de Datos",
    layerTag: "MEDIR",
    inboundAnchor: "Mide sin puntos ciegos con tracking server-side (GTM SS + Meta CAPI)",
    shortDesc: "Trazabilidad total: server-side, BigQuery y atribución real para decidir con evidencia.",
  },
  {
    step: 2,
    slug: "/soluciones/desarrollo-y-estrategia",
    navLabel: "Conversión",
    title: "Infraestructura de Conversión",
    layerTag: "CONVERTIR",
    inboundAnchor: "Sube tu conversión del 0,5% con CRO y checkout para Yape, Plin y cuotas/BNPL",
    shortDesc: "Web ultrarrápida, CRO y checkout local mobile-first que convierte el tráfico que ya pagas.",
  },
  {
    step: 3,
    slug: "/soluciones/activacion-y-retencion",
    navLabel: "Retención",
    title: "Activación & Retención",
    layerTag: "RETENER",
    inboundAnchor: "Recupera carritos y retén clientes con WhatsApp CRM y email por comportamiento",
    shortDesc: "WhatsApp Business como CRM, recuperación de carritos y personalización sobre tu propio dato.",
  },
  {
    step: 4,
    slug: "/soluciones/inteligencia-predictiva",
    navLabel: "Predicción",
    title: "Inteligencia Predictiva",
    layerTag: "ANTICIPAR",
    inboundAnchor: "Anticipa recompra y churn con modelos predictivos sobre tu propio dato",
    shortDesc: "Recomendadores con IA, modelos de churn/recompra y pricing dinámico para el Black Friday peruano.",
  },
  {
    step: 5,
    slug: "/soluciones/gestion-de-pauta",
    navLabel: "Performance",
    title: "Motor de Performance",
    layerTag: "ESCALAR",
    inboundAnchor: "Escala la adquisición con pauta optimizada por IA y retail media (Mercado Libre / Falabella)",
    shortDesc: "Pauta optimizada por IA, retail media en marketplaces locales y SEO conversacional (AI Overviews).",
  },
  {
    step: 6,
    slug: "/soluciones/estudio-creativo-de-growth",
    navLabel: "Creatividad",
    title: "Estudio Creativo de Growth",
    layerTag: "CREAR",
    inboundAnchor: "Diseña piezas publicitarias como hipótesis medibles, producidas a escala y medidas server-side para maximizar ROAS",
    shortDesc: "Piezas como variables de crecimiento: cada anuncio es una hipótesis testeable, modular y medida para maximizar ROAS.",
  },
];

/** Capa por número de paso. */
export function getLayer(step: number): SolutionLayer | undefined {
  return SOLUTION_LAYERS.find((l) => l.step === step);
}

/** Siguiente paso de la escalera (6 y 5 vuelven a 1). */
export function nextLayer(step: number): SolutionLayer {
  return getLayer(step === 5 || step === 6 ? 1 : step + 1)!;
}

/** Paso anterior de la escalera (1 envuelve a 5). */
export function prevLayer(step: number): SolutionLayer {
  return getLayer(step === 1 ? 5 : step - 1)!;
}
