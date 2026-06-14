import type { Metadata } from "next";
import DesarrolloEstrategiaPageContent from "@/components/blocks/DesarrolloEstrategiaPageContent";

export const metadata: Metadata = {
    metadataBase: new URL("https://www.marketnauta.com"),
    title: "Desarrollo Web y Estrategia Digital | Marketnauta",
    description: "Infraestructuras digitales ultra-rápidas con Next.js, Edge Runtime y Core Web Vitals perfectos. Desarrollamos sistemas data-ready con BigQuery, GA4 y Meta CAPI que convierten y escalan.",
    alternates: {
        canonical: "https://www.marketnauta.com/soluciones/desarrollo-y-estrategia",
    },
    openGraph: {
        title: "Desarrollo Web y Estrategia Digital | Marketnauta",
        description: "No construimos sitios web convencionales. Desarrollamos infraestructuras digitales ultra-rápidas bajo estándares SaaS Enterprise, optimizadas para conversión masiva.",
        url: "https://www.marketnauta.com/soluciones/desarrollo-y-estrategia",
        siteName: "Marketnauta",
        images: [
            {
                url: "/og-image.png",
                width: 1200,
                height: 630,
                alt: "Marketnauta — Desarrollo Web y Estrategia Digital",
            },
        ],
        locale: "es_PE",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Desarrollo Web y Estrategia Digital | Marketnauta",
        description: "Infraestructuras digitales ultra-rápidas con Next.js, Edge Runtime y Core Web Vitals perfectos. Sistemas que convierten y escalan.",
        images: ["/og-image.png"],
    },
};

export default function DesarrolloEstrategiaPage() {
    return <DesarrolloEstrategiaPageContent />;
}
