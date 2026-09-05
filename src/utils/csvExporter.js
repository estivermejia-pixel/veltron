/**
 * Utilidad de Exportación a CSV para Veltron Capital
 * Genera un archivo CSV codificado con UTF-8 BOM (\uFEFF) para apertura perfecta en Excel.
 */

export function exportOrdersToCSV(orders = []) {
  if (!orders || orders.length === 0) {
    alert('No hay órdenes disponibles para exportar.');
    return;
  }

  const headers = [
    'Referencia',
    'Fecha y Hora',
    'Producto',
    'Nombre Comprador',
    'Email Comprador',
    'Teléfono',
    'Método de Pago',
    'Estado'
  ];

  const rows = orders.map((ord) => [
    `"${ord.referencia_pago || ''}"`,
    `"${ord.created_at ? new Date(ord.created_at).toLocaleString('es-CO') : ''}"`,
    `"${(ord.products?.titulo || ord.product_titulo || 'Producto Digital').replace(/"/g, '""')}"`,
    `"${(ord.nombre_comprador || 'Comprador').replace(/"/g, '""')}"`,
    `"${ord.email_comprador || ''}"`,
    `"${ord.telefono_comprador || ''}"`,
    `"${ord.metodo_pago || 'bre-b'}"`,
    `"${ord.estado || 'pendiente'}"`
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  const today = new Date().toISOString().split('T')[0];
  link.setAttribute('href', url);
  link.setAttribute('download', `Reporte_Ingresos_VeltronCapital_${today}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
