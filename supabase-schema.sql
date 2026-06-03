-- ============================================================
--  HEPPLE SPIRITS — Supabase schema
--  Run this in Supabase → SQL Editor before going live.
--  The Stripe webhook (api/stripe-webhook.js) writes paid
--  orders here; the Portal reads + updates fulfilment status.
-- ============================================================

create table if not exists public.orders (
  id                    bigint generated always as identity primary key,
  stripe_session_id     text not null unique,
  stripe_payment_intent text,
  customer_email        text,
  customer_name         text,
  currency              text    default 'gbp',
  subtotal              numeric(10,2),
  shipping              numeric(10,2),
  total                 numeric(10,2),
  item_count            integer default 0,
  items                 jsonb   default '[]'::jsonb,
  cart_summary          text,
  posthog_distinct_id   text,
  shipping_address      jsonb,
  payment_status        text,
  fulfilled             boolean default false,
  fulfilled_at          timestamptz,
  created_at            timestamptz default now()
);

-- Helpful indexes for the Portal's queries.
create index if not exists orders_created_at_idx on public.orders (created_at desc);
create index if not exists orders_fulfilled_idx  on public.orders (fulfilled);
create index if not exists orders_email_idx      on public.orders (customer_email);

-- ------------------------------------------------------------
--  Row Level Security
--  Both the webhook and the Portal API talk to Supabase with
--  the SERVICE ROLE key, which BYPASSES RLS. We still enable
--  RLS so that the public/anon key can never read order data.
-- ------------------------------------------------------------
alter table public.orders enable row level security;

-- (No anon policies on purpose — anon/public clients get nothing.)
-- The service-role key used server-side bypasses RLS automatically.
