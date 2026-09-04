# MVP Biblioteca Digital — Venta de Productos Digitales a $1.000 COP

Aplicación web full-stack en React + Supabase para la venta de libros digitales y plantillas profesionales de Excel a $1.000 COP con verficación manual de transferencias por Llave Bancolombia Negocios (comisión $0).

> **Copy Directo**: "Paga $1.000. Descarga en minutos."

---

## 🚀 Características Principales

- **Catálogo Semanal (`/`)**: Muestra 2 productos activos (1 Libro PDF + 1 Plantilla Excel) a precio fijo de $1.000 COP.
- **Formulario de Compra e Instrucciones (`/comprar/:productId`)**: Explicación paso a paso de pago por Llave Bancolombia Negocios con botón de 1-tap para copiar la llave. Carga de comprobante y generación de orden.
- **Rastreador de Órdenes (`/estado`)**: Consulta inmediata por número de comprobante o email.
- **Descarga Segura (`/descarga/:token`)**: Token único válido por 48 horas. Genera Signed URL privada desde Supabase Storage y marca el token como utilizado.
- **Solicitud de Contenidos (`/solicitar`)**: Permite a los usuarios solicitar nuevos libros o archivos Excel para futuras semanas.
- **Panel de Administración (`/admin`)**: Login con Supabase Auth. Tabla con comprobantes de pago y **botón directo para aprobar con 1 clic**. Carga de nuevos archivos al catálogo.

---

## 🛠️ Stack Tecnológico

- **Frontend**: React 19 + Vite 8 + Tailwind CSS v4 + React Router DOM v7 + Lucide Icons
- **Backend / DB**: Supabase Postgres + RLS (Row Level Security) + Auth + Storage
- **Serverless Notifications**: Supabase Edge Functions + Resend API

---

## ⚙️ Guía de Configuración Local y Despliegue

### 1. Variables de Entorno (`.env`)

Crea un archivo `.env` en la raíz del proyecto basándote en el siguiente esquema:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-de-supabase
VITE_BANCOLOMBIA_LLAVE=901234567-1
```

> **Nota**: Si no configuras las variables de Supabase inicialmente, la aplicación correrá en **modo demostración simulado** usando `localStorage` para que puedas probar todas las vistas y la aprobación en 1 clic de inmediato.

---

### 2. Migración de Base de Datos en Supabase

1. Accede a tu consola de Supabase -> **SQL Editor**.
2. Ejecuta el archivo de migración ubicado en:
   [`/supabase/migrations/20260903_mvp_biblioteca.sql`](./supabase/migrations/20260903_mvp_biblioteca.sql)

Este script:
- Crea las 5 tablas: `products`, `orders`, `download_links`, `requests`, `admins`.
- Habilita RLS en todas las tablas y aplica las políticas de acceso.
- Define la función de Postgres `approve_order(p_order_id)` para generación automática de tokens de 48h.

---

### 3. Configuración de Supabase Storage (Buckets)

Dirígete a **Storage** en tu proyecto de Supabase y crea los siguientes 2 buckets:

1. **`digital-products`** *(BUCKET PRIVADO)*:
   - Contendrá los archivos PDF y XLSX de los productos.
   - Acceso restringido únicamente mediante Signed URLs generadas para tokens válidos.
2. **`payment-receipts`** *(BUCKET PÚBLICO)*:
   - Contendrá las imágenes de los recibos de pago subidos por los compradores.

---

### 4. Supabase Edge Function para Envío de Correos (Opcional)

Para desplegar la función serverless que envía los correos de confirmación:

```bash
# Iniciar sesión en Supabase CLI
npx supabase login

# Enlazar proyecto
npx supabase link --project-ref tu-project-ref

# Configurar variable de Resend
npx supabase secrets set RESEND_API_KEY=tu_resend_api_key SITE_URL=https://tu-dominio.vercel.app

# Desplegar Edge Function
npx supabase functions deploy send-download-link
```

---

### 5. Ejecutar la Aplicación en Local

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
3. Configura las variables de entorno en el panel de Vercel (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_BANCOLOMBIA_LLAVE`).
4. Haz clic en **Deploy**. ¡Listo!
