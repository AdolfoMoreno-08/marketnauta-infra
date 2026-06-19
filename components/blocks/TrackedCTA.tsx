"use client";

import Link from "next/link";
import { ReactNode } from "react";

interface TrackedCTAProps {
    href?: string;
    onClick?: () => void;
    children: ReactNode;
    eventName: string;
    className?: string;
    isExternal?: boolean;
    fromLayer?: number;
}

export default function TrackedCTA({
    href,
    onClick,
    children,
    eventName,
    className = "",
    isExternal = false,
    fromLayer
}: TrackedCTAProps) {

    const handleInteraction = (e: React.MouseEvent) => {
        // 1. TRACKING: Avisamos a GA4 y Meta con evento completo
        if (typeof window !== "undefined") {
            (window as any).dataLayer = (window as any).dataLayer || [];
            (window as any).dataLayer.push({
                event: "cta_click",
                cta_name: eventName,
                ...(fromLayer && { from_layer: fromLayer })
            });

            if ((window as any).fbq) {
                (window as any).fbq('trackCustom', 'CTAClick', { cta_name: eventName });
            }
        }

        // 2. ACCIÓN: Si hay un onClick personalizado, lo ejecutamos
        if (onClick) {
            e.preventDefault();
            onClick();
        }
    };

    if (href) {
        return (
            <Link
                href={href}
                onClick={handleInteraction}
                className={className}
                target={isExternal ? "_blank" : "_self"}
                rel={isExternal ? "noopener noreferrer" : undefined}
                data-evt="cta_click"
                data-cta-name={eventName}
                {...(fromLayer && { "data-from-layer": fromLayer })}
            >
                {children}
            </Link>
        );
    }

    return (
        <button
            onClick={handleInteraction}
            className={className}
            data-evt="cta_click"
            data-cta-name={eventName}
            {...(fromLayer && { "data-from-layer": fromLayer })}
        >
            {children}
        </button>
    );
}
