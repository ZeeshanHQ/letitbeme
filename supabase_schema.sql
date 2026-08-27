-- =================================================================
-- TRIPLE MOTIVE PHASE 1: COMPREHENSIVE PRODUCTION MIGRATION
-- Multi-Tenant Tenancy, Non-Recursive RLS, Canonical Graph & RPCs
-- =================================================================

-- 1. ORGANIZATIONS & TENANCY
CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    logo_url TEXT,
    website TEXT,
    industry TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. PUBLIC MEMBER PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    headline TEXT,                      -- e.g. "Managing Partner @ Horizon Capital"
    biography TEXT,                     -- Executive bio
    location TEXT,
    interests TEXT[] DEFAULT '{}',      -- Professional domains
    triple_motive_handle TEXT UNIQUE,   -- e.g. "alex" (@triplemotive.net)
    is_verified BOOLEAN DEFAULT false,
    status TEXT NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT valid_profile_status CHECK (status IN ('pending_screening', 'active', 'suspended'))
);

-- 3. PRIVATE MEMBER DATA (Strict Self-Access Only)
CREATE TABLE IF NOT EXISTS public.member_private_profiles (
    user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    notification_preferences JSONB DEFAULT '{"email": true, "in_app": true}'::jsonb,
    onboarding_completed BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. ORGANIZATION MEMBERSHIP & ROLES
CREATE TABLE IF NOT EXISTS public.organization_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'member',
    title TEXT,                          -- e.g. "Chief Executive Officer"
    status TEXT NOT NULL DEFAULT 'active',
    joined_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT valid_org_role CHECK (role IN ('owner', 'admin', 'member', 'advisor')),
    CONSTRAINT valid_org_member_status CHECK (status IN ('invited', 'active', 'former')),
    CONSTRAINT unique_user_org UNIQUE (organization_id, user_id)
);

-- 5. CANONICAL CONNECTION REQUESTS & CONNECTIONS
CREATE TABLE IF NOT EXISTS public.connection_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending',
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT no_self_request CHECK (sender_id <> receiver_id),
    CONSTRAINT valid_request_status CHECK (status IN ('pending', 'accepted', 'declined', 'canceled'))
);

-- Unordered Pair Unique Index for Pending State (Eliminates reverse A->B and B->A simultaneous requests)
CREATE UNIQUE INDEX IF NOT EXISTS unique_pending_connection_pair 
ON public.connection_requests (LEAST(sender_id, receiver_id), GREATEST(sender_id, receiver_id)) 
WHERE status = 'pending';

-- Canonical Connections Graph (user_a_id is ALWAYS strictly less than user_b_id)
CREATE TABLE IF NOT EXISTS public.connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_a_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    user_b_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    connected_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT canonical_pair_order CHECK (user_a_id < user_b_id),
    CONSTRAINT unique_connection_pair UNIQUE (user_a_id, user_b_id)
);

-- 6. MEETINGS & PARTICIPANTS LEDGER
CREATE TABLE IF NOT EXISTS public.meetings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    host_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    room_slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL DEFAULT 'Private Executive Call',
    status TEXT NOT NULL DEFAULT 'scheduled',
    scheduled_for TIMESTAMPTZ,
    started_at TIMESTAMPTZ,
    ended_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT valid_meeting_status CHECK (status IN ('scheduled', 'live', 'ended'))
);

CREATE TABLE IF NOT EXISTS public.meeting_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meeting_id UUID NOT NULL REFERENCES public.meetings(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'attendee',
    invite_status TEXT NOT NULL DEFAULT 'invited',
    joined_at TIMESTAMPTZ,
    left_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT valid_participant_role CHECK (role IN ('host', 'co_host', 'attendee')),
    CONSTRAINT valid_invite_status CHECK (invite_status IN ('invited', 'accepted', 'declined', 'joined')),
    CONSTRAINT unique_meeting_user UNIQUE (meeting_id, user_id)
);


-- =================================================================
-- NON-RECURSIVE SECURITY DEFINER LOOKUP HELPERS
-- =================================================================

CREATE OR REPLACE FUNCTION public.check_is_meeting_participant(_meeting_id UUID, _user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.meeting_participants
    WHERE meeting_id = _meeting_id AND user_id = _user_id
  );
$$;

CREATE OR REPLACE FUNCTION public.check_is_meeting_host(_meeting_id UUID, _user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.meetings
    WHERE id = _meeting_id AND host_id = _user_id
  );
$$;

CREATE OR REPLACE FUNCTION public.check_is_org_admin(_org_id UUID, _user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.organization_members
    WHERE organization_id = _org_id AND user_id = _user_id AND role IN ('owner', 'admin') AND status = 'active'
  );
$$;


-- =================================================================
-- SYSTEM PROFILE PROTECTION TRIGGER
-- =================================================================

CREATE OR REPLACE FUNCTION public.protect_system_profile_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.role() = 'authenticated' THEN
    NEW.is_verified := OLD.is_verified;
    NEW.status := OLD.status;
  END IF;
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_profile_fields ON public.profiles;
CREATE TRIGGER trg_protect_profile_fields
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.protect_system_profile_fields();


-- =================================================================
-- SECURE TRANSACTIONAL RPCS
-- =================================================================

-- 1. Atomic Organization Creator (Assigns Creator as Owner)
CREATE OR REPLACE FUNCTION public.create_organization(
    p_name TEXT,
    p_slug TEXT,
    p_logo_url TEXT DEFAULT NULL,
    p_website TEXT DEFAULT NULL,
    p_industry TEXT DEFAULT NULL,
    p_title TEXT DEFAULT 'Owner'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_id UUID;
    v_org_id UUID;
    v_clean_slug TEXT;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Authentication required.';
    END IF;

    IF trim(p_name) = '' THEN
        RAISE EXCEPTION 'Organization name cannot be blank.';
    END IF;

    v_clean_slug := lower(trim(p_slug));
    IF v_clean_slug = '' THEN
        RAISE EXCEPTION 'Organization slug cannot be blank.';
    END IF;

    INSERT INTO public.organizations (name, slug, logo_url, website, industry)
    VALUES (trim(p_name), v_clean_slug, p_logo_url, p_website, p_industry)
    RETURNING id INTO v_org_id;

    INSERT INTO public.organization_members (organization_id, user_id, role, title, status)
    VALUES (v_org_id, v_user_id, 'owner', trim(p_title), 'active');

    RETURN jsonb_build_object(
        'organization_id', v_org_id,
        'name', trim(p_name),
        'slug', v_clean_slug,
        'role', 'owner',
        'status', 'active'
    );
END;
$$;

-- 2. Send Connection Request
CREATE OR REPLACE FUNCTION public.send_connection_request(p_receiver_id UUID, p_note TEXT DEFAULT NULL)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_sender_id UUID;
    v_request_id UUID;
    v_low UUID;
    v_high UUID;
BEGIN
    v_sender_id := auth.uid();
    IF v_sender_id IS NULL THEN
        RAISE EXCEPTION 'Authentication required.';
    END IF;

    IF v_sender_id = p_receiver_id THEN
        RAISE EXCEPTION 'Cannot send connection request to yourself.';
    END IF;

    v_low := LEAST(v_sender_id, p_receiver_id);
    v_high := GREATEST(v_sender_id, p_receiver_id);
    IF EXISTS (SELECT 1 FROM public.connections WHERE user_a_id = v_low AND user_b_id = v_high) THEN
        RAISE EXCEPTION 'Already connected with this member.';
    END IF;

    INSERT INTO public.connection_requests (sender_id, receiver_id, status, note)
    VALUES (v_sender_id, p_receiver_id, 'pending', p_note)
    RETURNING id INTO v_request_id;

    RETURN jsonb_build_object('success', true, 'request_id', v_request_id, 'status', 'pending');
END;
$$;

-- 3. Accept Connection Request (Atomic Transaction)
CREATE OR REPLACE FUNCTION public.accept_connection_request(p_request_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_id UUID;
    req RECORD;
    u_low UUID;
    u_high UUID;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Authentication required.';
    END IF;

    SELECT * INTO req FROM public.connection_requests WHERE id = p_request_id FOR UPDATE;

    IF req.id IS NULL OR req.receiver_id <> v_user_id THEN
        RAISE EXCEPTION 'Connection request not found or unauthorized.';
    END IF;

    IF req.status <> 'pending' THEN
        RAISE EXCEPTION 'Connection request is no longer pending (current: %).', req.status;
    END IF;

    UPDATE public.connection_requests SET status = 'accepted', updated_at = now() WHERE id = p_request_id;

    u_low := LEAST(req.sender_id, req.receiver_id);
    u_high := GREATEST(req.sender_id, req.receiver_id);

    INSERT INTO public.connections (user_a_id, user_b_id, connected_at)
    VALUES (u_low, u_high, now())
    ON CONFLICT (user_a_id, user_b_id) DO NOTHING;

    RETURN jsonb_build_object('success', true, 'request_id', p_request_id, 'user_a_id', u_low, 'user_b_id', u_high);
END;
$$;

-- 4. Decline Connection Request
CREATE OR REPLACE FUNCTION public.decline_connection_request(p_request_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_id UUID;
    req RECORD;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Authentication required.';
    END IF;

    SELECT * INTO req FROM public.connection_requests WHERE id = p_request_id FOR UPDATE;

    IF req.id IS NULL OR req.receiver_id <> v_user_id THEN
        RAISE EXCEPTION 'Connection request not found or unauthorized.';
    END IF;

    IF req.status <> 'pending' THEN
        RAISE EXCEPTION 'Connection request is no longer pending.';
    END IF;

    UPDATE public.connection_requests SET status = 'declined', updated_at = now() WHERE id = p_request_id;

    RETURN jsonb_build_object('success', true, 'request_id', p_request_id, 'status', 'declined');
END;
$$;

-- 5. Cancel Connection Request (Sender Only)
CREATE OR REPLACE FUNCTION public.cancel_connection_request(p_request_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_id UUID;
    req RECORD;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Authentication required.';
    END IF;

    SELECT * INTO req FROM public.connection_requests WHERE id = p_request_id FOR UPDATE;

    IF req.id IS NULL OR req.sender_id <> v_user_id THEN
        RAISE EXCEPTION 'Connection request not found or unauthorized.';
    END IF;

    IF req.status <> 'pending' THEN
        RAISE EXCEPTION 'Connection request is no longer pending.';
    END IF;

    UPDATE public.connection_requests SET status = 'canceled', updated_at = now() WHERE id = p_request_id;

    RETURN jsonb_build_object('success', true, 'request_id', p_request_id, 'status', 'canceled');
END;
$$;

-- 6. Invite Meeting Participant (Host Only)
CREATE OR REPLACE FUNCTION public.invite_meeting_participant(
    p_meeting_id UUID,
    p_user_id UUID,
    p_role TEXT DEFAULT 'attendee'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_caller_id UUID;
BEGIN
    v_caller_id := auth.uid();
    IF v_caller_id IS NULL THEN
        RAISE EXCEPTION 'Authentication required.';
    END IF;

    IF NOT public.check_is_meeting_host(p_meeting_id, v_caller_id) THEN
        RAISE EXCEPTION 'Only meeting hosts can invite participants.';
    END IF;

    IF p_role NOT IN ('attendee', 'co_host') THEN
        RAISE EXCEPTION 'Invalid participant role.';
    END IF;

    INSERT INTO public.meeting_participants (meeting_id, user_id, role, invite_status)
    VALUES (p_meeting_id, p_user_id, p_role, 'invited')
    ON CONFLICT (meeting_id, user_id) 
    DO UPDATE SET invite_status = 'invited', role = p_role;

    RETURN jsonb_build_object('success', true, 'meeting_id', p_meeting_id, 'user_id', p_user_id, 'role', p_role);
END;
$$;

-- 7. Join Meeting (Host or Invited Participant)
CREATE OR REPLACE FUNCTION public.join_meeting(p_meeting_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_id UUID;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Authentication required.';
    END IF;

    UPDATE public.meeting_participants
    SET invite_status = 'joined', joined_at = now()
    WHERE meeting_id = p_meeting_id AND user_id = v_user_id;

    IF NOT FOUND THEN
        IF public.check_is_meeting_host(p_meeting_id, v_user_id) THEN
            INSERT INTO public.meeting_participants (meeting_id, user_id, role, invite_status, joined_at)
            VALUES (p_meeting_id, v_user_id, 'host', 'joined', now())
            ON CONFLICT (meeting_id, user_id) 
            DO UPDATE SET invite_status = 'joined', joined_at = now();
        ELSE
            RAISE EXCEPTION 'You must be invited by the host before joining this private meeting.';
        END IF;
    END IF;

    RETURN jsonb_build_object('success', true, 'meeting_id', p_meeting_id, 'status', 'joined');
END;
$$;


-- =================================================================
-- ROW-LEVEL SECURITY POLICIES
-- =================================================================

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_private_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connection_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_participants ENABLE ROW LEVEL SECURITY;

-- 1. ORGANIZATIONS
CREATE POLICY "Organizations viewable by authenticated users" 
    ON public.organizations FOR SELECT TO authenticated USING (true);

CREATE POLICY "Org admins can update organization" 
    ON public.organizations FOR UPDATE TO authenticated 
    USING (public.check_is_org_admin(id, auth.uid()));

-- 2. PUBLIC PROFILES
CREATE POLICY "Active public profiles viewable by authenticated users" 
    ON public.profiles FOR SELECT TO authenticated USING (status = 'active');

CREATE POLICY "Users can create their own profile" 
    ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own public profile" 
    ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- 3. PRIVATE PROFILES
CREATE POLICY "Users can view own private profile" 
    ON public.member_private_profiles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own private profile" 
    ON public.member_private_profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own private profile" 
    ON public.member_private_profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- 4. ORGANIZATION MEMBERS
CREATE POLICY "Organization members viewable by authenticated users" 
    ON public.organization_members FOR SELECT TO authenticated USING (true);

CREATE POLICY "Only org admins can invite organization members" 
    ON public.organization_members FOR INSERT TO authenticated 
    WITH CHECK (public.check_is_org_admin(organization_id, auth.uid()));

CREATE POLICY "Org admins can update member roles" 
    ON public.organization_members FOR UPDATE TO authenticated 
    USING (public.check_is_org_admin(organization_id, auth.uid()));

CREATE POLICY "Org admins or self can remove membership" 
    ON public.organization_members FOR DELETE TO authenticated 
    USING (auth.uid() = user_id OR public.check_is_org_admin(organization_id, auth.uid()));

-- 5. CONNECTION REQUESTS
CREATE POLICY "Users can view connection requests they sent or received" 
    ON public.connection_requests FOR SELECT TO authenticated 
    USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can create connection requests" 
    ON public.connection_requests FOR INSERT TO authenticated 
    WITH CHECK (auth.uid() = sender_id);

-- 6. CONNECTIONS
CREATE POLICY "Users can view connections they belong to" 
    ON public.connections FOR SELECT TO authenticated 
    USING (auth.uid() = user_a_id OR auth.uid() = user_b_id);

CREATE POLICY "Users can delete own connections" 
    ON public.connections FOR DELETE TO authenticated 
    USING (auth.uid() = user_a_id OR auth.uid() = user_b_id);

-- 7. MEETINGS (Non-Recursive)
CREATE POLICY "Users can view meetings they host or participate in" 
    ON public.meetings FOR SELECT TO authenticated 
    USING (auth.uid() = host_id OR public.check_is_meeting_participant(id, auth.uid()));

CREATE POLICY "Hosts can create meetings" 
    ON public.meetings FOR INSERT TO authenticated 
    WITH CHECK (auth.uid() = host_id);

CREATE POLICY "Hosts can update their meetings" 
    ON public.meetings FOR UPDATE TO authenticated 
    USING (auth.uid() = host_id);

CREATE POLICY "Hosts can delete their meetings" 
    ON public.meetings FOR DELETE TO authenticated 
    USING (auth.uid() = host_id);

-- 8. MEETING PARTICIPANTS (Non-Recursive)
CREATE POLICY "Users can view participant lists for their meetings" 
    ON public.meeting_participants FOR SELECT TO authenticated 
    USING (auth.uid() = user_id OR public.check_is_meeting_host(meeting_id, auth.uid()));

CREATE POLICY "Only meeting hosts can insert participants directly" 
    ON public.meeting_participants FOR INSERT TO authenticated 
    WITH CHECK (public.check_is_meeting_host(meeting_id, auth.uid()));

CREATE POLICY "Only meeting hosts can update participant records directly" 
    ON public.meeting_participants FOR UPDATE TO authenticated 
    USING (public.check_is_meeting_host(meeting_id, auth.uid()));


-- =================================================================
-- SECURITY DEFINER PERMISSION REVOCATIONS
-- =================================================================

REVOKE ALL ON FUNCTION public.protect_system_profile_fields() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.check_is_meeting_participant(UUID, UUID) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.check_is_meeting_host(UUID, UUID) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.check_is_org_admin(UUID, UUID) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.create_organization(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.send_connection_request(UUID, TEXT) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.accept_connection_request(UUID) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.decline_connection_request(UUID) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.cancel_connection_request(UUID) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.invite_meeting_participant(UUID, UUID, TEXT) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.join_meeting(UUID) FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.check_is_meeting_participant(UUID, UUID) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.check_is_meeting_host(UUID, UUID) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.check_is_org_admin(UUID, UUID) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.create_organization(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.send_connection_request(UUID, TEXT) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.accept_connection_request(UUID) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.decline_connection_request(UUID) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.cancel_connection_request(UUID) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.invite_meeting_participant(UUID, UUID, TEXT) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.join_meeting(UUID) TO authenticated, service_role;
