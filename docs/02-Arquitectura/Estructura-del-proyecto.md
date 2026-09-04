---
aliases: [Estructura del Proyecto, Project Tree]
tags: [estructura, carpetas, organizacion]
date: 2026-09-04
---

# 📁 Estructura del Proyecto

## Árbol de Directorios Oficial

```
veltroncapital.com/
├── public/                     # Activos estáticos públicos (QR, favicon, iconos)
│   ├── favicon.svg
│   ├── qr_code_only.png
│   └── qr_veltroncapital.png
│
├── src/
│   ├── common/                 # Componentes transversales reutilizables
│   │   ├── BrandLogo.jsx       # Isotipo y logotipo oficial
│   │   ├── CopyButton.jsx      # Botón de copiado con feedback
│   │   └── StatusBadge.jsx     # Insignia de estados de orden
│   │
│   ├── config/                 # Configuración del entorno y clientes externos
│   │   ├── env.js              # Variables de entorno y constantes de negocio
│   │   └── supabase.js         # Instancia inicializada de Supabase JS
│   │
│   ├── features/               # Módulos organizados por dominio
│   │   ├── catalog/
│   │   │   └── components/
│   │   │       └── QRCodePaymentCard.jsx # Tarjeta QR + descarga JPG
│   │   └── checkout/
│   │       └── components/
│   │           └── CheckoutModal.jsx     # Formulario de subida de comprobante
│   │
│   ├── layouts/                # Envoltorios de navegación y diseño global
│   │   ├── AppLayout.jsx       # Layout general (Header + Main + Footer)
│   │   ├── Header.jsx          # Navegación interactiva con Framer Motion
│   │   └── Footer.jsx          # Pie de página institucional
│   │
│   ├── pages/                  # Vistas vinculadas al enrutador (React Router)
│   │   ├── CatalogPage.jsx     # Ruta: /
│   │   ├── CheckoutPage.jsx    # Ruta: /comprar/:productId
│   │   ├── StatusPage.jsx      # Ruta: /estado
│   │   ├── DownloadPage.jsx    # Ruta: /descarga/:token
│   │   ├── RequestPage.jsx     # Ruta: /solicitar
│   │   └── AdminPage.jsx       # Ruta: /admin
│   │
│   ├── services/               # Lógica de datos y consumo de APIs
│   │   ├── index.js            # Exportador unificado de servicios
│   │   ├── api.js              # Fachada de compatibilidad total
│   │   ├── productsService.js  # Catálogo semanal y subida de productos
│   │   ├── ordersService.js    # Creación, búsqueda y aprobación de órdenes
│   │   ├── downloadsService.js # Validación de tokens y generación de Signed URLs
│   │   ├── requestsService.js  # Solicitudes de la comunidad y votación
│   │   └── mockData.js         # Motor de persistencia LocalStorage
│   │
│   ├── components/             # Capa de retrocompatibilidad (re-exportadores)
│   ├── App.jsx                 # Router principal y asignación de rutas
│   ├── index.css               # Tailwind CSS v4, tema y accesibilidad
│   └── main.jsx                # Montaje de React DOM
│
├── supabase/                   # Definición de base de datos e infraestructura
│   ├── functions/              # Edge functions serverless (Resend)
│   └── migrations/             # Scripts SQL con RLS y RPC
│
├── docs/                       # Base de conocimiento para Obsidian
├── index.html                  # HTML base
├── package.json                # Dependencias y scripts de ejecución
└── vite.config.js              # Configuración de compilación con Vite
```
