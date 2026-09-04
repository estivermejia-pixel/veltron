-- Migration to add Wompi payment fields to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS metodo_pago text DEFAULT 'bre-b';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS wompi_transaction_id text UNIQUE;

-- Index for fast lookup by wompi_transaction_id
CREATE INDEX IF NOT EXISTS idx_orders_wompi_transaction ON orders(wompi_transaction_id);
