import * as React from 'react';

interface ContactTemplateProps {
    name: string;
    email: string;
    phone: string;
    company: string;
    solution: string;
    volume: string;
    budget: string;
    url?: string;
}

export function ContactTemplate({
    name,
    email,
    phone,
    company,
    solution,
    volume,
    budget,
    url
}: ContactTemplateProps) {
    return (
        <div style={{ backgroundColor: '#030712', color: '#f8fafc', padding: '40px', fontFamily: 'monospace' }}>
            {/* Encabezado Técnico */}
            <h1 style={{ color: '#00E5FF', fontSize: '20px', borderBottom: '1px solid rgba(0,229,255,0.2)', paddingBottom: '10px' }}>
                &gt; SEÑAL_DE_CONTACTO_DECODIFICADA // {solution}
            </h1>

            {/* Sección 01: Identidad del Enlace */}
            <div style={{ marginTop: '30px' }}>
                <h2 style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '2px' }}>
                    [01] IDENTIDAD_DEL_ENLACE
                </h2>
                <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '4px', marginTop: '10px' }}>
                    <p style={{ margin: '5px 0' }}><strong>Responsable:</strong> {name}</p>
                    <p style={{ margin: '5px 0' }}><strong>Compañía:</strong> {company}</p>
                    <p style={{ margin: '5px 0' }}><strong>Email:</strong> {email}</p>
                    <p style={{ margin: '5px 0' }}><strong>WhatsApp:</strong> {phone}</p>
                </div>
            </div>

            {/* Sección 02: Dimensionamiento y Escala */}
            <div style={{ marginTop: '30px' }}>
                <h2 style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '2px' }}>
                    [02] DIMENSIONAMIENTO_Y_ESCALA
                </h2>
                <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '4px', marginTop: '10px' }}>
                    <p style={{ margin: '5px 0' }}><strong>Desafío:</strong> {solution}</p>
                    <p style={{ margin: '5px 0' }}><strong>Escala de Operación:</strong> {volume}</p>
                    <p style={{ margin: '5px 0' }}><strong>Asignación de Recursos:</strong> {budget}</p>
                    {url && (
                        <p style={{ margin: '15px 0 5px 0', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px' }}>
                            <strong>URL del Sitio:</strong> <a href={url} style={{ color: '#00E5FF', textDecoration: 'none' }}>{url}</a>
                        </p>
                    )}
                </div>
            </div>

            {/* Footer de Sistema */}
            <footer style={{ marginTop: '50px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: '10px', color: '#475569' }}>
                MARKETNAUTA_CORE // TRANSMISIÓN_ENCRIPTADA_B2B <br />
                STATUS: PROCESSED_BY_INBOUND_PIPELINE
            </footer>
        </div>
    );
}