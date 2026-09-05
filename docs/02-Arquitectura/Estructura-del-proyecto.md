---
aliases: [Estructura del Proyecto, Project Tree]
tags: [estructura, carpetas, organizacion]
date: 2026-09-04
---

# 📁 Estructura del Proyecto

## Árbol de Directorios Oficial

```
veltroncapital.com/
├── public/                     # Activos estáticos públicos (QR, favicon, sitemap, verificación)
│   ├── favicon.svg
│   ├── google60de2ff9f86d5727.html # Verificación HTML de Google Search Console
│   ├── qr_code_only.png
│   ├── qr_veltroncapital.png
│   ├── robots.txt
│   └── sitemap.xml             # Sitemap XML del sitio
│
├── src/
│   ├── common/                 # Componentes transversales reutilizables
│   │   ├── BrandLogo.jsx       # Isotipo y logotipo oficial con arcos de color
│   │   ├── CopyButton.jsx      # Botón de copiado con feedback
│   │   └── StatusBadge.jsx     # Insignia de estados de orden
│   │
│   ├── components/             # Componentes globales de UI y efectos visuales
│   │   ├── effects/            # Suite de efectos de movimiento 3D e interacciones (Estilo Kage / Uplink)
│   │   │   ├── AnimatedSection.jsx  # Revelado kinético al hacer scroll
│   │   │   ├── FileLoadingOverlay.jsx # Overlay de carga con telemetría e indicadores de actividad
│   │   │   ├── MouseInteraction.jsx # Inclinación tilt 3D y reflejo de luz (sheen glow)
│   │   │   ├── ScrollParallax.jsx   # Paralaje multi-capa por desplazamiento y profundidad
│   │   │   └── WebGLBackground.jsx  # Malla de partículas WebGL 3D ambiental en canvas
│   │   ├── FloatingChatWidget.jsx # Widget flotante con levitación y contacto (WhatsApp / Supabase)
│   │   └── SEOHead.jsx         # Encabezado dinámico de metadatos SEO
│   │
│   ├── context/                # Proveedores de contexto global
│   │   └── FileLoadingContext.jsx # Control global de loader cinematográfico para operaciones de archivos
│   │
│   ├── config/                 # Configuración del entorno y clientes externos
│   │   ├── env.js              # Variables de entorno y constantes de negocio
│   │   ├── auth.js             # Autenticación administrativa
│   │   └── supabase.js         # Instancia inicializada de Supabase JS
│   │
│   ├── features/               # Módulos organizados por dominio
│   │   ├── catalog/
│   │   │   └── components/
│   │   │       └── QRCodePaymentCard.jsx # Tarjeta QR + descarga JPG
│   │   └── checkout/
│   │       └── components/
│   │           ├── PaymentMethodSelector.jsx
│   │           └── WompiCheckoutWidget.jsx # Pasarela directa Wompi
│   │
│   ├── layouts/                # Envoltorios de navegación y diseño global
│   │   ├── AppLayout.jsx       # Layout general (Header + Main + Footer + FloatingChatWidget)
│   │   ├── Header.jsx          # Navegación interactiva con Framer Motion
│   │   └── Footer.jsx          # Pie de página institucional
│   │
│   ├── pages/                  # Vistas vinculadas al enrutador (React Router)
│   │   ├── CatalogPage.jsx     # Ruta: / (Fondo degradado animado continuo 12s)
│   │   ├── CheckoutPage.jsx    # Ruta: /comprar/:productId
      ├── StatusPage.jsx      # Ruta: /estado
│   │   ├── DownloadPage.jsx    # Ruta: /descarga/:token
│   │   ├── RequestPage.jsx     # Ruta: /solicitar
│   │   ├── LoginPage.jsx       # Ruta: /admin/login (Isotipo oficial centrado + sheen)
│   │   └── AdminPage.jsx       # Ruta: /admin (Órdenes, Productos, Solicitudes, Mensajes + Badges)
│   │
│   ├── services/               # Lógica de datos y consumo de APIs
│   │   ├── index.js            # Exportador unificado de servicios
│   │   ├── api.js              # Fachada de compatibilidad total
│   │   ├── productsService.js  # Catálogo semanal y subida de productos
│   │   ├── ordersService.js    # Creación, búsqueda y aprobación de órdenes
│   │   ├── downloadsService.js # Validación de tokens y generación de Signed URLs
│   │   ├── requestsService.js  # Solicitudes de la comunidad y votación
│   │   ├── contactMessagesService.js # Persistencia de mensajes en Supabase y localStorage
│   │   ├── paymentService.js   # Wompi y Bancolombia
│   │   └── mockData.js         # Motor de persistencia LocalStorage
│   │
│   ├── App.jsx                 # Router principal y asignación de rutas
│   ├── index.css               # Tailwind CSS v4, tema y accesibilidad
│   └── main.jsx                # Montaje de React DOM
│
├── supabase/                   # Definición de base de datos e infraestructura
│   ├── functions/              # Edge functions serverless (create-wompi-transaction, send-download-link)
│   └── migrations/             # Scripts SQL con RLS y RPC
│       ├── 20260903_mvp_biblioteca.sql
│       ├── 20260904_add_wompi_columns.sql
│       └── 20260904_add_contact_messages.sql # Tabla contact_messages
│
├── docs/                       # Vault de conocimiento para Obsidian
├── vercel.json                 # Configuración de despliegue y enrutamiento estático en Vercel
├── index.html                  # HTML base
├── package.json                # Dependencias y scripts de ejecución
└── vite.config.js              # Configuración de compilación con Vite
```
