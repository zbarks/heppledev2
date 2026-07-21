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
  has_gift_card         boolean default false,
  gift_message          text,
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

-- ------------------------------------------------------------
--  If the orders table already exists from an earlier deploy, run this
--  once to add the gift columns the webhook now writes. Without them,
--  PostgREST rejects the whole insert and paid orders fail to record.
-- ------------------------------------------------------------
alter table public.orders add column if not exists has_gift_card boolean default false;
alter table public.orders add column if not exists gift_message  text;
alter table public.orders add column if not exists promo_code    text;

-- ============================================================
--  PROMO REDEMPTIONS
--  One row per paid order that used a promo code. Used to stop a
--  visitor reusing a one-shot code: the cart + checkout function
--  look here (keyed on the PostHog distinct id) before applying.
--  Email is stored too, for reporting / spotting abuse across
--  devices — but the live block is by PostHog id.
-- ============================================================
create table if not exists public.promo_redemptions (
  id                  bigint generated always as identity primary key,
  code                text not null,
  posthog_distinct_id text,
  customer_email      text,
  stripe_session_id   text not null,
  created_at          timestamptz default now(),
  unique (stripe_session_id, code)   -- webhook retries can't double-count
);

create index if not exists promo_redemptions_code_phid_idx
  on public.promo_redemptions (code, posthog_distinct_id);
create index if not exists promo_redemptions_code_email_idx
  on public.promo_redemptions (code, customer_email);

-- Same RLS posture as orders: server (service role) only, no anon access.
alter table public.promo_redemptions enable row level security;

-- ------------------------------------------------------------
--  Mobile number (added later). Run once if upgrading.
-- ------------------------------------------------------------
alter table public.orders add column if not exists customer_phone text;
