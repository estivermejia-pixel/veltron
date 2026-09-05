# Veltron Capital — Plataforma de Productos Digitales con Pago Libre

Aplicación web full-stack en **React 19 + Vite 8 + Tailwind CSS v4 + Supabase** para la distribución de libros digitales y plantillas profesionales de Excel con pago libre verificado mediante **Llave Bancolombia Negocios / Bre-B** (comisión $0 COP) y pasarela segura **Wompi Bancolombia**.

> **Copy Directo**: "Paga lo que gustes. Descarga en minutos."

---

## 🚀 Características Principales

- **Catálogo Semanal con Sistema de Efectos 3D Kage (`/`)**: Muestra los productos digitales activos integrados con la suite de movimiento visual `src/components/effects/` (Fondo 3D WebGL reactivo a mouse/scroll, inclinación 3D de tarjetas con reflejo de luz, paralaje por capas y revelados fluidos con desenfoque kinético).
- **Sistema de Carga Cinematográfico `FileLoadingOverlay`**: Overlay de carga con telemetría digital, barra de neón y escaneo (inspirado en UplinkLoader de ThreeUI) integrado a la subida de recibos, productos digitales y descargas.
- **Checkout Seguro (`/comprar/:productId`)**: Selección de método de pago entre Wompi Bancolombia (monto mínimo $3.000 COP) y Llave Bancolombia Negocios / Bre-B. Carga de comprobante y generación de orden.
- **Rastreador de Órdenes (`/estado`)**: Consulta inmediata del estado de verificación por número de referencia bancaria `BC-XXXXXX` o correo electrónico.
- **Descarga Segura (`/descarga/:token`)**: Enlace con token criptográfico único válido por 48 horas de un solo uso. Genera Signed URL privada desde Supabase Storage.
- **Solicitud de Contenidos (`/solicitar`)**: Muro comunitario para que los usuarios soliciten y voten por nuevos libros o plantillas Excel para próximas semanas.
- **Widget de Chat Flotante (`FloatingChatWidget`)**: Ícono flotante en la esquina inferior derecha con animación de levitación vertical suave (`y: [0, -6, 0]`), botón e ícono oficial de WhatsApp y Formulario de Mensaje directo (Nombre obligatorio, Correo opcional, Mensaje obligatorio).
- **Panel de Administración y Notificaciones (`/admin`)**: Login centrado con Isotipo oficial con arcos de color. Tabla de verificación en 1 clic, gestión de catálogo, solicitudes y nueva sección de **Mensajes Recibidos** con contador de notificaciones de mensajes no leídos.
- **Optimización SEO y Verificación Search Console**: Indexación completa con `robots.txt` optimizado, `sitemap.xml` enriquecido, etiquetas `<meta name="robots" content="index, follow" />` y verificación por archivo estático `google60de2ff9f86d5727.html` en `public/`.

---

## 🛠️ Stack Tecnológico

- **Frontend**: React 19 + Vite 8 + Tailwind CSS v4 + React Router DOM v7 + Framer Motion v12 + HTML5 Canvas WebGL Particles + Lucide React Icons
- **Backend / DB**: Supabase Postgres + RLS (Row Level Security) + Auth + Storage
- **Serverless Notifications**: Supabase Edge Functions + Resend API

---

## ⚙️ Guía de Configuración Local y Despliegue

### 1. Variables de Entorno (`.env`)

Crea un archivo `.env` en la raíz del proyecto basándote en el siguiente esquema:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-de-supabase
VITE_BANCOLOMBIA_LLAVE=@veltroncapital
VITE_WOMPI_PUBLIC_KEY=pub_test_xxxxxx
```

> **Nota**: Si no configuras las variables de Supabase inicialmente, la aplicación correrá en **modo demostración simulado** usando `localStorage` de forma transparente.

---

### 2. Migración de Base de Datos en Supabase

1. Accede a tu consola de Supabase -> **SQL Editor**.
2. Ejecuta los archivos de migración ubicados en:
   - [`/supabase/migrations/20260903_mvp_biblioteca.sql`](./supabase/migrations/20260903_mvp_biblioteca.sql)
   - [`/supabase/migrations/20260904_add_wompi_columns.sql`](./supabase/migrations/20260904_add_wompi_columns.sql)
   - [`/supabase/migrations/20260904_add_contact_messages.sql`](./supabase/migrations/20260904_add_contact_messages.sql)

Este esquema crea las tablas `products`, `orders`, `download_links`, `requests`, `admins` y `contact_messages`, habilitando RLS y la función de aprobación `approve_order`.

---

### 3. Configuración de Supabase Storage (Buckets)

Dirígete a **Storage** en tu proyecto de Supabase y crea los siguientes 2 buckets:

1. **`digital-products`** *(BUCKET PRIVADO)*: Contendrá los archivos PDF y XLSX de los productos. Acceso restringido por Signed URLs.
2. **`payment-receipts`** *(BUCKET PÚBLICO)*: Contendrá las imágenes de los recibos de pago subidos por los compradores.

---

### 4. Ejecutar la Aplicación en Local

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo
npm run dev
```

Abre tu navegador en `http://localhost:5173/`.

---

## 🚀 Despliegue en Vercel

1. Sube este repositorio a GitHub.
2. Importa el proyecto en [Vercel](https://vercel.com).
3. Configura las variables de entorno en el panel de Vercel.
4. Haz clic en **Deploy**.
