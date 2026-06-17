/*
  RelatedServices — server component (sin JS de cliente).
  Renderiza la escalera de upsell: enlaza a la capa siguiente y a la previa con
  anchor de beneficio. Los data-* permiten que el listener de Fase B dispare
  internal_link_click sin volver a tocar este archivo.
*/

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { nextLayer, prevLayer } from "@/lib/solutions";

export default function RelatedServices({ step }: { step: number }) {
  const next = nextLayer(step);
  const prev = prevLayer(step);

  const cards = [
    { layer: next, kicker: "Siguiente paso en la escalera" },
    { layer: prev, kicker: "Capa base" },
  ];

  return (
    <section className="py-16 px-6 border-t border-white/[0.06] bg-abisal-950" aria-label="Servicios relacionados">
      <div className="max-w-5xl mx-auto">
        <p className="font-mono text-[10px] text-marketnauta-primary uppercase tracking-[0.3em] mb-6">
          {"// Continúa la ruta de crecimiento"}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cards.map(({ layer, kicker }) => (
            <Link
              key={layer.slug}
              href={layer.slug}
              data-evt="internal_link_click"
              data-from-layer={step}
              data-to-layer={layer.step}
              data-link-position="related"
              className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 hover:border-marketnauta-primary/30 transition-colors"
            >
              <span className="font-mono text-[9px] text-slate-500 uppercase tracking-[0.2em]">
                {kicker} · {layer.layerTag}
              </span>
              <h3 className="text-white font-display font-bold text-lg mt-2 mb-1 flex items-center gap-2">
                {layer.title}
                <ArrowUpRight className="w-4 h-4 text-marketnauta-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-slate-400 text-sm font-light leading-relaxed">
                {layer.inboundAnchor}.
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
