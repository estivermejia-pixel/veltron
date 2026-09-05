import { supabase, isSupabaseConfigured } from '../config/supabase';
import { getProductById } from './productsService';
import {
  getMockOrders,
  saveMockOrder,
  updateMockOrderStatus
} from './mockData';

// Helper para generar referencia única antes del pago (ej: BC-849201)
export function generateShortRef() {
  const num = Math.floor(100000 + Math.random() * 900000);
  return `BC-${num}`;
}

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

export async function getAuditLogs() {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase
    .from('payment_audit_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) {
    console.error('Error cargando audit logs:', error);
    return [];
  }
  return data || [];
}

export async function getPaymentAlerts() {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase
    .from('payment_alerts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) {
    console.error('Error cargando payment alerts:', error);
    return [];
  }
  return data || [];
}

export function calculateRevenueStats(orders = []) {
  const approved = orders.filter(o => o.estado === 'aprobado');
  
  let totalRevenue = 0;
  const methodMap = { wompi: 0, 'bre-b': 0 };
  const productMap = {};
  const dailyMap = {};

  approved.forEach((ord) => {
    // Estimación de monto (por defecto 1000 COP o precio del producto si está cargado)
    const amount = ord.products?.precio || 1000;
    totalRevenue += amount;

    // Método de Pago
    const method = ord.metodo_pago === 'wompi' ? 'wompi' : 'bre-b';
    methodMap[method] = (methodMap[method] || 0) + amount;

    // Productos
    const title = ord.products?.titulo || ord.product_titulo || 'Producto Digital';
    if (!productMap[title]) {
      productMap[title] = { titulo: title, ventas: 0, total: 0 };
    }
    productMap[title].ventas += 1;
    productMap[title].total += amount;

    // Tendencia Diaria (Fecha YYYY-MM-DD)
    const dateStr = ord.created_at ? new Date(ord.created_at).toISOString().split('T')[0] : 'Hoy';
    dailyMap[dateStr] = (dailyMap[dateStr] || 0) + amount;
  });

  const productRanking = Object.values(productMap).sort((a, b) => b.total - a.total);
  const dailyTrend = Object.entries(dailyMap)
    .map(([date, total]) => ({ date, total }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return {
    totalRevenue,
    totalApproved: approved.length,
    avgTicket: approved.length > 0 ? Math.round(totalRevenue / approved.length) : 0,
    methodMap,
    productRanking,
    dailyTrend
  };
}


