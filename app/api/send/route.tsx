import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import { ContactTemplate } from '@/components/emails/ContactTemplate';
import crypto from 'crypto';
import React from 'react';
import { z } from 'zod';

// 1. ESQUEMA DE VALIDACIÓN OPTIMIZADO
const contactSchema = z.object({
    challenge: z.string().min(1),
    volume: z.string().min(1),
    budget: z.string().min(1),
    name: z.string().min(2),
    // Permitimos que company sea opcional o un string vacío
    company: z.string().optional().or(z.literal("")),
    // Permitimos que el email sea opcional, vacío, o un email válido si se incluye
    email: z.string().email().optional().or(z.literal("")),
    phone: z.string().min(5),
    // Cambiamos a string simple para que no falle si el usuario olvida el https://
    url: z.string().transform(val => val.trim()).optional(),
    eventId: z.string(),
    googleClientId: z.string().nullable().optional(),
    userAgent: z.string(),
    botField: z.string().optional().nullable()
});

const resend = new Resend(process.env.RESEND_API_KEY || "re_123");

const hashData = (data: string) =>
    crypto.createHash('sha256').update(data.trim().toLowerCase()).digest('hex');

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // 2. FILTRO HONEYPOT (Anti-Spam)
        if (body.botField && body.botField !== "") {
            console.warn("[SECURITY]: Bloqueado por Honeypot silenciado.");
            // Devolvemos 200 para que los bots crean que tuvieron éxito y no busquen vulnerabilidades
            return NextResponse.json({ success: true, eventId: "fake_event" }, { status: 200 });
        }

        const validation = contactSchema.safeParse(body);
        if (!validation.success) {
            console.error("[VALIDATION ERROR]:", validation.error.format());
            return NextResponse.json({ error: 'Estructura de señal inválida' }, { status: 400 });
        }

        const data = validation.data;
        const ip = request.headers.get('x-forwarded-for') || '0.0.0.0';
        const finalClientId = data.googleClientId || data.eventId;

        // Preparamos la data de usuario para Meta (solo mandamos el email si el usuario lo ingresó)
        const userData: any = {
            ph: [hashData(data.phone)],
            client_ip_address: ip,
            client_user_agent: data.userAgent
        };

        if (data.email && data.email !== "") {
            userData.em = [hashData(data.email)];
        }

        // --- PROMESAS DE TRANSMISIÓN ---

        // A. META CAPI (Mejorado con User Agent e IP reales)
        const capiPromise = fetch(`https://graph.facebook.com/v19.0/${process.env.META_PIXEL_ID}/events?access_token=${process.env.META_ACCESS_TOKEN}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                data: [{
                    event_name: 'Lead',
                    event_time: Math.floor(Date.now() / 1000),
                    action_source: 'website',
                    event_id: data.eventId,
                    event_source_url: request.headers.get('referer') || 'https://marketnauta.com',
                    user_data: userData, // Inyectamos el objeto dinámico
                    custom_data: {
                        content_name: data.challenge,
                        currency: 'USD',
                        value: 0.00
                    }
                }]
            })
        }).then(res => res.json()).catch(err => console.error("Meta Error:", err));

        // B. GOOGLE MEASUREMENT PROTOCOL
        const googlePromise = fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${process.env.GA4_MEASUREMENT_ID}&api_secret=${process.env.GA4_API_SECRET}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                client_id: finalClientId,
                events: [{
                    name: 'generate_lead',
                    params: {
                        solution: data.challenge,
                        budget: data.budget,
                        company_size: data.volume,
                        session_id: data.eventId
                    }
                }]
            })
        }).catch(err => console.error("Google Error:", err));

        // C. RESEND EMAIL 
        const emailHtml = await render(
            <ContactTemplate
                name={data.name}
                company={data.company || "No especificada"}
                email={data.email || "No especificado"}
                phone={data.phone}
                challenge={data.challenge}
                volume={data.volume}
                budget={data.budget}
                url={data.url || "No proporcionada"}
            />
        );

        const emailPromise = resend.emails.send({
            from: 'Marketnauta Ops <hola@marketnauta.com>',
            to: [process.env.CONTACT_EMAIL as string],
            // Asunto dinámico por si no envían el nombre de la compañía
            subject: `[NUEVA SEÑAL] - ${data.challenge} // ${data.company || 'Enlace Directo'}`,
            html: emailHtml,
            headers: { 'X-Entity-ID': data.eventId }
        });

        // D. LEAD QUALIFIER — fire-and-forget tras captura exitosa
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://www.marketnauta.com";
        fetch(`${baseUrl}/api/agents/qualify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: data.name,
                company: data.company,
                email: data.email,
                phone: data.phone,
                challenge: data.challenge,
                budget: data.budget,
                volume: data.volume,
                url: data.url,
                source: "contact_form",
            }),
        }).catch((e) => console.error("[send] Qualify trigger failed:", e));

        // --- EJECUCIÓN Y MANEJO DE RESULTADOS ---
        const results = await Promise.allSettled([emailPromise, capiPromise, googlePromise]);

        const emailResult = results[0];

        // Si el email falla, logueamos el error detallado para saber si es 422, 401, etc.
        if (emailResult.status === 'rejected' || (emailResult.status === 'fulfilled' && (emailResult.value as any).error)) {
            const errorDetail = emailResult.status === 'rejected' ? emailResult.reason : (emailResult.value as any).error;
            console.error("[RESEND ERROR]:", JSON.stringify(errorDetail));
        }

        // Siempre devolvemos 200 porque Meta y Google suelen tener éxito
        // (y no queremos asustar al usuario con un error 500)
        return NextResponse.json({
            success: true,
            eventId: data.eventId
        }, { status: 200 });

    } catch (error: any) {
        console.error("[CRITICAL ERROR]:", error.message);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
