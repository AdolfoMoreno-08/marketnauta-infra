import type Anthropic from "@anthropic-ai/sdk";

export const CUSTOMER_SERVICE_TOOLS: Anthropic.Tool[] = [
  {
    name: "get_service_details",
    description:
      "Recupera información detallada y argumentos de venta de un servicio específico de Marketnauta para responder preguntas en profundidad.",
    input_schema: {
      type: "object" as const,
      properties: {
        service: {
          type: "string",
          enum: ["auditoria-datos", "gestion-pauta", "desarrollo-estrategia", "activacion-retencion", "inteligencia-predictiva"],
          description: "El servicio sobre el que el usuario pregunta",
        },
      },
      required: ["service"],
    },
  },
  {
    name: "create_lead",
    description:
      "Registra un prospecto en el CRM cuando muestra intención real de compra, solicita una propuesta, quiere hablar con un especialista, o ha completado la calificación mínima (nombre + desafío).",
    input_schema: {
      type: "object" as const,
      properties: {
        name: { type: "string", description: "Nombre del prospecto" },
        company: { type: "string", description: "Empresa del prospecto" },
        email: { type: "string", description: "Email de contacto (si lo proporcionó)" },
        phone: { type: "string", description: "WhatsApp o teléfono (si lo proporcionó)" },
        challenge: {
          type: "string",
          description: "Desafío principal identificado en la conversación",
        },
        budget_range: {
          type: "string",
          description: "Rango de presupuesto mensual mencionado",
        },
        service_interest: {
          type: "string",
          enum: ["auditoria-datos", "gestion-pauta", "desarrollo-estrategia", "activacion-retencion", "inteligencia-predictiva", "multiple"],
          description: "Servicio de mayor interés detectado",
        },
        urgency: {
          type: "string",
          enum: ["inmediata", "1-3-meses", "explorando"],
          description: "Urgencia percibida en la conversación",
        },
        conversation_summary: {
          type: "string",
          description: "Resumen breve de los puntos clave de la conversación para el equipo",
        },
      },
      required: ["name", "challenge", "service_interest"],
    },
  },
  {
    name: "schedule_callback",
    description:
      "Programa una sesión de exploración o llamada de seguimiento con el equipo de Marketnauta.",
    input_schema: {
      type: "object" as const,
      properties: {
        contact_name: { type: "string" },
        contact_method: {
          type: "string",
          enum: ["whatsapp", "email", "videollamada"],
        },
        preferred_time: {
          type: "string",
          description: "Ventana de tiempo preferida por el prospecto",
        },
        topic: {
          type: "string",
          description: "Tema principal para la sesión",
        },
      },
      required: ["contact_name", "contact_method"],
    },
  },
  {
    name: "get_success_cases",
    description:
      "Obtiene casos de éxito relevantes de Marketnauta según el tipo de empresa o desafío del prospecto.",
    input_schema: {
      type: "object" as const,
      properties: {
        industry: {
          type: "string",
          description: "Industria o tipo de empresa del prospecto",
        },
        challenge_type: {
          type: "string",
          enum: ["attribution", "scaling", "web-performance", "data-silos"],
        },
      },
      required: ["challenge_type"],
    },
  },
];

// ─── EJECUTOR DE HERRAMIENTAS ────────────────────────────────────────────────

export async function executeCustomerServiceTool(
  toolName: string,
  input: Record<string, unknown>
): Promise<unknown> {
  switch (toolName) {
    case "get_service_details":
      return getServiceDetails(input.service as string);

    case "create_lead":
      return createLeadFromChat(input);

    case "schedule_callback":
      return scheduleCallback(input);

    case "get_success_cases":
      return getSuccessCases(input);

    default:
      return { error: `Herramienta desconocida: ${toolName}` };
  }
}

function getServiceDetails(service: string) {
  const details: Record<string, object> = {
    "auditoria-datos": {
      name: "Auditoría de Integridad y Trazabilidad de Datos",
      tagline: "Deja de adivinar. Empieza a escalar con certeza.",
      pain_points: [
        "CPA subiendo sin explicación clara",
        "Meta Ads y Google Analytics muestran números diferentes",
        "Incapacidad de escalar campañas sin perder rentabilidad",
        "Decisiones basadas en datos inconsistentes",
      ],
      deliverables: [
        "Auditoría completa del ecosistema de tracking actual",
        "Implementación de tracking server-side (Meta CAPI + GA4)",
        "Data Warehouse en BigQuery con fuentes unificadas",
        "Dashboard de atribución multi-touch en Looker Studio",
        "Modelos de LTV y ROI por canal",
      ],
      ideal_client: "Empresas con inversión activa en pauta que pierden visibilidad de conversiones",
      timeline: "4-8 semanas para implementación completa",
    },
    "gestion-pauta": {
      name: "Gestión de Pauta y Growth Performance",
      tagline: "ROAS matemático, no especulativo.",
      pain_points: [
        "Presupuesto estancado: inviertes más pero el CPA no baja",
        "Segmentación genérica sin datos de LTV",
        "Sin A/B testing estructurado",
        "Algoritmos 'hambrientos' por falta de señales de calidad",
      ],
      deliverables: [
        "Arquitectura de funnels y señales optimizadas",
        "Configuración de Meta CAPI para señales server-side de calidad",
        "Estrategia de optimización por LTV (no por conversión barata)",
        "Sistema de A/B testing con medición de incrementalidad",
        "Escalamiento algorítmico con scripts de automatización",
      ],
      ideal_client: "Empresas con presupuesto mensual >S/2,500 que buscan multiplicar ROAS",
      timeline: "Primeros resultados en 30-60 días",
    },
    "desarrollo-estrategia": {
      name: "Infraestructura Web y Estrategia Digital",
      tagline: "Sistemas que escalan tu lógica de negocio.",
      pain_points: [
        "Sitio web lento que destruye el Quality Score de Google Ads",
        "Código legacy sin integración nativa de datos",
        "UX que genera fricción negativa y abandono",
        "Infraestructura que no escala con el crecimiento",
      ],
      deliverables: [
        "Desarrollo Next.js con Core Web Vitals 100/100",
        "Arquitectura data-ready (BigQuery, GA4, CAPI desde día 1)",
        "Diseño orientado a CRO con metodología de fricción positiva",
        "Edge Runtime para tiempos <0.5s globalmente",
        "Sistema de tracking integrado en el código, no parches externos",
      ],
      ideal_client: "Empresas que necesitan presencia web enterprise como activo estratégico",
      timeline: "6-12 semanas según complejidad",
    },
    "activacion-retencion": {
      name: "Activación & Retención",
      tagline: "El tráfico ya lo pagaste. Ahora recupéralo.",
      pain_points: [
        "El 40% de carritos se abandona sin ningún intento de recuperación",
        "Email masivo con 10% de apertura, no personalizado por comportamiento",
        "WhatsApp sin automatización: respuestas manuales lentas que pierden ventas",
        "Dependencia total de la pauta para generar recompra",
      ],
      deliverables: [
        "WhatsApp Business como CRM: flujos automáticos con intervención humana en momentos críticos",
        "Secuencias de recuperación de carritos por email + WhatsApp segmentadas por intención",
        "Email por comportamiento: bienvenida, post-compra, reactivación medidos server-side",
        "Personalización dinámica de contenido según segmento y origen de tráfico",
        "Todo construido sobre el dato propio en BigQuery — sin migrar de plataforma",
      ],
      ideal_client: "Ecommerce con tráfico pagado activo que quiere subir conversión y LTV sin aumentar pauta",
      timeline: "4-6 semanas para activar los primeros flujos",
    },
    "inteligencia-predictiva": {
      name: "Inteligencia Predictiva",
      tagline: "Deja de reaccionar. Empieza a anticipar.",
      pain_points: [
        "Detectas el churn cuando el cliente ya se fue — reactivarlo cuesta 5× más",
        "Audiencias genéricas por demografía, no por patrón real de compra",
        "Recomendaciones de producto manuales o inexistentes, ticket promedio estancado",
        "Precios fijos en picos de alta demanda (Black Friday peruano)",
      ],
      deliverables: [
        "Modelo de churn: scoring de probabilidad de fuga con alertas para el equipo",
        "Modelo de recompra: identifica quién está listo para volver a comprar",
        "Recomendadores con IA: cross-sell y up-sell automático que sube el ticket 2.3×",
        "Clustering de clientes por patrón de compra real para campañas hiperdirigidas",
        "Inteligencia de precios: pricing dinámico según competencia y estacionalidad",
      ],
      ideal_client: "Empresas con dato histórico en BigQuery que quieren convertirlo en ventaja competitiva",
      timeline: "6-10 semanas para calibrar y desplegar el primer modelo",
    },
  };
  return details[service] ?? { error: "Servicio no encontrado" };
}

async function createLeadFromChat(input: Record<string, unknown>) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://www.marketnauta.com";
    const eventId = `chat_lead_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const res = await fetch(`${baseUrl}/api/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: input.name,
        company: input.company ?? "",
        email: input.email ?? "",
        phone: input.phone ?? "",
        challenge: input.challenge,
        budget: input.budget_range ?? "Por definir",
        volume: "Detectado por chat",
        url: "",
        eventId,
        userAgent: "ChatBot-CS-Agent",
        botField: "",
        source: "customer-service-bot",
        agentSummary: input.conversation_summary,
      }),
    });

    if (res.ok) {
      return {
        success: true,
        message: "Lead registrado correctamente en el CRM de Marketnauta",
        eventId,
      };
    }
    return { success: false, message: "Error al registrar el lead" };
  } catch {
    return { success: false, message: "Error de conexión al registrar lead" };
  }
}

function scheduleCallback(input: Record<string, unknown>) {
  const bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL;
  return {
    success: true,
    message: `Sesión de exploración lista para ${input.contact_name}`,
    contact_method: input.contact_method,
    preferred_time: input.preferred_time ?? "A coordinar por el equipo",
    booking_url: bookingUrl ?? null,
    next_step: bookingUrl
      ? `Agenda directamente en: ${bookingUrl}`
      : "Un especialista de Marketnauta se pondrá en contacto en las próximas 2-4 horas hábiles.",
  };
}

function getSuccessCases(input: Record<string, unknown>) {
  const cases: Record<string, object[]> = {
    attribution: [
      {
        industry: "E-commerce Retail",
        result: "+340% ROAS incremental",
        how: "Centralización en BigQuery + Meta CAPI + optimización hacia LTV de productos de mayor margen",
        timeline: "3 meses",
      },
    ],
    scaling: [
      {
        industry: "SaaS B2B",
        result: "-45% CAC",
        how: "Tracking server-side + modelos de atribución multi-touch que eliminaron desperdicio en pauta",
        timeline: "2 meses",
      },
    ],
    "web-performance": [
      {
        industry: "Corporate B2B",
        result: "+65% tasa de conversión del formulario principal",
        how: "Rediseño CRO + Next.js Edge + Core Web Vitals 100/100",
        timeline: "6 semanas",
      },
    ],
    "data-silos": [
      {
        industry: "Multi-brand Retail",
        result: "Vista unificada de 4 fuentes de datos en un solo dashboard",
        how: "Data Warehouse BigQuery con ETL automatizado desde Meta, Google, CRM y Shopify",
        timeline: "8 semanas",
      },
    ],
  };

  const challengeType = input.challenge_type as string;
  return {
    cases: cases[challengeType] ?? [],
    note: "Casos seleccionados según tu perfil. Podemos compartir detalles adicionales en una sesión.",
  };
}
