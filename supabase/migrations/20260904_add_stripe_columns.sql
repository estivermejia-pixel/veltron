-- Migration to add Stripe payment fields and column enum to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS metodo_pago text DEFAULT 'bre-b';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS stripe_payment_intent_id text UNIQUE;

-- Index for fast lookup by stripe_payment_intent_id
CREATE INDEX IF NOT EXISTS idx_orders_stripe_payment_intent ON orders(stripe_payment_intent_id);
