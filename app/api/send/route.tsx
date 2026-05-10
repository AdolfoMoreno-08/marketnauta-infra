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
    userAgent: z.string(),
    botField: z.string().optional().nullable()
});

const resend = new Resend(process.env.RESEND_API_KEY);

const hashData = (data: string) =>
    crypto.createHash('sha256').update(data.trim().toLowerCase()).digest('hex');

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // 1. FILTRO HONEYPOT (Anti-Spam)
        if (body.botField && body.botField !== "") {
            console.warn("[SECURITY]: Bloqueado por Honeypot.");
            return NextResponse.json({ error: 'Signal rejected' }, { status: 400 });
        }

        const validation = contactSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ error: 'Estructura de señal inválida' }, { status: 400 });
        }

        const data = validation.data;
        const ip = request.headers.get('x-forwarded-for') || '0.0.0.0';
        const finalClientId = data.googleClientId || data.eventId;

        // --- PROMESAS DE TRANSMISIÓN ---

        // A. META CAPI
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
                    user_data: {
                        em: [hashData(data.email)],
                        ph: [hashData(data.phone)],
                        client_ip_address: ip,
                        client_user_agent: data.userAgent
                    },
                    custom_data: { content_name: data.challenge, currency: 'USD', value: 0.00 }
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

        // C. RESEND EMAIL (Con dominio verificado)
        const emailHtml = await render(
            <ContactTemplate
                name={data.name} company={data.company} email={data.email}
                phone={data.phone} solution={data.challenge} volume={data.volume}
                budget={data.budget} url={data.url}
            />
        );

        const emailPromise = resend.emails.send({
            // REMITENTE: Ahora que marketnauta.com está verificado, usamos hola@
            from: 'Marketnauta Ops <hola@marketnauta.com>',
            // DESTINO: Tu correo personal donde quieres recibir los leads
            to: [process.env.CONTACT_EMAIL as string],
            subject: `[NUEVA SEÑAL] - ${data.challenge} // ${data.company}`,
            html: emailHtml,
            headers: { 'X-Entity-ID': data.eventId }
        });

        // --- EJECUCIÓN Y MANEJO DE RESULTADOS ---
        const results = await Promise.allSettled([emailPromise, capiPromise, googlePromise]);

        const emailResult = results[0];
        // Si el email falla, logueamos el error pero NO lanzamos Error 500
        if (emailResult.status === 'rejected' || (emailResult.status === 'fulfilled' && (emailResult.value as any).error)) {
            console.error("[RESEND ERROR]:", emailResult.status === 'rejected' ? emailResult.reason : (emailResult.value as any).error);
        }

        // Siempre devolvemos 200 si Meta y Google tuvieron éxito
        return NextResponse.json({
            success: true,
            message: "Signal processed successfully"
        }, { status: 200 });

    } catch (error: any) {
        console.error("[CRITICAL ERROR]:", error.message);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}