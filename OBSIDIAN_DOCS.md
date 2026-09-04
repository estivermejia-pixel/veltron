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
- **Mecanismo de Pago:** Pagos directos cuenta a cuenta en Colombia vía **Llave Bancolombia Negocios** y sistema interoperable **Bre-B** a costo $0 COP de intermediación.
- **Esquema de Cobro:** **Monto Libre** (Aporte mínimo de $1.000 COP).
- **Mecanismo de Entrega:** Validación manual de comprobantes bancarios en 1 clic por el administrador, que genera un enlace temporal con token criptográfico válido por 48 horas de un solo uso.

---

## 🗺️ 2. Mapa Mental de Rutas y Flujo

```
                       ┌─────────────────────────┐
                       │   CatalogPage ( / )     │
                       │ - Genera Ref: BC-XXXXXX │
                       │ - Muestra QR + Llave    │
                       │ - Descarga QR .jpg      │
                       └───────────┬─────────────┘
                                   │
              ┌────────────────────┴────────────────────┐
              ▼                                         ▼
   [Modal Subir Comprobante]                [Página /comprar/:productId]
   (Nombre, Email, Recibo)                  (Flujo alternativo detallado)
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
[Panel Admin /admin]                                     [Usuario Consulta]
- Verifica comprobante en banco                          - Espera verificación
- Pulsa "Aprobar" (1 Clic)                                      │
- Dispara RPC approve_order                                     │
- Crea token en download_links (48h)                            │
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
- `[[src/pages/CatalogPage.jsx]]`: Punto de entrada con diseño Mobile-First. En móviles ubica la tarjeta de pago primero (`order-1`) y el código QR abajo (`order-2`). Cuenta con microinteracciones de Framer Motion y soporte `useReducedMotion`.
- `[[src/components/QRCodeSimulated.jsx]]`: Renderiza la imagen oficial `/qr_code_only.png`, botón con feedback visual para copiar la llave y botón de render en Canvas para descargar el archivo `QR_VeltronCapital.jpg`.
- `[[src/pages/StatusPage.jsx]]`: Permite el rastreo de órdenes por Nombre del Pagador, Correo o Referencia bancaria (`BC-XXXXXX`).
- `[[src/pages/DownloadPage.jsx]]`: Punto de descarga protegido. Si el token expiró o ya fue consumido, bloquea el acceso.
- `[[src/pages/RequestPage.jsx]]`: Votación y envío de solicitudes de nuevos libros o plantillas con ranking por votos.
- `[[src/pages/AdminPage.jsx]]`: Tabla de órdenes con previsualización del recibo bancario y botón de aprobación en 1 clic.
- `[[src/services/api.js]]`: Orquestador de base de datos con detección dinámica de Supabase y conmutación transparente a `localStorage`.

---

## ⚠️ 4. Cuadro de Diagnóstico y Estado Técnico

| Código / Módulo | Estado | Diagnóstico |
| :--- | :--- | :--- |
| **Flujo de Pago con Llave y QR** | `ACTUAL` | Operativo y probado en móvil y escritorio. |
| **Descargas Seguras por Token (48h)** | `ACTUAL` | Respaldado por procedimiento Postgres `approve_order` y URLs firmadas de Supabase Storage. |
| **Seguridad de la Ruta `/admin`** | `RIESGO` | No cuenta con middleware de protección de rutas en el frontend. La vista es accesible directamente en `/admin`. |
| **`paymentService.js` (Bancolombia OAuth Sandbox / Wompi)** | `PROVISIONAL` | Código desconectado de pasarela API directa. No afecta la operación actual de la tienda pero consume peso. |
| **Componentes `StakingPanel`, `PaymentPanel`, etc.** | `HUÉRFANO` | Restos de un prototipo de staking de criptoactivos no utilizados en el catálogo. |
| **Subcarpeta `src/cielodigital`** | `HUÉRFANO` | Proyecto astronómico ("Cielo Digital") no conectado al sistema. |
| **Notificación por Email al Aprobar** | `PENDIENTE` | La Edge Function `send-download-link` con Resend API requiere despliegue en la consola de Supabase. |

---

## 🔐 5. Políticas de Acceso y RLS en Postgres

```sql
-- Políticas implementadas en supabase/migrations/20260903_mvp_biblioteca.sql:
-- 1. Acceso público para lectura de productos activos:
CREATE POLICY "Público puede ver productos activos"
  ON public.products FOR SELECT USING (activo = true);

-- 2. Acceso público para registrar órdenes:
CREATE POLICY "Público puede crear ordenes"
  ON public.orders FOR INSERT WITH CHECK (true);

-- 3. Acceso público para consultar estado de órdenes:
CREATE POLICY "Público puede consultar orden por email o referencia"
  ON public.orders FOR SELECT USING (true);

-- 4. Modificación de órdenes restringida a administradores:
CREATE POLICY "Admins pueden actualizar ordenes"
  ON public.orders FOR UPDATE USING (public.is_admin());
```
