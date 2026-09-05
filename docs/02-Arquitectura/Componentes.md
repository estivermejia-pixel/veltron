---
aliases: [Componentes del Sistema, UI Architecture]
tags: [componentes, ui, framer-motion, react19]
date: 2026-09-04
---

# 🧱 Arquitectura de Componentes — Veltron Capital

## Clasificación de Componentes

### 1. Componentes Transversales (`src/common/` y `src/components/`)
- `BrandLogo.jsx`: Isotipo vectorial con la letra *"V"* en negro y tres arcos de color de marca (Amarillo `#FFD53D`, Naranja `#F59E0B`, Azul `#1E3A8A`).
- `FloatingChatWidget.jsx`: Widget flotante en `fixed bottom-6 right-6 z-50` con animación de levitación vertical continua suave (`y: [0, -6, 0]`), botón oficial de WhatsApp y Formulario de Mensaje directo guardado en Supabase.
- `SEOHead.jsx`: Encabezado reactivo con `react-helmet-async` para gestión de metadatos OpenGraph, Twitter Cards y etiquetas canónicas.
- `CopyButton.jsx`: Botón interactivo de copiado al portapapeles con micro-animaciones de confirmación.

### 2. Suite de Efectos Visuales y Movimiento 3D (`src/components/effects/` y `src/context/`)
- `FileLoadingOverlay.jsx`: Overlay cinematográfico de transferencia de archivos con telemetría HUD (`UPLINK STATUS`, `PORT: 443_SSL`, `LATENCY`), escaneo vertical y barra de neón con gradiente de marca (inspirado en UplinkLoader).
- `FileLoadingContext.jsx`: Proveedor de contexto React para control programático de cargas (`startLoading`, `updateProgress`, `setSuccess`, `setError`, `hideLoading`).
- `WebGLBackground.jsx`: Fondo dinámico 3D ambiental con partículas en Canvas reactivo a seguimiento de cursor y paralaje de scroll con física lerp.
- `MouseInteraction.jsx`: Inclinación en perspectiva 3D (`rotateX`, `rotateY`) y reflejo interactivo de luz (*sheen glow*) sensible al puntero.
- `ScrollParallax.jsx`: Desplazamiento multi-capa por profundidad en el eje Y, zoom kinético y filtro de desenfoque por scroll.
- `AnimatedSection.jsx`: Envoltorio de revelado de secciones con desenfoque kinético (*blur-to-clear*) y desplazamiento de entrada al desplazarse por la pantalla.

### 3. Páginas de la Aplicación (`src/pages/`)
- `CatalogPage.jsx` (`/`): Landing Page principal con fondo en degradado ambiental animado continuo (12s) y esferas de destello radial.
- `CheckoutPage.jsx` (`/comprar/:productId`): Checkout con pasarela directa Wompi Bancolombia (monto mínimo $3.000 COP) o Llave Bancolombia.
- `StatusPage.jsx` (`/estado`): Buscador dinámico de estado de orden por referencia `BC-XXXXXX` o correo.
- `DownloadPage.jsx` (`/descarga/:token`): Entrega de archivos digitales mediante Signed URLs válidas por 48 horas de un solo uso.
- `RequestPage.jsx` (`/solicitar`): Muro comunitario con ranking de votos para solicitudes de nuevo contenido.
- `LoginPage.jsx` (`/admin/login`): Formulario de acceso administrativo centrado con el Isotipo oficial, reflejo de luz *sheen* y botón en degradado animado continuo.
- `AdminPage.jsx` (`/admin`): Módulo de gestión en 4 pestañas (Órdenes, Productos, Solicitudes y Mensajes Recibidos) con notificaciones de mensajes no leídos en tiempo real.

### 3. Capa de Servicios y Persistencia (`src/services/`)
- `contactMessagesService.js`: Gestor de persistencia para la tabla `contact_messages` en Supabase Postgres con fallback en `localStorage`.
- `api.js`: Fachada unificada que expone todos los sub-servicios del sistema.
