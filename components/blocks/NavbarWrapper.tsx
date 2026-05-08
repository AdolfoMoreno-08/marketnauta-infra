"use client";

import { useState } from "react";
import Navbar from "./Navbar";
import ContactForm from "./ContactForm";

export default function NavbarWrapper() {
    const [isContactOpen, setIsContactOpen] = useState(false);

    return (
        <>
            <Navbar onContactClick={() => setIsContactOpen(true)} />
            <ContactForm isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
        </>
    );
}