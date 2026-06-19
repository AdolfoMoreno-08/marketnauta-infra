/*
  Breadcrumbs — server component (sin JS de cliente).
  Inicio › Soluciones › {Capa}. El JSON-LD BreadcrumbList se añade en Fase C.
*/

import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface Crumb {
  label: string;
  href?: string;
  toLayer?: number;
}

export default function Breadcrumbs({ items, fromLayer = 1 }: { items: Crumb[]; fromLayer?: number }) {
  return (
    <nav aria-label="Ruta de navegación" className="px-6 pt-28 md:pt-32 max-w-5xl mx-auto w-full">
      <ol className="flex flex-wrap items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-slate-500">
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-1.5">
            {item.href ? (
              <Link
                href={item.href}
                data-evt="internal_link_click"
                data-link-position="breadcrumb"
                data-from-layer={fromLayer}
                {...(item.toLayer !== undefined && { "data-to-layer": item.toLayer })}
                className="hover:text-marketnauta-primary transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-slate-300">{item.label}</span>
            )}
            {i < items.length - 1 && <ChevronRight className="w-3 h-3 text-slate-600" />}
          </li>
        ))}
      </ol>
    </nav>
  );
}
