// Datos de prueba para desarrollo local y demo en tiempo real

const initialProducts = [
  {
    id: 'prod-001-digital',
    tipo: 'digital',
    titulo: 'Producto Digital de la Semana',
    descripcion: 'Contenido digital exclusivo de la semana listo para descarga inmediata con aporte o monto libre.',
    precio: 1000,
    archivo_path: 'productos/producto_digital_semanal.pdf',
    imagen_preview: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    activo: true,
    semana_inicio: '2026-09-01',
    semana_fin: '2026-09-07'
  }
];

const initialOrders = [
  {
    id: 'ord-101',
    product_id: 'prod-001-digital',
    product_titulo: 'Producto Digital de la Semana',
    nombre_comprador: 'Carlos Andrés Mejia',
    email_comprador: 'cliente.ejemplo@gmail.com',
    telefono_comprador: '3001234567',
    referencia_pago: 'BC-849201',
    captura_url: 'https://images.unsplash.com/photo-1556742049-0a67f5729993?auto=format&fit=crop&w=600&q=80',
    estado: 'pendiente',
    created_at: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 'ord-102',
    product_id: 'prod-001-digital',
    product_titulo: 'Producto Digital de la Semana',
    nombre_comprador: 'María Camila Rodriguez',
    email_comprador: 'comprador.demo@gmail.com',
    telefono_comprador: '3109876543',
    referencia_pago: 'BC-554433',
    captura_url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=600&q=80',
    estado: 'aprobado',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    token_descarga: 'demo-token-123456789'
  }
];

const initialRequests = [
  {
    id: 'req-001',
    texto: 'Producto digital especializado para cotizaciones e impuestos en Colombia',
    tipo: 'excel',
    votos: 34,
    estado: 'abierta',
    created_at: '2026-09-02'
  },
  {
    id: 'req-002',
    texto: 'Recurso digital de finanzas personales e inversiones',
    tipo: 'libro',
    votos: 28,
    estado: 'abierta',
    created_at: '2026-09-01'
  }
];

const getStored = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
};

const setStored = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(e);
  }
};

export const getMockProducts = () => getStored('mvp_products', initialProducts);
export const saveMockProduct = (newProd) => {
  const prods = getMockProducts();
  const updated = [newProd, ...prods];
  setStored('mvp_products', updated);
  return newProd;
};

export const getMockOrders = () => getStored('mvp_orders', initialOrders);
export const saveMockOrder = (newOrder) => {
  const orders = getMockOrders();
  const updated = [newOrder, ...orders];
  setStored('mvp_orders', updated);
  return newOrder;
};

export const updateMockOrderStatus = (orderId, nuevoEstado) => {
  const orders = getMockOrders();
  let token = null;
  const updated = orders.map(ord => {
    if (ord.id === orderId) {
      token = token || `token-${Math.random().toString(36).substring(2)}-${Date.now()}`;
      return {
        ...ord,
        estado: nuevoEstado,
        aprobado_at: nuevoEstado === 'aprobado' ? new Date().toISOString() : null,
        token_descarga: nuevoEstado === 'aprobado' ? token : null
      };
    }
    return ord;
  });
  setStored('mvp_orders', updated);
  return { orderId, nuevoEstado, token };
};

export const getMockRequests = () => getStored('mvp_requests', initialRequests);
export const saveMockRequest = (newReq) => {
  const reqs = getMockRequests();
  const updated = [newReq, ...reqs];
  setStored('mvp_requests', updated);
  return newReq;
};

export const voteMockRequest = (requestId) => {
  const reqs = getMockRequests();
  const updated = reqs.map(r => {
    if (r.id === requestId) {
      return { ...r, votos: (r.votos || 0) + 1 };
    }
    return r;
  });
  setStored('mvp_requests', updated);
  return updated.find(r => r.id === requestId);
};

export const updateMockRequestStatus = (requestId, nuevoEstado) => {
  const reqs = getMockRequests();
  const updated = reqs.map(r => {
    if (r.id === requestId) {
      return { ...r, estado: nuevoEstado };
    }
    return r;
  });
  setStored('mvp_requests', updated);
  return updated.find(r => r.id === requestId);
};
