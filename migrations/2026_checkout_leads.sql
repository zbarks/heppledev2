-- =============================================================
--  Checkout leads
--
--  The cart now asks for an email before the visitor is sent to Stripe.
--  api/checkout saves it here (with the basket and ad tags) so people who
--  start checkout but do not pay can still be followed up. The Stripe
--  webhook flips a lead to 'paid' once the order completes.
--
--  NOT YET APPLIED. Safe to re-run: every statement is guarded.
--  Designed by Barker Digital
-- =============================================================

create table if not exists public.checkout_leads (
  id                bigint generated always as identity primary key,
  created_at        timestamptz   not null default now(),
  email             text          not null,
  marketing_optin   boolean       not null default false,
  stripe_session_id text          unique,
  cart_summary      text,
  cart_value        numeric(10,2),
  item_count        integer,
  promo_code        text,
  posthog_distinct_id text,
  utm_source        text,
  utm_medium        text,
  utm_campaign      text,
  utm_content       text,
  utm_term          text,
  status            text          not null default 'started' check (status in ('started','paid')),
  paid_at           timestamptz
);

comment on column public.checkout_leads.marketing_optin is
  'True only if the visitor ticked the (unticked by default) news and offers box.';

create index if not exists checkout_leads_email_idx   on public.checkout_leads (lower(email));
create index if not exists checkout_leads_status_idx  on public.checkout_leads (status, created_at desc);

-- Server only: the storefront and webhook use the service role key, which
-- bypasses RLS. No policies means the public anon key cannot read emails.
alter table public.checkout_leads enable row level security;
