import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import { ContactTemplate } from '@/components/emails/ContactTemplate';
import crypto from 'crypto';
import React from 'react';
import { z } from 'zod';

const contactSchema = z.object({
    challenge: z.string().min(1),
    volume: z.string().min(1),
    budget: z.string().min(1),
    name: z.string().min(2),
    company: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(5),
    url: z.string().optional(),
    eventId: z.string(),
    googleClientId: z.string().nullable().optional(),
    userAgent: z.string()
});

const resend = new Resend(process.env.RESEND_API_KEY);
const hashData = (data: string) => crypto.createHash('sha256').update(data.trim().toLowerCase()).digest('hex');

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const validation = contactSchema.safeParse(body);

        if (!validation.success) return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });

        const data = validation.data;
        const ip = request.headers.get('x-forwarded-for') || '0.0.0.0';
        const promises = [];

        // --- 1. META CAPI (Solo si el token es real) ---
        if (process.env.META_ACCESS_TOKEN && !process.env.META_ACCESS_TOKEN.includes('aqui')) {
            const capiPromise = fetch(`https://graph.facebook.com/v19.0/${process.env.META_PIXEL_ID}/events?access_token=${process.env.META_ACCESS_TOKEN}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    data: [{
                        event_name: 'Lead',
                        event_time: Math.floor(Date.now() / 1000),
                        action_source: 'website',
                        event_id: data.eventId,
                        user_data: {
                            em: [hashData(data.email)],
                            ph: [hashData(data.phone)],
                            client_ip_address: ip,
                            client_user_agent: data.userAgent
                        },
                        custom_data: { content_name: data.challenge, currency: 'USD', value: 0.00 }
                    }]
                })
            }).catch(err => console.error("Meta CAPI skip:", err.message));
            promises.push(capiPromise);
        }

        // --- 2. GOOGLE MP (Solo si existen las llaves) ---
        if (process.env.GA4_MEASUREMENT_ID && process.env.GA4_API_SECRET) {
            const googlePromise = fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${process.env.GA4_MEASUREMENT_ID}&api_secret=${process.env.GA4_API_SECRET}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    client_id: data.googleClientId || data.eventId,
                    events: [{
                        name: 'generate_lead',
                        params: { solution: data.challenge, session_id: data.eventId }
                    }]
                })
            }).catch(err => console.error("Google MP skip:", err.message));
            promises.push(googlePromise);
        }

        // --- 3. RESEND (Remitente de prueba obligatorio) ---
        const emailHtml = await render(
            <ContactTemplate {...data} solution={data.challenge} />
        );

        const emailPromise = resend.emails.send({
            // IMPORTANTE: Usa onboarding@resend.dev hasta que verifiques tu dominio
            from: 'Marketnauta Ops <onboarding@resend.dev>',
            to: [process.env.CONTACT_EMAIL as string],
            subject: `[NUEVA SEÑAL] - ${data.challenge} // ${data.company}`,
            html: emailHtml,
        });
        promises.push(emailPromise);

        // Ejecutamos lo que esté disponible
        await Promise.allSettled(promises);

        return NextResponse.json({ success: true, eventId: data.eventId }, { status: 200 });

    } catch (error: any) {
        console.error("Error Crítico:", error.message);
        return NextResponse.json({ error: "Fallo en transmisión" }, { status: 500 });
    }
}