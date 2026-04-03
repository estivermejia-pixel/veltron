# ⚡ Veltron Capital

**Canal de conversión de cupo de tarjeta de crédito a efectivo.**  
Plataforma SaaS fintech construida en React 19 + Vite 8, orientada al mercado colombiano.

---

## 🧭 Descripción del Producto

Veltron Capital permite al usuario convertir el cupo disponible de su tarjeta de crédito en dinero líquido, enviado en menos de 5 minutos a Nequi, Daviplata o cuenta bancaria estándar.

**Modelo de operación:**
1. El usuario se registra y completa verificación KYC (cédula + selfie).
2. Veltron valida que el titular de la cédula coincida con el titular de la tarjeta y la cuenta destino.
3. El usuario elige el monto a retirar desde el dashboard.
4. El cobro se procesa como **pago de servicio único** a través del checkout seguro de Wompi.
5. El neto (monto − 12% de comisión) se transfiere a la cuenta destino.

> ⚠️ Veltron Capital **no** vincula ni almacena datos de tarjetas. Cada transacción es un pago único procesado íntegramente por la pasarela Wompi.

---

## 🛠 Stack Tecnológico

| Capa | Tecnología |
|------|------------|
| Framework UI | React 19 |
| Build tool | Vite 8 |
| Routing | React Router DOM 7 |
| Animaciones | Framer Motion 12 |
| Iconografía | Lucide React |
| Gráficas | Recharts 3 |
| Estilos | Vanilla CSS + design tokens |
| Pasarela de pago | Wompi (checkout externo) |

---

## 📁 Estructura del Proyecto

```
Vcapital/
├── index.html
├── vite.config.js
├── package.json
├── style.css               # Design tokens globales (CSS vars, utilidades)
├── public/
└── src/
    ├── App.jsx             # Router + layout sidebar + chat concierge
    ├── main.jsx
    ├── lib/
    │   └── icons.jsx       # Catálogo centralizado de iconos Lucide
    └── pages/
        ├── LandingPage.jsx         # Página pública de marketing
        ├── LoginPage.jsx           # Inicio de sesión
        ├── RegisterPage.jsx        # Registro de cuenta
        ├── KYCPage.jsx             # Verificación de identidad
        ├── DashboardPage.jsx       # Panel principal + simulador de retiro
        ├── WithdrawalPage.jsx      # Flujo de retiro (3 pasos)
        ├── TransactionsPage.jsx    # Historial de operaciones
        ├── TransactionDetailPage.jsx # Detalle y timeline de una operación
        ├── SettingsPage.jsx        # Perfil, seguridad, cuentas destino
        ├── HelpPage.jsx            # Centro de ayuda + FAQ
        ├── FAQPage.jsx             # FAQ independiente
        ├── TermsPage.jsx           # Términos de servicio
        └── PrivacyPage.jsx         # Política de privacidad
```

---

## 🗺 Rutas de la Aplicación

| Ruta | Página | Acceso |
|------|--------|--------|
| `/` | LandingPage | Público |
| `/login` | LoginPage | Público |
| `/register` | RegisterPage | Público |
| `/kyc` | KYCPage | Autenticado |
| `/dashboard` | DashboardPage | Autenticado |
| `/withdrawal` | WithdrawalPage | Autenticado |
| `/transactions` | TransactionsPage | Autenticado |
| `/transactions/:id` | TransactionDetailPage | Autenticado |
| `/settings` | SettingsPage | Autenticado |
| `/help` | HelpPage | Autenticado |
| `/faq` | FAQPage | Autenticado |
| `/terms` | TermsPage | Autenticado |
| `/privacy` | PrivacyPage | Autenticado |

---

## 🚀 Guía de Desarrollo

### Requisitos

- Node.js ≥ 18
- npm ≥ 9

### Instalación

```bash
npm install
```

### Servidor de desarrollo

```bash
npm run dev
```

La app estará disponible en `http://localhost:5173`

### Build de producción

```bash
npm run build
```

Los archivos se generan en `dist/`.

### Preview del build

```bash
npm run preview
```

---

## 🎨 Sistema de Diseño

Los design tokens están definidos en `style.css` como variables CSS:

```css
--primary          /* Azul Veltron principal */
--on-surface       /* Texto principal */
--surface-container-low  /* Fondos de cards */
--error            /* Rojo para valores negativos */
```

**Tipografía:** Manrope (headings) + Inter (body)  
**Paleta:** Azul corporativo `#006591` / `#0EA5E9` · Verde éxito `#006C49`  
**Componentes base:** `.metric-card`, `.card`, `.btn-primary`, `.btn-outline`, `.btn-ghost`, `.chip`, `.tabs`, `.input-field`

---

## 💳 Flujo de Retiro

```
Dashboard (simulador)
    │
    ▼
WithdrawalPage
    ├── Step 1: Selección de cuenta destino (Nequi / Daviplata / Bancolombia)
    ├── Step 2: Confirmación del monto + aceptación de cláusula legal
    └── Step 3: Procesando → checkout Wompi (externo)
    │
    ▼
TransactionDetailPage (timeline + comprobante)
```

**Comisión:** 12% fijo sobre el monto bruto solicitado.  
**Tiempo:** < 5 minutos en horario hábil.  
**Mínimo:** $100.000 COP · **Máximo:** $5.000.000 COP por operación.

---

## 🔐 Seguridad y Compliance

- **Sin almacenamiento de tarjetas:** los datos de tarjeta nunca tocan los servidores de Veltron.
- **Wompi** procesa el cobro íntegramente (PCI DSS).
- **KYC obligatorio:** cédula + selfie antes de cualquier operación.
- **Validación de titularidad:** cédula = titular tarjeta = titular cuenta destino.
- **2FA SMS** disponible en configuración de cuenta.
- **Encriptación AES-256** en tránsito y reposo.

---

## 📌 Modelo de Negocio Legal

Veltron Capital opera como **S.A.S. de Servicios Tecnológicos**, no como entidad financiera captadora de dinero. Cada operación es un **pago por servicio de gestión de liquidez**, lo que:

- Elimina regulación bancaria de captación.
- Reduce el riesgo de compliance al mínimo.
- Posiciona el producto como plataforma tecnológica de pagos.

---

## 📞 Contacto

- **Soporte:** soporte@veltron.capital  
- **Legal:** legal@veltron.capital  
- **WhatsApp:** +57 310 000 0000

---

© 2025 Veltron Capital · Bogotá, Colombia
