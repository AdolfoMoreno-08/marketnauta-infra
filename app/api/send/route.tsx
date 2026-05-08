import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import { ContactTemplate } from '@/components/emails/ContactTemplate';
import React from 'react';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        // 1. Extraemos el nuevo set de datos del protocolo
        const body = await request.json();
        const {
            challenge,
            volume,
            budget,
            name,
            company,
            email,
            phone,
            url
        } = body;

        // 2. Validación de infraestructura
        if (!process.env.RESEND_API_KEY || !process.env.CONTACT_EMAIL) {
            console.error("[CRITICAL]: Missing environment variables.");
            return NextResponse.json(
                { error: 'Configuración de servidor incompleta' },
                { status: 500 }
            );
        }

        // 3. Renderizado del template con la nueva estructura B2B
        // Nota: Mapeamos 'challenge' a 'solution' según el prop del template
        let emailHtml;
        try {
            emailHtml = await render(
                <ContactTemplate
                    name={name}
                    company={company}
                    email={email}
                    phone={phone}
                    solution={challenge}
                    volume={volume}
                    budget={budget}
                    url={url}
                />
            );
        } catch (renderError: any) {
            console.error("[ERROR]: Template rendering failed:", renderError.message);
            return NextResponse.json(
                { error: 'Fallo al procesar el reporte de señal' },
                { status: 500 }
            );
        }

        // 4. Transmisión vía Resend
        const { data, error } = await resend.emails.send({
            from: 'Marketnauta Ops <onboarding@resend.dev>',
            to: [process.env.CONTACT_EMAIL as string],
            subject: `[NUEVA SEÑAL] - ${challenge} // ${company}`,
            html: emailHtml,
        });

        if (error) {
            console.error("[ERROR]: Resend API error:", error);
            return NextResponse.json({ error }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            id: data?.id,
            timestamp: new Date().toISOString()
        }, { status: 200 });

    } catch (error: any) {
        console.error("[CRITICAL]: Unhandled API error:", error.message);
        return NextResponse.json(
            { error: 'Fallo crítico en la transmisión' },
            { status: 500 }
        );
    }
}