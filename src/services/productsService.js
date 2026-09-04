import { supabase, isSupabaseConfigured } from '../config/supabase';
import { getMockProducts, saveMockProduct } from './mockData';

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
