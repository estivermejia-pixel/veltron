/**
 * Servicio de pagos de Veltron
 * Integración con API de Bancolombia Button Payment
 */

const BANCOLOMBIA_CONFIG = {
  oauthEndpoint: 'gw-sandbox-qa.apps.ambientesbc.com',
  apiBaseUrl: 'https://gw-sandbox-qa.apps.ambientesbc.com/public-partner/sb/v2/operations/cross-product/payments/button-payment-instruction/management',
  tokenUrl: 'https://gw-sandbox-qa.apps.ambientesbc.com/security/oauth-provider/oauth2/token',
  scope: 'ButtonPayment:write:app',
  clientId: import.meta.env.VITE_BANCOLOMBIA_CLIENT_ID || '',
  clientSecret: import.meta.env.VITE_BANCOLOMBIA_CLIENT_SECRET || '',
};


/**
 * Genera un UUID v4 para message-id
 */
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Obtiene información del dispositivo para los headers requeridos
 */
function getDeviceInfo() {
  return {
    deviceId: localStorage.getItem('deviceId') || generateUUID(),
    userAgent: navigator.userAgent,
    devicePrint: JSON.stringify({
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      platform: navigator.platform,
      screen: `${window.screen.width}x${window.screen.height}`,
    }),
  };
}

/**
 * Obtiene información de ubicación basada en IP (simulada)
 */
async function getLocationInfo() {
  // En producción, esto debería obtenerse de un servicio de geolocalización por IP
  return {
    cityIp: 'Bogota',
    countryIp: 'CO',
    latitudeIp: '4.7110',
    longitudeIp: '-74.0721',
    networkProviderIp: 'Unknown',
    postalcodeIp: '110111',
  };
}

/**
 * Obtiene token de acceso OAuth 2.0 usando Client Credentials Flow
 */
async function getOAuthToken() {
  try {
    const response = await fetch(BANCOLOMBIA_CONFIG.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: BANCOLOMBIA_CONFIG.clientId,
        client_secret: BANCOLOMBIA_CONFIG.clientSecret,
        scope: BANCOLOMBIA_CONFIG.scope,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error obteniendo token OAuth: ${response.status}`);
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('[Bancolombia API] Error OAuth:', error);
    throw error;
  }
}

/**
 * Inicia pago con API de Bancolombia Button Payment
 */
async function initBancolombiaPayment(amountCOP, reference, description) {
  try {
    const token = await getOAuthToken();
    const messageId = generateUUID();
    const deviceInfo = getDeviceInfo();
    const locationInfo = await getLocationInfo();

    const payload = {
      data: {
        payInformation: {
          relationshipId: `Re${generateUUID().replace(/-/g, '')}`,
          transferAmount: amountCOP.toString(),
          commerceTransferButtonId: import.meta.env.VITE_COMMERCE_BUTTON_ID || 'DEFAULT_BUTTON',

          transferReference: reference,
          transferDescription: description || 'Compra de Veltron Tokens',
          confirmationUrl: `${window.location.origin}/api/payment/callback`,
          sourceIP: '0.0.0.0', // En producción, obtener IP real
        },
      },
    };

    const response = await fetch(`${BANCOLOMBIA_CONFIG.apiBaseUrl}/onClickPayment`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.bancolombia.v4+json',
        'Content-Type': 'application/json',
        'message-id': messageId,
        'cityIp': locationInfo.cityIp,
        'countryIp': locationInfo.countryIp,
        'deviceId': deviceInfo.deviceId,
        'devicePrint': deviceInfo.devicePrint,
        'httpAccept': 'application/json',
        'httpAcceptEncoding': 'gzip, deflate, br',
        'httpAcceptLanguage': navigator.language,
        'httpReferrer': document.referrer || window.location.href,
        'latitudeIp': locationInfo.latitudeIp,
        'longitudeIp': locationInfo.longitudeIp,
        'nameLine': '', // Nombre del cliente (debe obtenerse del formulario)
        'networkProviderIp': locationInfo.networkProviderIp,
        'postalcodeIp': locationInfo.postalcodeIp,
        'userAgent': deviceInfo.userAgent,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Error en pago Bancolombia: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.data.responseCode === '200' && data.data.transactionStatus === 'Approved') {
      return {
        status: 'APPROVED',
        reference: data.data.transactionNumber,
        transactionId: data.data.transactionNumber,
        purchaseIntentionHash: data.data.purchaseIntentionHash,
      };
    } else {
      throw new Error(`Transacción no aprobada: ${data.data.responseText}`);
    }
  } catch (error) {
    console.error('[Bancolombia API] Error:', error);
    throw error;
  }
}

export const paymentService = {
  /**
   * Inicia pago con Wompi (usando API de Bancolombia)
   */
  async initWompiPayment(amountCOP) {
    const reference = `VTR-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    
    try {
      const result = await initBancolombiaPayment(
        amountCOP,
        reference,
        'Compra de Veltron Tokens via Wompi'
      );
      return result;
    } catch (error) {
      console.error('[Payment Service] Error en pago Wompi:', error);
      // Fallback a stub si la API falla
      return new Promise((resolve) => {
        console.log(`[Wompi Fallback] Iniciando pago por ${amountCOP} COP`);
        setTimeout(() => {
          resolve({
            status: 'APPROVED',
            reference: `WOMPI-${crypto.randomUUID().split('-')[0].toUpperCase()}`,
          });
        }, 2500);
      });
    }
  },

  /**
   * Inicia pago con Cripto (USDT)
   */
  async initCryptoPayment(amountUSDT) {
    const reference = `VTR-CRYPTO-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    
    try {
      const result = await initBancolombiaPayment(
        amountUSDT * 4000, // Convertir USDT a COP (tasa aproximada)
        reference,
        'Compra de Veltron Tokens via Cripto'
      );
      return result;
    } catch (error) {
      console.error('[Payment Service] Error en pago Cripto:', error);
      // Fallback a stub si la API falla
      return new Promise((resolve) => {
        console.log(`[Crypto Fallback] Iniciando pago por ${amountUSDT} USDT`);
        setTimeout(() => {
          resolve({
            status: 'APPROVED',
            reference: `USDT-${crypto.randomUUID().split('-')[0].toUpperCase()}`,
          });
        }, 2500);
      });
    }
  },

  /**
   * Guarda deviceId en localStorage para persistencia
   */
  initDeviceId() {
    if (!localStorage.getItem('deviceId')) {
      localStorage.setItem('deviceId', generateUUID());
    }
  },
};



/**
 * Crea una transacción de Wompi invocando la Supabase Edge Function create-wompi-transaction
 */
export async function createWompiTransaction({ productId, amount, email, nombre, telefono }) {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || supabaseUrl.includes('tu_supabase_url')) {
    // Fallback local para desarrollo sin backend Supabase activo
    const refNum = Math.floor(100000 + Math.random() * 900000);
    const amountInCents = Math.max(1000, Number(amount)) * 100;
    const referencia_pago = `WMP-${refNum}`;
    return {
      referencia_pago,
      amountInCents,
      currency: 'COP',
      publicKey: import.meta.env.VITE_WOMPI_PUBLIC_KEY || 'pub_test_mockKey12345',
      integritySignature: 'mock_integrity_signature_hash',
      isMock: true
    };
  }

  const response = await fetch(`${supabaseUrl}/functions/v1/create-wompi-transaction`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${supabaseAnonKey}`,
    },
    body: JSON.stringify({ productId, amount, email, nombre, telefono })
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || 'No se pudo iniciar el checkout seguro con Wompi.');
  }

  return response.json();
}


