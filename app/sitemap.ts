import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.marketnauta.com';
  return [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/soluciones/auditoria-de-datos`, lastModified: new Date() },
    { url: `${baseUrl}/soluciones/gestion-de-pauta`, lastModified: new Date() },
    { url: `${baseUrl}/soluciones/desarrollo-y-estrategia`, lastModified: new Date() },
  ];
}
