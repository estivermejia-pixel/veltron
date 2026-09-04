-- ==============================================================================
-- MVP BIBLIOTECA DIGITAL - MIGRACIÓN INICIAL BASE DE DATOS
-- ==============================================================================

-- 1. TABLA: products (Catálogo de productos semanales)
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  tipo text check (tipo in ('libro', 'excel')) not null,
  titulo text not null,
  descripcion text,
  precio integer not null default 1000,
  archivo_path text not null,
  imagen_preview text,
  activo boolean default true,
  semana_inicio date not null,
  semana_fin date not null,
  created_at timestamptz default now()
);

-- 2. TABLA: orders (Órdenes de compra)
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade not null,
  nombre_comprador text not null, -- Nombre completo del pagador
  email_comprador text not null,
  telefono_comprador text,
  referencia_pago text not null, -- Referencia única generada antes del pago
  captura_url text, -- Imagen subida a Supabase Storage (payment-receipts)
  estado text check (estado in ('pendiente', 'aprobado', 'rechazado')) default 'pendiente',
  created_at timestamptz default now(),
  aprobado_at timestamptz
);

-- 3. TABLA: download_links (Enlaces y tokens de descarga)
create table if not exists public.download_links (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade not null,
  token text unique not null default encode(gen_random_bytes(24), 'hex'),
  expira_en timestamptz not null,
  usado boolean default false,
  created_at timestamptz default now()
);

-- 4. TABLA: requests (Solicitudes de productos de usuarios)
create table if not exists public.requests (
  id uuid primary key default gen_random_uuid(),
  texto text not null,
  tipo text check (tipo in ('libro', 'excel')),
  votos integer default 0,
  estado text check (estado in ('abierta', 'programada', 'publicada', 'cerrada')) default 'abierta',
  created_at timestamptz default now()
);

-- 5. TABLA: request_votes (Evita doble voto por identificador)
create table if not exists public.request_votes (
  id uuid primary key default gen_random_uuid(),
  request_id uuid references public.requests(id) on delete cascade not null,
  identificador text not null,
  created_at timestamptz default now(),
  unique (request_id, identificador)
);

-- 6. TABLA: admins (Usuarios administradores vinculados a Supabase Auth)
create table if not exists public.admins (
  id uuid primary key references auth.users(id) on delete cascade,
  nombre text,
  created_at timestamptz default now()
);

-- ==============================================================================
-- SEGURIDAD: ROW LEVEL SECURITY (RLS)
-- ==============================================================================

alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.download_links enable row level security;
alter table public.requests enable row level security;
alter table public.request_votes enable row level security;
alter table public.admins enable row level security;

create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.admins
    where id = auth.uid()
  );
end;
$$ language plpgsql security definer;

-- Políticas RLS
create policy "Público puede ver productos activos"
  on public.products for select using (activo = true);

create policy "Admins tienen acceso total a productos"
  on public.products for all using (public.is_admin());

create policy "Público puede crear ordenes"
  on public.orders for insert with check (true);

create policy "Público puede consultar orden por email o referencia"
  on public.orders for select using (true);

create policy "Admins pueden actualizar ordenes"
  on public.orders for update using (public.is_admin());

create policy "Público puede consultar token de descarga"
  on public.download_links for select using (true);

create policy "Público puede marcar token como usado"
  on public.download_links for update using (true) with check (usado = true);

create policy "Admins tienen acceso total a enlaces"
  on public.download_links for all using (public.is_admin());

create policy "Público puede ver solicitudes"
  on public.requests for select using (true);

create policy "Público puede crear solicitudes"
  on public.requests for insert with check (true);

create policy "Público puede votar una vez por identificador"
  on public.request_votes for insert with check (true);

create policy "Admins pueden gestionar solicitudes"
  on public.requests for all using (public.is_admin());

create policy "Admins se consultan a sí mismos"
  on public.admins for select using (auth.uid() = id);

-- ==============================================================================
-- FUNCIÓN: Aprobar Orden y Generar Enlace de Descarga (48h)
-- ==============================================================================
create or replace function public.approve_order(p_order_id uuid)
returns json as $$
declare
  v_link_id uuid;
  v_token text;
  v_expira timestamptz;
  v_order record;
begin
  if not public.is_admin() then
    raise exception 'Acceso denegado: solo administradores pueden aprobar órdenes.';
  end if;

  update public.orders
  set estado = 'aprobado',
      aprobado_at = now()
  where id = p_order_id
  returning * into v_order;

  if v_order.id is null then
    raise exception 'Orden no encontrada.';
  end if;

  v_expira := now() + interval '48 hours';
  v_token := encode(gen_random_bytes(24), 'hex');

  insert into public.download_links (order_id, token, expira_en, usado)
  values (p_order_id, v_token, v_expira, false)
  returning id, token into v_link_id, v_token;

  return json_build_object(
    'order_id', p_order_id,
    'estado', 'aprobado',
    'token', v_token,
    'expira_en', v_expira
  );
end;
$$ language plpgsql security definer;
