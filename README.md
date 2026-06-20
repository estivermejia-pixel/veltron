# Proyecto Veltron - Landing Page Transaccional

Aplicación web Front-End en React diseñada para centralizar la adquisición del token "Veltron" (VTR). La plataforma actúa como un punto de venta directo y generador de registros temporales para los usuarios, integrando lógicas de pago Fiat y Cripto.

## 🚀 Tecnologías Core

* **Framework:** React 19 + Vite
* **Estilos:** Tailwind CSS v4 (utilizando patrón arquitectónico de *Glassmorphism*).
* **Animaciones:** Framer Motion (Transiciones fluidas entre vistas/islas).
* **Iconografía:** Lucide React.

## 🏗️ Arquitectura de Interfaz ("Islas")

La plataforma divide su flujo operativo en tres componentes modulares aislados visualmente como "tarjetas de cristal" sobre el fondo interactivo:

1. **`CalculatorIsland`**: Cotizador dinámico que calcula la equivalencia entre COP o USDT y VTR.
2. **`PaymentIsland`**: Gestor de pasarelas de pago. Implementa la simulación de transacción con Bancolombia (Wompi) consumiendo la estructura de la API `/onClickPayment` e implementa un flujo mockeado para pagos en Cripto (USDT).
3. **`SuccessIsland`**: Tarjeta de validación de éxito que genera y muestra el código alfanumérico temporal para el usuario.

## 💼 Reglas de Negocio Implementadas

* **Tasa de Conversión Fiat:** 1 VTR = 1,000 COP.
* **Mínimo Cripto:** 1 USDT requerido para proceder por red blockchain.
* **Generación de Código:** Creación de UUID alfanumérico tras validación `200 OK` (Approved) desde la pasarela de pago.

## ⚙️ Integración Bancolombia (Wompi)

La aplicación está preparada estructuralmente para consumir el **API Market de Bancolombia**, específicamente el flujo de *Button Payment Instruction*. El payload generado internamente obedece al formato requerido:

```json
{
  "data": {
    "payInformation": {
      "relationshipId": "Re2ca8...",
      "transferAmount": "10000",
      "commerceTransferButtonId": "w0mp1B0toN",
      "transferReference": "VELTRON_...",
      "transferDescription": "Compra de 10 VTR",
      "confirmationUrl": "...",
      "sourceIP": "..."
    }
  }
}
```
*(Nota: Actualmente operando en modo simulación de red)*.

## 🛠️ Instalación y Ejecución

Para desplegar la aplicación en un entorno de desarrollo local, siga estos pasos:

1. Asegúrese de tener **Node.js** instalado.
2. Navegue hasta el directorio del proyecto (`c:\Veltron`).
3. Instale las dependencias:
   ```bash
   npm install
   ```
4. Inicie el servidor de desarrollo Vite:
   ```bash
   npm run dev
   ```
5. Abra el enlace suministrado en su navegador (generalmente `http://localhost:5173`).
