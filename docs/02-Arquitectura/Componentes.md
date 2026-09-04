---
aliases: [Inventario de Componentes, UI Components]
tags: [componentes, ui, react]
date: 2026-09-04
---

# 🧩 Catálogo e Inventario de Componentes

## 1. Componentes de Layout (`src/layouts/`)
- **`AppLayout.jsx`**: Contenedor principal que envuelve todas las rutas. Gestiona el padding uniforme, la fuente Inter, la paleta base (`#FAFAFA` y `#2C2C2C`) y la selección visual `#FFD53D`.
- **`Header.jsx`**: Barra de navegación sticky con clase `.glass-nav`. Incluye animación deslizante de entrada con Framer Motion, soporte de preferencias de movimiento reducido y menú desplegable para dispositivos móviles.
- **`Footer.jsx`**: Pie de página institucional con copyright y sello de transacciones respaldadas por Bre-B.

## 2. Componentes Comunes (`src/common/`)
- **`BrandLogo.jsx`**: Isotipo SVG con la letra "V" en color carbón (`#2C2C2C`) y tres arcos colorimétricos en el pie (Amarillo `#FFD53D`, Naranja `#FF7A45`, Azul Marino `#1E3A8A`). Admite variantes de tamaño (`sm`, `md`, `lg`) y visualización condicional de texto.
- **`CopyButton.jsx`**: Botón compacto con llamada a `navigator.clipboard.writeText`, con transición visual a estado "¡Copiado!" con icono de Check por 2 segundos.
- **`StatusBadge.jsx`**: Píldora de estado con código de color e icono para `pendiente` (ámbar), `aprobado` (esmeralda) y `rechazado` (rosa/rojo).

## 3. Componentes por Dominio (*Features*)
- **`QRCodePaymentCard.jsx` (`src/features/catalog/components/`)**:
  - Muestra la imagen `/qr_code_only.png` optimizada.
  - Badge "LISTO PARA ESCANEAR".
  - Botón de 1-clic para copiar la Llave Bancolombia.
  - Botón interactivo con conversión a Canvas HTML5 para descargar el código QR en archivo `.jpg` de 300 DPI.
- **`CheckoutModal.jsx` (`src/features/checkout/components/`)**:
  - Modal accesible con desenfoque de fondo.
  - Recibe el número de referencia pre-generado (`BC-XXXXXX`).
  - Formulario con campos de Nombre del Pagador, Email, Teléfono opcional y carga de comprobante bancario.
