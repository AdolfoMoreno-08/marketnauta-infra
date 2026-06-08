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
}

export default function TrackedCTA({
    href,
    onClick,
    children,
    eventName,
    className = "",
    isExternal = false
}: TrackedCTAProps) {

    const handleInteraction = (e: React.MouseEvent) => {
        // 1. TRACKING: Avisamos a GA4 y Meta
        if (typeof window !== "undefined") {
            (window as any).dataLayer = (window as any).dataLayer || [];
            (window as any).dataLayer.push({
                event: "cta_click",
                cta_name: eventName
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
            >
                {children}
            </Link>
        );
    }

    return (
        <button onClick={handleInteraction} className={className}>
            {children}
        </button>
    );
}
