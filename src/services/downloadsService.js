import { supabase, isSupabaseConfigured } from '../config/supabase';
import { getMockOrders } from './mockData';

export async function validateAndGetDownload(token) {
  if (!isSupabaseConfigured) {
    const orders = getMockOrders();
    const matchingOrder = orders.find(o => o.token_descarga === token || token === 'demo-token-123456789');

    if (!matchingOrder && token !== 'demo-token-123456789') {
      return { valido: false, mensaje: 'Token de descarga no encontrado o inválido.' };
    }

    return {
      valido: true,
      usado: false,
      expirado: false,
      order: matchingOrder || orders[1],
      downloadUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      filename: 'Producto_Digital_1000COP.pdf'
    };
  }

  const { data: linkData, error: linkErr } = await supabase
    .from('download_links')
    .select(`
      *,
      orders (
        id,
        nombre_comprador,
        email_comprador,
        referencia_pago,
        products (
          titulo,
          tipo,
          archivo_path
        )
      )
    `)
    .eq('token', token)
    .single();

  if (linkErr || !linkData) {
    return { valido: false, mensaje: 'Token de descarga no encontrado o inválido.' };
  }

  const ahora = new Date();
  const expira = new Date(linkData.expira_en);

  if (ahora > expira) {
    return { valido: false, expirado: true, mensaje: 'El enlace de descarga expiró (válido por 48 horas).' };
  }

  if (linkData.usado) {
    return { valido: false, usado: true, mensaje: 'Este enlace de descarga ya ha sido utilizado previamente.' };
  }

  const archivoPath = linkData.orders?.products?.archivo_path;
  let downloadUrl = '';

  if (archivoPath) {
    const { data: signedData, error: signedErr } = await supabase
      .storage
      .from('digital-products')
      .createSignedUrl(archivoPath, 300);

    if (!signedErr && signedData) {
      downloadUrl = signedData.signedUrl;
    }
  }

  return {
    valido: true,
    linkId: linkData.id,
    order: linkData.orders,
    downloadUrl: downloadUrl || '#',
    filename: linkData.orders?.products?.titulo || 'producto_digital'
  };
}

export async function markTokenAsUsed(token) {
  if (!isSupabaseConfigured) return true;

  const { error } = await supabase
    .from('download_links')
    .update({ usado: true })
    .eq('token', token);

  return !error;
}
