---
aliases: [Flujo de Datos, Data Flow]
tags: [datos, api, servicios, flujo]
date: 2026-09-04
---

# 🔄 Flujo de Datos y Conexión de Servicios

## 1. Diagrama de Flujo de Información

```mermaid
graph TD
    A[Usuario interactúa en UI] --> B[Hook / Estado Local en Componente]
    B --> C[Llamada a src/services/api.js]
    C --> D{¿Supabase Configurado?}
    D -- Sí --> E[Supabase Client Postgres / Storage]
    D -- No --> F[src/services/mockData.js LocalStorage]
    E --> G[Retorno de Datos JSON Normalizado]
    F --> G
    G --> H[Renderizado reactivo en la UI]
```

## 2. Servicios Modulares Especializados
1. **`productsService.js`:**
   - `getActiveProducts()`: Trae únicamente los productos marcados con `activo = true`.
   - `getProductById(id)`: Consulta detallada por UUID.
   - `createProduct(data, fileBlob, previewBlob)`: Sube el archivo maestro a la carpeta privada `digital-products` y la previsualización a `payment-receipts`.
2. **`ordersService.js`:**
   - `generateShortRef()`: Genera la referencia `BC-XXXXXX` en el cliente antes de la transferencia.
   - `createOrder(orderData)`: Registra la orden en estado `pendiente`.
   - `searchOrders(query)`: Búsqueda flexible por referencia, correo o nombre del pagador.
   - `updateOrderStatus(id, estado)`: Si el estado es `aprobado`, dispara la función SQL RPC `approve_order`.
3. **`downloadsService.js`:**
   - `validateAndGetDownload(token)`: Verifica validez temporal (<48 horas), existencia y estado de uso.
   - `markTokenAsUsed(token)`: Inhabilita el token para prevenir reutilización.
4. **`requestsService.js`:**
   - `getRequests()`: Obtiene solicitudes ordenadas por votos descendentes.
   - `voteRequest(id, userIdentifier)`: Registra el voto evitando duplicidad en `request_votes`.
