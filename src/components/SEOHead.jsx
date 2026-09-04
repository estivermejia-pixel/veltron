import React from 'react';
import { Helmet } from 'react-helmet-async';

const DEFAULT_TITLE = 'Veltron Capital | Productos Digitales';
const DEFAULT_DESC = 'Plataforma oficial de Veltron Capital. Accede a productos digitales verificados por Llave Bancolombia Negocios y pasarelas de pago seguras.';
const DOMAIN = 'https://veltroncapital.com';

export default function SEOHead({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESC,
  path = '/',
  image = `${DOMAIN}/1000500794.png`,
  type = 'website'
}) {
  const canonicalUrl = `${DOMAIN}${path}`;

  return (
    <Helmet>
      {/* Título Estándar y Meta Descripción */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={canonicalUrl} />

      {/* OpenGraph (Facebook, WhatsApp, LinkedIn) */}
      <meta property="og:site_name" content="Veltron Capital" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={image} />
      <meta property="og:type" content={type} />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
}
