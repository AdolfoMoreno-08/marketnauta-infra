"use client";

import * as React from 'react';

interface ContactTemplateProps {
    name: string;
    email: string;
    phone: string;
    company: string;
    challenge: string; // Sincronizado con el estado de tu formulario
    volume: string;    // Sincronizado con el estado de tu formulario
    budget: string;    // Sincronizado con el estado de tu formulario
    url?: string;
}

export function ContactTemplate({
    name,
    email,
    phone,
    company,
    challenge,
    volume,
    budget,
    url
}: ContactTemplateProps) {
    return (
        <div style={{ backgroundColor: '#030712', color: '#f8fafc', padding: '40px', fontFamily: 'Courier New, monospace', maxWidth: '600px', margin: '0 auto' }}>
            {/* Encabezado Técnico Cyberpunk */}
            <h1 style={{ color: '#00E5FF', fontSize: '20px', borderBottom: '1px solid #1e293b', paddingBottom: '10px', marginTop: '0' }}>
                &gt; SEÑAL_DE_CONTACTO_DECODIFICADA // {challenge === "No especificado" ? "ENLACE DIRECTO" : challenge.toUpperCase()}
            </h1>

            {/* Sección 01: Identidad del Enlace */}
            <div style={{ marginTop: '30px' }}>
                <h2 style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '2px', margin: '0 0 10px 0' }}>
                    [01] IDENTIDAD_DEL_ENLACE
                </h2>
                {/* Reemplazamos el rgba por un color hexadecimal sólido (#0f172a) para máxima compatibilidad con Outlook/Gmail */}
                <div style={{ backgroundColor: '#0f172a', padding: '15px', borderRadius: '8px', border: '1px solid #1e293b' }}>
                    <p style={{ margin: '6px 0', fontSize: '14px' }}><span style={{ color: '#64748b' }}>Responsable:</span> <strong style={{ color: '#ffffff' }}>{name}</strong></p>
                    <p style={{ margin: '6px 0', fontSize: '14px' }}><span style={{ color: '#64748b' }}>Compañía:</span> <strong style={{ color: '#ffffff' }}>{company}</strong></p>
                    <p style={{ margin: '6px 0', fontSize: '14px' }}><span style={{ color: '#64748b' }}>Email:</span> <a href={`mailto:${email}`} style={{ color: '#00E5FF', textDecoration: 'none' }}>{email}</a></p>
                    <p style={{ margin: '6px 0', fontSize: '14px' }}><span style={{ color: '#64748b' }}>WhatsApp:</span> <a href={`https://wa.me/${phone.replace(/[^0-9]/g, '')}`} style={{ color: '#ffffff', textDecoration: 'none' }}>{phone}</a></p>
                </div>
            </div>

            {/* Sección 02: Dimensionamiento y Escala */}
            <div style={{ marginTop: '30px' }}>
                <h2 style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '2px', margin: '0 0 10px 0' }}>
                    [02] DIMENSIONAMIENTO_Y_ESCALA
                </h2>
                <div style={{ backgroundColor: '#0f172a', padding: '15px', borderRadius: '8px', border: '1px solid #1e293b' }}>
                    <p style={{ margin: '6px 0', fontSize: '14px' }}>
                        <span style={{ color: '#64748b' }}>Desafío Táctico:</span> <br />
                        <strong style={{ color: challenge === "No especificado" ? '#64748b' : '#00E5FF' }}>{challenge}</strong>
                    </p>
                    <p style={{ margin: '6px 0', fontSize: '14px' }}>
                        <span style={{ color: '#64748b' }}>Escala de Operación:</span> <br />
                        <strong style={{ color: volume === "No especificado" ? '#64748b' : '#ffffff' }}>{volume}</strong>
                    </p>
                    <p style={{ margin: '6px 0', fontSize: '14px' }}>
                        <span style={{ color: '#64748b' }}>Recursos Mensuales:</span> <br />
                        <strong style={{ color: budget === "No especificado" ? '#64748b' : '#ffffff' }}>{budget}</strong>
                    </p>

                    {url && url.trim() !== "" && (
                        <div style={{ margin: '15px 0 0 0', borderTop: '1px solid #1e293b', paddingTop: '12px' }}>
                            <span style={{ color: '#64748b', fontSize: '14px' }}>URL del Sitio:</span> <br />
                            <a href={url.startsWith('http') ? url : `https://${url}`} target="_blank" rel="noopener noreferrer" style={{ color: '#00E5FF', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold' }}>
                                {url}
                            </a>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer de Sistema */}
            <footer style={{ marginTop: '50px', paddingTop: '20px', borderTop: '1px solid #1e293b', fontSize: '10px', color: '#475569', lineHeight: '1.6' }}>
                MARKETNAUTA_CORE // TRANSMISIÓN_ENCRIPTADA_B2B <br />
                STATUS: PROCESSED_BY_INBOUND_PIPELINE // SECURE_SSL_ESTABLISHED
            </footer>
        </div>
    );
}
