import { supabase } from '../config/supabase';

const LOCAL_STORAGE_KEY = 'veltron_contact_messages';

/**
 * Obtiene los mensajes locales guardados en localStorage (modo fallback)
 */
function getLocalMessages() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Error leyendo mensajes de localStorage:', err);
    return [];
  }
}

/**
 * Guarda mensajes en localStorage (modo fallback)
 */
function saveLocalMessages(messages) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(messages));
  } catch (err) {
    console.error('Error guardando mensajes en localStorage:', err);
  }
}

/**
 * Envía un nuevo mensaje de contacto (Supabase + Fallback Local)
 */
export async function createContactMessage({ nombre, email, mensaje }) {
  if (!nombre || !mensaje) {
    throw new Error('Nombre y mensaje son requeridos.');
  }

  const payload = {
    nombre: nombre.trim(),
    email: email ? email.trim() : null,
    mensaje: mensaje.trim(),
    leido: false,
    created_at: new Date().toISOString()
  };

  // 1. Intentar enviar a Supabase si está disponible
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .insert([payload])
        .select()
        .single();

      if (!error && data) {
        return data;
      }
      console.warn('Fallo guardado en Supabase, guardando en fallback local:', error);
    } catch (err) {
      console.warn('Error conectando a Supabase para mensajes:', err);
    }
  }

  // 2. Fallback LocalStorage si Supabase no está configurado
  const localList = getLocalMessages();
  const newItem = {
    id: `MSG-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    ...payload
  };
  const updatedList = [newItem, ...localList];
  saveLocalMessages(updatedList);
  return newItem;
}

/**
 * Obtiene todos los mensajes recibidos para el panel de administración
 */
export async function getContactMessages() {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data;
      }
      console.warn('Error obteniendo mensajes de Supabase, usando local:', error);
    } catch (err) {
      console.warn('Error consultando Supabase para mensajes:', err);
    }
  }

  return getLocalMessages();
}

/**
 * Marca un mensaje como leído
 */
export async function markMessageAsRead(messageId) {
  if (supabase) {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ leido: true })
        .eq('id', messageId);

      if (!error) {
        return true;
      }
    } catch (err) {
      console.warn('Error actualizando estado en Supabase:', err);
    }
  }

  // Fallback Local
  const list = getLocalMessages();
  const updated = list.map((msg) => (msg.id === messageId ? { ...msg, leido: true } : msg));
  saveLocalMessages(updated);
  return true;
}

/**
 * Elimina un mensaje
 */
export async function deleteContactMessage(messageId) {
  if (supabase) {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', messageId);

      if (!error) {
        return true;
      }
    } catch (err) {
      console.warn('Error eliminando mensaje en Supabase:', err);
    }
  }

  // Fallback Local
  const list = getLocalMessages();
  const updated = list.filter((msg) => msg.id !== messageId);
  saveLocalMessages(updated);
  return true;
}
