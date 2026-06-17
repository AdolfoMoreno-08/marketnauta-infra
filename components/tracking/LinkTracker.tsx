"use client";

/*
  LinkTracker — listener delegado único (global).
  Dispara `internal_link_click` y `service_hub_view` al dataLayer, reutilizando
  el helper existente (lib/gtm.ts). De ahí, GTM Server-Side reenvía a GA4 + Meta
  CAPI según la config del contenedor (no se toca aquí). El consentimiento lo
  gobierna Consent Mode v2 (ya configurado en layout.tsx): el push al dataLayer
  es inocuo; el envío de red lo gatea el modo de consentimiento.

  No requiere data-* en cada enlace: deriva la capa destino desde la URL contra
  lib/solutions.ts. Respeta data-from-layer / data-to-layer / data-link-position
  cuando existen (los hubs ya los siembran).
*/

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { pushToDataLayer } from "@/lib/gtm";
import { SOLUTION_LAYERS } from "@/lib/solutions";

const genId = () => `evt_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

function layerOfPath(path: string): string {
  if (path === "/") return "home";
  const m = SOLUTION_LAYERS.find((l) => path.startsWith(l.slug));
  return m ? String(m.step) : "other";
}

function layerOfHref(href: string): number | null {
  try {
    const path = href.startsWith("http") ? new URL(href).pathname : href.split(/[?#]/)[0];
    const m = SOLUTION_LAYERS.find((l) => path === l.slug || path.startsWith(l.slug + "/"));
    return m ? m.step : null;
  } catch {
    return null;
  }
}

export default function LinkTracker() {
  const pathname = usePathname();

  // service_hub_view: una vista por hub de capa
  useEffect(() => {
    const m = SOLUTION_LAYERS.find((l) => pathname.startsWith(l.slug));
    if (m) {
      pushToDataLayer({ event: "service_hub_view", layer: String(m.step), event_id: genId() });
    }
  }, [pathname]);

  // internal_link_click: cualquier clic hacia una capa de la escalera de valor
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.getAttribute("href") || "";

      // Eventos de contacto (WhatsApp / email / teléfono) — detección central por href.
      const lower = href.toLowerCase();
      const contactEvent =
        lower.startsWith("mailto:") ? "email_click" :
        lower.startsWith("tel:") ? "tel_click" :
        (lower.includes("wa.me") || lower.includes("whatsapp.com") || lower.includes("api.whatsapp")) ? "whatsapp_click" :
        null;
      if (contactEvent) {
        pushToDataLayer({
          event: contactEvent,
          event_id: genId(),
          channel: contactEvent.replace("_click", ""),
          link_url: href,
          from_layer: layerOfPath(pathname),
        });
        return;
      }

      const toStep = a.dataset.toLayer ? Number(a.dataset.toLayer) : layerOfHref(href);
      if (toStep == null) return; // solo enlaces internos de la escalera

      const position =
        a.dataset.linkPosition ||
        (a.closest("nav") ? "nav" : a.closest("footer") ? "footer" : "content");

      pushToDataLayer({
        event: "internal_link_click",
        event_id: genId(),
        link_text: (a.textContent || "").replace(/\s+/g, " ").trim().slice(0, 80),
        from_layer: a.dataset.fromLayer || layerOfPath(pathname),
        to_layer: String(toStep),
        link_position: position,
        link_url: href,
      });
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [pathname]);

  return null;
}
