"use client";

import { useState } from "react";
import Footer from "./Footer";
import ContactForm from "./ContactForm";

export default function FooterWrapper() {
    const [isContactOpen, setIsContactOpen] = useState(false);

    return (
        <>
            <Footer onContactClick={() => setIsContactOpen(true)} />

            {/* Tu modal de contacto */}
            <ContactForm
                isOpen={isContactOpen}
                onClose={() => setIsContactOpen(false)}
            />
        </>
    );
}