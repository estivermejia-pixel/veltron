/**
 * Configuración centralizada de variables de entorno y constantes de Veltron Capital
 */

export const BANCOLOMBIA_LLAVE = import.meta.env.VITE_BANCOLOMBIA_LLAVE || '@veltroncapital';

export const SUPABASE_CONFIG = {
  url: import.meta.env.VITE_SUPABASE_URL || '',
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
};

export const APP_CONFIG = {
  name: 'Veltron Capital',
  tagline: 'Productos Digitales',
  moneda: 'COP',
  precioMinimo: 1000,
  tokenVigenciaHoras: 48,
  signedUrlVigenciaSegundos: 300,
};
