import { supabase, isSupabaseConfigured } from './supabase';

const LOCAL_ADMIN_KEY = 'veltron_admin_session';

/**
 * Inicia sesión con email y contraseña.
 * Verifica la pertenencia a la tabla 'admins'.
 */
export async function signIn(email, password) {
  const cleanEmail = email.trim().toLowerCase();

  // 1. Modo Supabase Real
  if (isSupabaseConfigured) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password
    });

    if (error) {
      throw new Error(error.message || 'Credenciales de acceso inválidas.');
    }

    // Validar si el usuario está registrado en la tabla de administradores
    const { data: adminData, error: adminErr } = await supabase
      .from('admins')
      .select('id, nombre')
      .eq('id', data.user.id)
      .single();

    if (adminErr || !adminData) {
      // Si no es administrador, forzamos cierre de sesión inmediato
      await supabase.auth.signOut();
      throw new Error('Acceso denegado: este usuario no tiene permisos de administrador.');
    }

    return data.session;
  }

  // 2. Modo Demostración / Fallback Local
  if ((cleanEmail === 'admin' || cleanEmail === 'admin@veltroncapital.com') && password === 'admin123') {
    const mockSession = {
      user: {
        id: 'admin-local-master',
        email: 'admin@veltroncapital.com',
        nombre: 'Administrador Veltron',
        role: 'admin'
      },
      access_token: 'mock-session-token-' + Date.now(),
      expires_at: Date.now() + 86400000
    };

    sessionStorage.setItem(LOCAL_ADMIN_KEY, JSON.stringify(mockSession));
    window.dispatchEvent(new Event('auth_state_change'));
    return mockSession;
  }

  throw new Error('Credenciales inválidas. Verifica tu usuario y contraseña.');
}

/**
 * Cierra la sesión activa del administrador.
 */
export async function signOut() {
  if (isSupabaseConfigured) {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Error al cerrar sesión en Supabase:', err);
    }
  }

  sessionStorage.removeItem(LOCAL_ADMIN_KEY);
  window.dispatchEvent(new Event('auth_state_change'));
  return true;
}

/**
 * Retorna la sesión de administrador activa si existe y es válida.
 */
export async function getSession() {
  // 1. Modo Supabase Real
  if (isSupabaseConfigured) {
    try {
      const { data } = await supabase.auth.getSession();
      if (!data?.session?.user) return null;

      // Verificar que el usuario continúe en la tabla de administradores
      const { data: adminData } = await supabase
        .from('admins')
        .select('id')
        .eq('id', data.session.user.id)
        .single();

      if (!adminData) {
        await supabase.auth.signOut();
        return null;
      }

      return data.session;
    } catch (err) {
      console.error('Error verificando sesión:', err);
      return null;
    }
  }

  // 2. Modo Demostración / Fallback Local
  try {
    const stored = sessionStorage.getItem(LOCAL_ADMIN_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    return null;
  }

  return null;
}

/**
 * Suscribe un callback a los cambios en el estado de autenticación.
 */
export function onAuthStateChange(callback) {
  if (isSupabaseConfigured) {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      callback(event, session);
    });
    return () => subscription.unsubscribe();
  }

  const handler = () => {
    getSession().then(session => callback('CUSTOM', session));
  };

  window.addEventListener('auth_state_change', handler);
  window.addEventListener('storage', handler);

  return () => {
    window.removeEventListener('auth_state_change', handler);
    window.removeEventListener('storage', handler);
  };
}
