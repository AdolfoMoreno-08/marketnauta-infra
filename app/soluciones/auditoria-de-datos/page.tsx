import type { Metadata } from "next";
import AuditoriaPageContent from "@/components/blocks/AuditoriaPageContent";

export const metadata: Metadata = {
    metadataBase: new URL("https://www.marketnauta.com"),
    title: "Auditoría de Datos e Integridad | Marketnauta",
    description: "Centralizamos tu ecosistema analítico en BigQuery para una trazabilidad absoluta. Tracking server-side, Data Warehousing y dashboards de BI para que escales con certeza, no con suposiciones.",
    alternates: {
        canonical: "https://www.marketnauta.com/soluciones/auditoria-de-datos",
    },
    openGraph: {
        title: "Auditoría de Datos e Integridad | Marketnauta",
        description: "Eliminamos puntos ciegos. Construimos ecosistemas analíticos en BigQuery con tracking server-side y dashboards BI para atribución multi-touch real.",
        url: "https://www.marketnauta.com/soluciones/auditoria-de-datos",
        siteName: "Marketnauta",
        images: [
            {
                url: "/og-image.png",
                width: 1200,
                height: 630,
                alt: "Marketnauta — Auditoría de Datos e Integridad",
            },
        ],
        locale: "es_PE",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Auditoría de Datos e Integridad | Marketnauta",
        description: "Centralizamos tu ecosistema analítico en BigQuery para una trazabilidad absoluta. Tracking server-side y dashboards BI.",
        images: ["/og-image.png"],
    },
};

export default function AuditoriaPage() {
    return <AuditoriaPageContent />;
}
