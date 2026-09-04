---
aliases: [Arquitectura del Sistema, Architecture Overview]
tags: [arquitectura, veltron, react19, clean-architecture]
date: 2026-09-04
---

# 🏛️ Arquitectura del Sistema — Veltron Capital

## Visión General
Veltron Capital implementa una arquitectura modular desacoplada basada en **Dominios Funcionales (*Feature-Driven*)** y el patrón **Fachada (*Facade Pattern*)** para la capa de servicios, optimizada específicamente para **React 19 + Vite 8**.

## Capas de Responsabilidad

```
┌─────────────────────────────────────────────────────────┐
│                     Capa de Presentación                │
│  - App.jsx & AppLayout (Layout Global, Nav, Footer)     │
│  - pages/ (Rutas vinculadas al Router)                  │
└───────────────────────────┬─────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────┐
│               Capa de Componentes y Dominio             │
│  - features/ (Componentes agrupados por caso de uso)    │
│  - common/ (UI atómica compartida: Logos, Badges)       │
└───────────────────────────┬─────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────┐
│                    Capa de Servicios                    │
│  - services/api.js (Fachada de compatibilidad unificada)│
│  - Subservicios: products, orders, downloads, requests │
└───────────────────────────┬─────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────┐
│                Capa de Datos y Configuración            │
│  - config/supabase.js (Cliente Supabase Postgres/Storage│
│  - config/env.js (Variables de entorno y constantes)    │
│  - services/mockData.js (Fallback LocalStorage demo)    │
└─────────────────────────────────────────────────────────┘
```

## Principios Rectores
1. **Single Source of Truth:** Las variables de entorno y constantes críticas residen exclusivamente en `src/config/env.js`.
2. **Zero-Downtime Guarantee:** La fachada `src/services/api.js` reexporta todas las funciones de los servicios modulares, evitando rupturas en importaciones existentes.
3. **Resiliencia Híbrida (Dual Engine):** Si no existen credenciales de Supabase en producción o desarrollo local, el sistema conmuta a `localStorage` de forma transparente.
