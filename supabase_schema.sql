-- =================================================================
-- LETITBEME PRODUCTION DATABASE SCHEMA
-- Execute in your dedicated Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql
-- =================================================================

-- 1. Users / Presenter / Ambassador Profiles
CREATE TABLE IF NOT EXISTS public.letitbeme_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    role TEXT DEFAULT 'host', -- 'host' | 'ambassador' | 'viewer'
    custom_slug TEXT UNIQUE,
    brand_color TEXT DEFAULT '#635BFF',
    pricing_mode TEXT DEFAULT 'free', -- 'free' | 'donation' | 'performance_fee'
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Interactive Streams & Orchestration State
CREATE TABLE IF NOT EXISTS public.letitbeme_streams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    host_id UUID REFERENCES public.letitbeme_users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    cover_image TEXT,
    status TEXT DEFAULT 'draft', -- 'draft' | 'live' | 'ended'
    layout_mode TEXT DEFAULT 'split', -- 'split' | 'pip' | 'focus'
    active_widget TEXT DEFAULT 'lead_gen', -- 'lead_gen' | 'checkout' | 'poll' | 'sandbox'
    offer_price NUMERIC DEFAULT 199.00,
    donation_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Smart Referral & Ambassador Attribution Links
CREATE TABLE IF NOT EXISTS public.letitbeme_referral_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.letitbeme_users(id) ON DELETE CASCADE,
    stream_id UUID REFERENCES public.letitbeme_streams(id) ON DELETE CASCADE,
    code TEXT UNIQUE NOT NULL,
    utm_source TEXT DEFAULT 'direct',
    utm_campaign TEXT DEFAULT 'general',
    commission_rate NUMERIC DEFAULT 20.0,
    clicks INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    revenue NUMERIC DEFAULT 0.0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. In-Stream Tips & Voluntary Donations Ledger
CREATE TABLE IF NOT EXISTS public.letitbeme_donations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stream_id UUID REFERENCES public.letitbeme_streams(id) ON DELETE CASCADE,
    donor_name TEXT,
    donor_email TEXT,
    amount NUMERIC NOT NULL,
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.letitbeme_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.letitbeme_streams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.letitbeme_referral_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.letitbeme_donations ENABLE ROW LEVEL SECURITY;

-- Public Read & Insert Policies for Seamless In-Stream Interactions
CREATE POLICY "Public read for letitbeme_users" ON public.letitbeme_users FOR SELECT USING (true);
CREATE POLICY "Public insert for letitbeme_users" ON public.letitbeme_users FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update for letitbeme_users" ON public.letitbeme_users FOR UPDATE USING (true);

CREATE POLICY "Public read for letitbeme_streams" ON public.letitbeme_streams FOR SELECT USING (true);
CREATE POLICY "Public insert for letitbeme_streams" ON public.letitbeme_streams FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update for letitbeme_streams" ON public.letitbeme_streams FOR UPDATE USING (true);

CREATE POLICY "Public read for letitbeme_referral_links" ON public.letitbeme_referral_links FOR SELECT USING (true);
CREATE POLICY "Public insert for letitbeme_referral_links" ON public.letitbeme_referral_links FOR INSERT WITH CHECK (true);

CREATE POLICY "Public read for letitbeme_donations" ON public.letitbeme_donations FOR SELECT USING (true);
CREATE POLICY "Public insert for letitbeme_donations" ON public.letitbeme_donations FOR INSERT WITH CHECK (true);
