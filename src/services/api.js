import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  getMockProducts,
  saveMockProduct,
  getMockOrders,
  saveMockOrder,
  updateMockOrderStatus,
  getMockRequests,
  saveMockRequest,
  voteMockRequest,
  updateMockRequestStatus
} from './mockData';

export const BANCOLOMBIA_LLAVE = import.meta.env.VITE_BANCOLOMBIA_LLAVE || '@veltroncapital';

// Helper para generar referencia única antes del pago (ej: BC-849201)
export function generateShortRef() {
  const num = Math.floor(100000 + Math.random() * 900000);
  return `BC-${num}`;
}

// ------------------------------------------------------------------------------
// PRODUCTOS
// ------------------------------------------------------------------------------
export async function getActiveProducts() {
  if (!isSupabaseConfigured) {
    return getMockProducts().filter(p => p.activo);
  }

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('activo', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error obteniendo productos:', error);
    return getMockProducts().filter(p => p.activo);
  }

  return data;
}

export async function getProductById(id) {
  if (!isSupabaseConfigured) {
    return getMockProducts().find(p => p.id === id) || null;
  }

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error buscando producto:', error);
    return getMockProducts().find(p => p.id === id) || null;
  }

  return data;
}

export async function createProduct(productData, fileBlob, previewBlob) {
  if (!isSupabaseConfigured) {
    const newProd = {
      id: `prod-${Date.now()}`,
      ...productData,
      precio: 1000,
      archivo_path: `mock/${productData.tipo}/${fileBlob ? fileBlob.name : 'archivo.pdf'}`,
      imagen_preview: previewBlob ? URL.createObjectURL(previewBlob) : 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
      activo: true,
      created_at: new Date().toISOString()
    };
    return saveMockProduct(newProd);
  }

  let archivo_path = '';
  if (fileBlob) {
    const fileExt = fileBlob.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    const { data: storageData, error: storageErr } = await supabase
      .storage
      .from('digital-products')
      .upload(fileName, fileBlob);

    if (storageErr) throw storageErr;
    archivo_path = storageData.path;
  }

  let imagen_preview = '';
  if (previewBlob) {
    const fileExt = previewBlob.name.split('.').pop();
    const fileName = `preview_${Date.now()}.${fileExt}`;
    const { data: imgData, error: imgErr } = await supabase
      .storage
      .from('payment-receipts')
      .upload(fileName, previewBlob);

    if (!imgErr && imgData) {
      const { data: publicUrlData } = supabase
        .storage
        .from('payment-receipts')
        .getPublicUrl(imgData.path);
      imagen_preview = publicUrlData.publicUrl;
    }
  }

  const { data, error } = await supabase
    .from('products')
    .insert([
      {
        ...productData,
        precio: 1000,
        archivo_path,
        imagen_preview: imagen_preview || productData.imagen_preview || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
        activo: true
      }
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ------------------------------------------------------------------------------
// ÓRDEN DE COMPRA
// ------------------------------------------------------------------------------
export async function createOrder({ product_id, nombre_comprador, email_comprador, telefono_comprador, referencia_pago, capturaFile }) {
  let captura_url = '';

  if (isSupabaseConfigured && capturaFile) {
    const fileExt = capturaFile.name.split('.').pop();
    const fileName = `recibo_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    const { data: uploadData, error: uploadErr } = await supabase
      .storage
      .from('payment-receipts')
      .upload(fileName, capturaFile);

    if (!uploadErr && uploadData) {
      const { data: publicUrlData } = supabase
        .storage
        .from('payment-receipts')
        .getPublicUrl(uploadData.path);
      captura_url = publicUrlData.publicUrl;
    }
  } else if (capturaFile) {
    captura_url = URL.createObjectURL(capturaFile);
  }

  if (!isSupabaseConfigured) {
    const prod = await getProductById(product_id);
    const newOrder = {
      id: `ord-${Date.now()}`,
      product_id,
      product_titulo: prod ? prod.titulo : 'Producto Digital',
      nombre_comprador: nombre_comprador || 'Comprador',
      email_comprador,
      telefono_comprador,
      referencia_pago,
      captura_url: captura_url || 'https://images.unsplash.com/photo-1556742049-0a67f5729993?auto=format&fit=crop&w=600&q=80',
      estado: 'pendiente',
      created_at: new Date().toISOString()
    };
    return saveMockOrder(newOrder);
  }

  const { data, error } = await supabase
    .from('orders')
    .insert([
      {
        product_id,
        nombre_comprador,
        email_comprador,
        telefono_comprador,
        referencia_pago,
        captura_url,
        estado: 'pendiente'
      }
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function searchOrders(query) {
  const cleanQuery = query.trim().toLowerCase();
  if (!cleanQuery) return [];

  if (!isSupabaseConfigured) {
    const orders = getMockOrders();
    return orders.filter(
      o => o.referencia_pago.toLowerCase().includes(cleanQuery) ||
           o.email_comprador.toLowerCase().includes(cleanQuery) ||
           (o.nombre_comprador && o.nombre_comprador.toLowerCase().includes(cleanQuery))
    );
  }

  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      products (
        titulo,
        tipo
      ),
      download_links (
        token,
        expira_en,
        usado
      )
    `)
    .or(`referencia_pago.ilike.%${cleanQuery}%,email_comprador.ilike.%${cleanQuery}%,nombre_comprador.ilike.%${cleanQuery}%`)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error buscando ordenes:', error);
    return [];
  }

  return data;
}

// ------------------------------------------------------------------------------
// ADMIN & APROBACIÓN EN 1 CLIC
// ------------------------------------------------------------------------------
export async function getAdminOrders() {
  if (!isSupabaseConfigured) {
    return getMockOrders();
  }

  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      products (
        titulo,
        tipo
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error obteniendo órdenes admin:', error);
    return getMockOrders();
  }

  return data;
}

export async function updateOrderStatus(orderId, estado) {
  if (!isSupabaseConfigured) {
    return updateMockOrderStatus(orderId, estado);
  }

  if (estado === 'aprobado') {
    const { data: rpcData, error: rpcErr } = await supabase
      .rpc('approve_order', { p_order_id: orderId });

    if (rpcErr) {
      const { data: orderData, error: orderErr } = await supabase
        .from('orders')
        .update({ estado: 'aprobado', aprobado_at: new Date().toISOString() })
        .eq('id', orderId)
        .select()
        .single();

      if (orderErr) throw orderErr;

      const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
      const expira = new Date(Date.now() + 48 * 3600 * 1000).toISOString();
      await supabase
        .from('download_links')
        .insert([{ order_id: orderId, token, expira_en: expira, usado: false }]);

      return { orderId, nuevoEstado: 'aprobado', token };
    }

    return rpcData;
  } else {
    const { data, error } = await supabase
      .from('orders')
      .update({ estado })
      .eq('id', orderId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

// ------------------------------------------------------------------------------
// DESCARGA Y VALIDACIÓN DE TOKEN
// ------------------------------------------------------------------------------
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

// ------------------------------------------------------------------------------
// SOLICITUDES Y VOTACIÓN PÚBLICA
// ------------------------------------------------------------------------------
export async function getRequests() {
  if (!isSupabaseConfigured) {
    return getMockRequests();
  }

  const { data, error } = await supabase
    .from('requests')
    .select('*')
    .order('votos', { ascending: false });

  if (error) {
    console.error('Error obteniendo solicitudes:', error);
    return getMockRequests();
  }

  return data;
}

export async function createRequest({ texto, tipo }) {
  if (!isSupabaseConfigured) {
    const newReq = {
      id: `req-${Date.now()}`,
      texto,
      tipo,
      votos: 1,
      estado: 'abierta',
      created_at: new Date().toISOString().split('T')[0]
    };
    return saveMockRequest(newReq);
  }

  const { data, error } = await supabase
    .from('requests')
    .insert([{ texto, tipo, votos: 1, estado: 'abierta' }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function voteRequest(requestId, identificador = 'sesion-anonima') {
  if (!isSupabaseConfigured) {
    return voteMockRequest(requestId);
  }

  const { error: voteErr } = await supabase
    .from('request_votes')
    .insert([{ request_id: requestId, identificador }]);

  if (voteErr && voteErr.code === '23505') {
    console.warn('Ya has votado por esta solicitud.');
  }

  const { data: currentReq } = await supabase
    .from('requests')
    .select('votos')
    .eq('id', requestId)
    .single();

  const currentVotes = currentReq ? (currentReq.votos || 0) : 0;

  const { data, error } = await supabase
    .from('requests')
    .update({ votos: currentVotes + 1 })
    .eq('id', requestId)
    .select()
    .single();

  if (error) {
    return voteMockRequest(requestId);
  }

  return data;
}

export async function updateRequestStatus(requestId, nuevoEstado) {
  if (!isSupabaseConfigured) {
    return updateMockRequestStatus(requestId, nuevoEstado);
  }

  const { data, error } = await supabase
    .from('requests')
    .update({ estado: nuevoEstado })
    .eq('id', requestId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
