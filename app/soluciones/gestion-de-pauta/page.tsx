import type { Metadata } from "next";
import GestionPautaPageContent from "@/components/blocks/GestionPautaPageContent";
import JsonLd from "@/components/JsonLd";
import { serviceJsonLd, breadcrumbJsonLd } from "@/lib/jsonld";
import { getLayer } from "@/lib/solutions";

export const metadata: Metadata = {
    metadataBase: new URL("https://www.marketnauta.com"),
    title: "Gestión de Pauta y Growth Performance | Marketnauta",
    description: "Escalamos tu inversión en Meta Ads y Google Ads con ingeniería de datos. Meta CAPI, optimización por LTV y A/B testing científico para un ROAS matemático, no especulativo.",
    alternates: {
        canonical: "https://www.marketnauta.com/soluciones/gestion-de-pauta",
    },
    openGraph: {
        title: "Gestión de Pauta y Growth Performance | Marketnauta",
        description: "Dejamos atrás la pauta convencional. Utilizamos ingeniería de datos para escalar tu inversión donde el retorno es matemático, no especulativo.",
        url: "https://www.marketnauta.com/soluciones/gestion-de-pauta",
        siteName: "Marketnauta",
        images: [
            {
                url: "/og-image.png",
                width: 1200,
                height: 630,
                alt: "Marketnauta — Growth Performance & Gestión de Pauta",
            },
        ],
        locale: "es_PE",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Gestión de Pauta y Growth Performance | Marketnauta",
        description: "Escalamos tu inversión en Meta Ads y Google Ads con ingeniería de datos. ROAS matemático, no especulativo.",
        images: ["/og-image.png"],
    },
};

export default function GestionPautaPage() {
    return (
        <>
            <JsonLd data={serviceJsonLd(getLayer(5)!)} />
            <JsonLd data={breadcrumbJsonLd([
                { name: "Inicio", url: "/" },
                { name: "Soluciones", url: "/#soluciones" },
                { name: "Motor de Performance", url: "/soluciones/gestion-de-pauta" },
            ])} />
            <GestionPautaPageContent />
        </>
    );
}
