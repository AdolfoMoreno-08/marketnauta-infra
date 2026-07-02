import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.marketnauta.com';
  return [
    { url: baseUrl, lastModified: new Date(), priority: 1.0, changeFrequency: 'monthly' },
    { url: `${baseUrl}/soluciones/auditoria-de-datos`, lastModified: new Date(), priority: 0.9, changeFrequency: 'monthly' },
    { url: `${baseUrl}/soluciones/gestion-de-pauta`, lastModified: new Date(), priority: 0.9, changeFrequency: 'monthly' },
    { url: `${baseUrl}/soluciones/desarrollo-y-estrategia`, lastModified: new Date(), priority: 0.9, changeFrequency: 'monthly' },
    { url: `${baseUrl}/soluciones/activacion-y-retencion`, lastModified: new Date(), priority: 0.9, changeFrequency: 'monthly' },
    { url: `${baseUrl}/soluciones/inteligencia-predictiva`, lastModified: new Date(), priority: 0.9, changeFrequency: 'monthly' },
    { url: `${baseUrl}/soluciones/estudio-creativo-de-growth`, lastModified: new Date(), priority: 0.9, changeFrequency: 'monthly' },
    { url: `${baseUrl}/legal/privacidad`, lastModified: new Date(), priority: 0.3, changeFrequency: 'yearly' },
    { url: `${baseUrl}/legal/terminos`, lastModified: new Date(), priority: 0.3, changeFrequency: 'yearly' },
  ];
}
