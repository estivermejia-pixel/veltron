---
aliases: [Veltron Capital Docs, Arquitectura Veltron, Documentacion Tecnica]
tags: [veltron, arquitectura, fintech, react, supabase, auditoria]
date_created: 2026-09-04
last_updated: 2026-09-04
status: auditado
---

# 📚 Veltron Capital — Vault de Documentación para Obsidian

## 🎯 1. Perfil del Proyecto y Propósito

- **Nombre Comercial:** Veltron Capital (`veltroncapital.com`).
- **Naturaleza del Sistema:** Plataforma web de comercio electrónico y distribución de activos digitales formativos y operativos (Libros PDF y Plantillas en formato XLSX).
- **Mecanismo de Pago:** Pagos directos cuenta a cuenta en Colombia vía **Llave Bancolombia Negocios / Bre-B** a costo $0 COP y pasarela **Wompi Bancolombia** (monto mínimo $3.000 COP).
- **Esquema de Cobro:** **Monto Libre / Aporte Voluntario**.
- **Mecanismo de Entrega:** Validación manual de comprobantes bancarios en 1 clic por el administrador o confirmación Wompi, que genera un enlace temporal con token criptográfico válido por 48 horas de un solo uso.
- **Canal de Contacto y Soporte:** Widget flotante con animación de levitación suave (`y: [0, -6, 0]`), botón e ícono oficial de WhatsApp y Formulario Directo guardado en tabla Supabase `contact_messages`.

---

## 🗺️ 2. Mapa Mental de Rutas y Flujo

```
                       ┌─────────────────────────┐
                       │   CatalogPage ( / )     │
                       │ - Fondo degradado 12s   │
                       │ - Muestra QR + Llave    │
                       │ - Widget Chat Levitando │
                       └───────────┬─────────────┘
                                   │
              ┌────────────────────┴────────────────────┐
              ▼                                         ▼
   [Modal Subir Comprobante]                [Página /comprar/:productId]
   (Nombre, Email, Recibo)                  (Checkout Wompi / Bre-B)
              │                                         │
              └────────────────────┬────────────────────┘
                                   │
                                   ▼
                       ┌─────────────────────────┐
                       │   StatusPage (/estado)  │
                       │  - Busca por Ref/Nombre │
                       │  - Estado: PENDIENTE    │
                       └───────────┬─────────────┘
                                   │
     ┌─────────────────────────────┴─────────────────────────────┐
     ▼                                                           ▼
[LoginPage /admin/login]                                 [Usuario Consulta]
- Isotipo oficial con arcos de color                      - Espera verificación
- Reflejo de luz (sheen) + Botón animado                         │
- Valida tabla 'admins' / demo                                   │
     │                                                           │
     ▼                                                           │
[Panel Admin /admin (AuthGuard)]                                 │
- Notificación de Mensajes No Leídos (Badge)                    │
- Pestaña 1: Aprobar pagos en 1 clic                             │
- Pestaña 2: Subir producto semanal                              │
- Pestaña 3: Gestionar solicitudes comunidad                     │
- Pestaña 4: Gestionar Mensajes de Contacto                      │
     │                                                           │
     └─────────────────────────────┬─────────────────────────────┘
                                   │
                                   ▼
                       ┌─────────────────────────┐
                       │ DownloadPage (/descarga)│
                       │ - Valida vigencia < 48h │
                       │ - Valida usado = false  │
                       │ - Genera Signed URL     │
                       │ - Marca usado = true    │
                       └─────────────────────────┘
```

---

## 🏗️ 3. Auditoría de Módulos y Código Existente

### Componentes y Servicios en Producción
- `[[src/pages/CatalogPage.jsx]]`: Punto de entrada con diseño Mobile-First e integración de la suite de movimiento visual Kage (Fondo 3D WebGL reactivo, paralaje y tilt 3D).
- `[[src/components/effects/FileLoadingOverlay.jsx]]`: Overlay cinematográfico de transferencia de archivos con telemetría digital HUD y barra de neón.
- `[[src/context/FileLoadingContext.jsx]]`: Contexto global para control programático de cargas de archivos en subida de recibos, productos y descargas.
- `[[src/components/effects/WebGLBackground.jsx]]`: Malla de partículas WebGL 3D ambiental en canvas HTML5 reactiva a cursor y paralaje de scroll con física lerp.
- `[[src/components/effects/MouseInteraction.jsx]]`: Envoltorio 3D con rotación en perspectiva (`rotateX`, `rotateY`, `perspective: 1000px`) y reflejo interactivo de luz (sheen dynamic glow).
- `[[src/components/effects/ScrollParallax.jsx]]`: Paralaje de scroll dinámico con desplazamiento Y, escalado y desenfoque kinético guiado por Framer Motion.
- `[[src/components/effects/AnimatedSection.jsx]]`: Revelado fluido al hacer scroll con transición de desenfoque a nitidez (`filter: blur`) y opacidad progresiva.
- `[[src/components/FloatingChatWidget.jsx]]`: Widget flotante en la esquina inferior derecha con efecto de levitación vertical continua suave (`y: [0, -6, 0]`), botón oficial de WhatsApp y Formulario de Mensaje directo guardado en Supabase.
- `[[src/features/catalog/components/QRCodePaymentCard.jsx]]`: Renderiza la imagen oficial `/qr_code_only.png`, botón con feedback visual para copiar la llave y descarga de recibo.
- `[[src/pages/CheckoutPage.jsx]]`: Checkout guiado con validación de monto mínimo ($3.000 COP para Wompi).
- `[[src/pages/StatusPage.jsx]]`: Permite el rastreo de órdenes por Nombre del Pagador, Correo o Referencia bancaria (`BC-XXXXXX`).
- `[[src/pages/DownloadPage.jsx]]`: Punto de descarga protegido por token criptográfico efímero de 48h.
- `[[src/pages/RequestPage.jsx]]`: Votación y envío de solicitudes de nuevos libros o plantillas con ranking por votos.
- `[[src/pages/LoginPage.jsx]]`: Acceso administrativo centrado con el Isotipo oficial, reflejo de luz *sheen* y botón en degradado animado continuo.
- `[[src/pages/AdminPage.jsx]]`: Panel administrativo completo con insignias de notificación en tiempo real de mensajes no leídos y 4 pestañas de gestión.
- `[[src/services/contactMessagesService.js]]`: Servicio de almacenamiento de mensajes de contacto con Supabase Postgres y fallback local en `localStorage`.
- `[[supabase/migrations/20260904_add_contact_messages.sql]]`: Migración SQL para la tabla `contact_messages` con RLS.

---

## 🛡️ 4. Cuadro de Diagnóstico y Estado Técnico

| Código / Módulo | Estado | Diagnóstico |
| :--- | :--- | :--- |
| **Flujo de Pago con Llave y QR** | `ACTUAL` | Operativo y probado en móvil y escritorio. |
| **Integración Pasarela Wompi** | `ACTUAL` | Firma de integridad SHA-256 generada por Edge Function `create-wompi-transaction` con mínimo $3.000 COP. |
| **Widget de Chat Levitando & Contacto** | `ACTUAL` | Botón circular con levitación suave (`y: [0, -6, 0]`), botón e ícono de WhatsApp oficial y Formulario enviado a Supabase. |
| **Notificaciones en Panel Admin** | `ACTUAL` | Badge animado en header y pestañas del panel `/admin` con contador de mensajes no leídos. |
| **Verificación Google Search Console** | `ACTUAL` | Archivo estático `public/google60de2ff9f86d5727.html` y `public/sitemap.xml` configurados en `vercel.json`. |
