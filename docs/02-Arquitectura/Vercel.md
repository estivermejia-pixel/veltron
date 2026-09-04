---
aliases: [Guía de Despliegue en Vercel, Vercel Production Guide]
tags: [vercel, despliegue, devops, produccion]
date: 2026-09-04
---

# 🚀 Despliegue en Vercel — Veltron Capital

## 1. Configuración de Producción en Vercel
- **Framework Preset:** Vite
- **Comando de Build:** `vite build` (definido en `package.json` como `npm run build`)
- **Directorio de Salida (Output Directory):** `dist`
- **Comando de Instalación:** `npm install`
- **Comando de Desarrollo:** `vite`
- **Node.js Runtime:** v20.x o superior

## 2. Variables de Entorno Requeridas en Vercel
Deben estar configuradas en el panel de Vercel (**Settings > Environment Variables**) para los entornos de **Production**, **Preview** y **Development**:

| Variable | Descripción | Ejemplo / Valor |
| :--- | :--- | :--- |
| `VITE_SUPABASE_URL` | URL de tu instancia Supabase | `https://xxxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Clave anónima pública de Supabase | `eyJhbGciOi...` |
| `VITE_BANCOLOMBIA_LLAVE` | Llave oficial para recibir pagos | `@veltroncapital` |

> [!NOTE]
> Si estas variables no están presentes o se configuran incorrectamente, la aplicación **no se romperá**: entrará automáticamente en modo demostración con almacenamiento local (`localStorage`), permitiendo verificar todas las pantallas sin fallos 500.

## 3. Rutas Públicas de la Aplicación
Estas rutas están definidas en el cliente mediante `react-router-dom`:
- `/`: Catálogo semanal y pago con QR.
- `/comprar/:productId`: Checkout guiado.
- `/estado`: Rastreador de compras por referencia `BC-XXXXXX` o nombre.
- `/descarga/:token`: Descarga segura mediante enlace efímero (48h).
- `/solicitar`: Muro público de solicitudes comunitarias.
- `/admin/login`: Página de inicio de sesión administrativo con diseño glassmorphism.
- `/admin`: Panel de verificación manual protegido por sesión (`AuthGuard`).

## 4. ⚠️ Puntos Críticos que NO Deben Modificarse sin Revisar
1. **Comando de Build:** Mantener `npm run build` apuntando a `vite build`.
2. **Ubicación de `index.html`:** Debe residir permanentemente en la raíz del proyecto.
3. **Nombres de Variables `VITE_*`:** Vite solo expone al cliente variables con el prefijo `VITE_`. No renombrar a `REACT_APP_` ni eliminar el prefijo.
4. **Almacenamiento en `public/`:** Las imágenes del QR `/qr_code_only.png` deben permanecer en la carpeta `public/` para servirse como recursos estáticos directos sin compilar.
