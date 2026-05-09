"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import * as fbq from "@/lib/fpixel";

export default function FBPixelTracking() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        // Se dispara cada vez que la URL cambia
        fbq.pageview();
    }, [pathname, searchParams]);

    return null;
}