import type { Metadata } from "next";
import Script from "next/script";
import { inter, spaceGrotesk } from "./fonts";
import "./globals.css";
import NavbarWrapper from "@/components/blocks/NavbarWrapper";
import FooterWrapper from "@/components/blocks/FooterWrapper";
import FBPixelTracking from "@/components/tracking/FBPixelTracking";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Marketnauta | Dirección Estratégica en el Océano de Datos",
  description: "Transformamos el ruido digital en mapas de crecimiento claros mediante ingeniería de datos y performance marketing.",
  openGraph: {
    title: "Marketnauta | Ingeniería de Datos y Growth",
    description: "Transformamos el ruido digital en ventajas competitivas.",
    url: "https://marketnauta.com",
    siteName: "Marketnauta",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Marketnauta Dashboard Architecture",
      },
    ],
    locale: "es_PE",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        {/* 1. GOOGLE TAG MANAGER: El cerebro de la telemetría */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-WVHGMSDM');
            `,
          }}
        />

        {/* 2. META PIXEL: El radar de conversiones sociales */}
        <Script
          id="fb-pixel-base"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '1723830311936647');
            `,
          }}
        />
      </head>
      <body className="min-h-screen selection:bg-marketnauta-primary/30 flex flex-col bg-abisal-950">

        {/* 3. COBERTURA SIN JAVASCRIPT (Noscripts) */}
        {/* GTM Noscript: Recomendado por Google al inicio del body */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-WVHGMSDM"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        {/* Meta Pixel Noscript */}
        <noscript>
          <img
            height="1" width="1" style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1723830311936647&ev=PageView&noscript=1"
            alt="fb-pixel"
          />
        </noscript>

        {/* 4. RASTREO DINÁMICO DE SPA: PageViews automáticos */}
        <Suspense fallback={null}>
          <FBPixelTracking />
        </Suspense>

        <NavbarWrapper />

        <main className="flex-grow">
          {children}
        </main>

        <FooterWrapper />

      </body>
    </html>
  );
}