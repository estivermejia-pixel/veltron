-- Migration: Crear tabla contact_messages para almacenar mensajes enviados desde el widget flotante
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  email TEXT,
  mensaje TEXT NOT NULL,
  leido BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Política: Cualquiera (usuarios anon y authenticated) puede enviar un mensaje
CREATE POLICY "Permitir insercion publica de mensajes de contacto"
  ON contact_messages FOR INSERT
  WITH CHECK (true);

-- Política: Cualquiera puede consultar los mensajes (requerido para panel admin)
CREATE POLICY "Permitir lectura de mensajes"
  ON contact_messages FOR SELECT
  USING (true);

-- Política: Permitir actualizar el estado de lectura (leido = true)
CREATE POLICY "Permitir actualizacion de mensajes"
  ON contact_messages FOR UPDATE
  USING (true);

-- Política: Permitir eliminar mensajes
CREATE POLICY "Permitir eliminacion de mensajes"
  ON contact_messages FOR DELETE
  USING (true);
