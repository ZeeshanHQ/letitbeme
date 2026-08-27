import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Profile, PrivateProfile, Organization, OrganizationMember } from '../types';

interface AuthContextType {
  user: Profile | null;
  privateProfile: PrivateProfile | null;
  primaryOrg: Organization | null;
  orgMembership: OrganizationMember | null;
  isLoading: boolean;
  signInWithGoogle: () => Promise<{ error?: string }>;
  signInWithEmailOtp: (email: string) => Promise<{ success: boolean; error?: string; devCode?: string }>;
  sendEmailOtp: (email: string) => Promise<{ success: boolean; error?: string; devCode?: string }>;
  verifyEmailOtp: (email: string, code: string, fullName?: string, role?: string) => Promise<{ success: boolean; error?: string }>;
  signInWithDemoExecutive: (profileIndex?: number) => void;
  updateProfile: (updates: Partial<Profile>) => Promise<{ success: boolean; error?: string }>;
  updatePrivateProfile: (updates: Partial<PrivateProfile>) => Promise<{ success: boolean; error?: string }>;
  createNewOrganization: (name: string, slug: string, title?: string, industry?: string) => Promise<{ success: boolean; organization?: Organization; error?: string }>;
  upgradeToPro: () => Promise<void>;
  rotateMeetingSlug: () => Promise<string>;
  signOut: () => void;
}

const DEFAULT_DEMO_PROFILES: Profile[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    fullName: 'Alexander Vance',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    headline: 'Founder & CEO @ Horizon Quantum',
    biography: 'Building next-generation quantum infrastructure for enterprise intelligence. Former Partner at Benchmark.',
    location: 'San Francisco, CA',
    interests: ['Quantum Computing', 'Applied AI', 'Venture Capital', 'DeepTech'],
    tripleMotiveHandle: 'alex',
    isVerified: true,
    status: 'active',
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    fullName: 'Dr. Elena Rostova',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    headline: 'Chief AI Scientist & Co-Founder @ Synthetix Bio',
    biography: 'Accelerating therapeutic molecule discovery through transformer diffusion models. PhD in Biophysics from Stanford.',
    location: 'Boston, MA',
    interests: ['Computational Biology', 'Generative Chemistry', 'Longevity', 'BioTech'],
    tripleMotiveHandle: 'elena',
    isVerified: true,
    status: 'active',
  },
];

const DEFAULT_DEMO_ORG: Organization = {
  id: 'org-horizon-quantum-2026',
  name: 'Horizon Quantum Systems',
  slug: 'horizon-quantum',
  website: 'https://horizonquantum.io',
  industry: 'DeepTech & Quantum AI',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Profile | null>(() => {
    const saved = localStorage.getItem('triple_motive_active_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    // Default to executive demo profile for immediate out-of-the-box exploration
    return DEFAULT_DEMO_PROFILES[0];
  });

  const [privateProfile, setPrivateProfile] = useState<PrivateProfile | null>(() => {
    return {
      userId: user?.id || DEFAULT_DEMO_PROFILES[0].id,
      email: 'alex@horizonquantum.io',
      phone: '+1 (415) 890-4421',
      notificationPreferences: { email: true, inApp: true },
      onboardingCompleted: true,
    };
  });

  const [primaryOrg, setPrimaryOrg] = useState<Organization | null>(DEFAULT_DEMO_ORG);
  const [orgMembership, setOrgMembership] = useState<OrganizationMember | null>({
    id: 'mem-1',
    organizationId: DEFAULT_DEMO_ORG.id,
    userId: user?.id || DEFAULT_DEMO_PROFILES[0].id,
    role: 'owner',
    title: 'Founder & CEO',
    status: 'active',
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('triple_motive_active_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('triple_motive_active_user');
    }
  }, [user]);

  // Sync Supabase Auth Session
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        syncSupabaseProfile(session.user);
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        syncSupabaseProfile(session.user);
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const syncSupabaseProfile = async (sessionUser: any) => {
    try {
      const email = sessionUser.email || '';
      const fullName =
        sessionUser.user_metadata?.full_name ||
        sessionUser.user_metadata?.name ||
        email.split('@')[0];

      const avatar =
        sessionUser.user_metadata?.avatar_url ||
        sessionUser.user_metadata?.picture ||
        `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName)}`;

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', sessionUser.id)
        .single();

      if (profile) {
        setUser({
          id: profile.id,
          fullName: profile.full_name,
          avatarUrl: profile.avatar_url || avatar,
          headline: profile.headline || 'Executive Member',
          biography: profile.biography || '',
          location: profile.location || 'Global',
          interests: profile.interests || ['Technology', 'Leadership'],
          tripleMotiveHandle: profile.triple_motive_handle || email.split('@')[0],
          isVerified: Boolean(profile.is_verified),
          status: profile.status || 'active',
        });
      } else {
        // Create new profile record
        const newProfile: Profile = {
          id: sessionUser.id,
          fullName,
          avatarUrl: avatar,
          headline: 'Executive Member',
          biography: '',
          location: 'Global',
          interests: ['Venture', 'Technology', 'AI'],
          tripleMotiveHandle: email.split('@')[0].replace(/[^a-zA-Z0-9-_]/g, ''),
          isVerified: false,
          status: 'active',
        };

        await supabase.from('profiles').insert({
          id: newProfile.id,
          full_name: newProfile.fullName,
          avatar_url: newProfile.avatarUrl,
          headline: newProfile.headline,
          triple_motive_handle: newProfile.tripleMotiveHandle,
          interests: newProfile.interests,
          status: 'active',
        });

        await supabase.from('member_private_profiles').insert({
          user_id: newProfile.id,
          email: email.toLowerCase().trim(),
          onboarding_completed: true,
        });

        setUser(newProfile);
      }
    } catch (err) {
      console.warn('Profile sync note:', err);
    }
  };

  const signInWithGoogle = async () => {
    if (!isSupabaseConfigured) {
      signInWithDemoExecutive(0);
      return {};
    }
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
    return { error: error?.message };
  };

  const signInWithEmailOtp = async (email: string) => {
    if (!isSupabaseConfigured) {
      return { success: true, devCode: '777888' };
    }
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
    });
    return { success: !error, error: error?.message };
  };

  const verifyEmailOtp = async (email: string, code: string, fullName?: string) => {
    if (!isSupabaseConfigured) {
      setUser({
        id: `user-${Date.now()}`,
        fullName: fullName || email.split('@')[0],
        avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName || email)}`,
        headline: 'Executive Member',
        interests: ['Leadership', 'Technology'],
        tripleMotiveHandle: email.split('@')[0],
        isVerified: false,
        status: 'active',
      });
      return { success: true };
    }

    const { error, data } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token: code.trim(),
      type: 'email',
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (data.user) {
      syncSupabaseProfile(data.user);
    }
    return { success: true };
  };

  const signInWithDemoExecutive = (profileIndex = 0) => {
    const chosen = DEFAULT_DEMO_PROFILES[profileIndex % DEFAULT_DEMO_PROFILES.length];
    setUser(chosen);
    setPrivateProfile({
      userId: chosen.id,
      email: `${chosen.tripleMotiveHandle}@triplemotive.net`,
      phone: '+1 (555) 019-2834',
      notificationPreferences: { email: true, inApp: true },
      onboardingCompleted: true,
    });
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { success: false, error: 'Not authenticated' };

    const next = { ...user, ...updates };
    setUser(next);

    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: next.fullName,
          avatar_url: next.avatarUrl,
          headline: next.headline,
          biography: next.biography,
          location: next.location,
          interests: next.interests,
          triple_motive_handle: next.tripleMotiveHandle,
        })
        .eq('id', user.id);

      if (error) return { success: false, error: error.message };
    }

    return { success: true };
  };

  const updatePrivateProfile = async (updates: Partial<PrivateProfile>) => {
    if (!privateProfile) return { success: false, error: 'Not authenticated' };
    const next = { ...privateProfile, ...updates };
    setPrivateProfile(next);

    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('member_private_profiles')
        .update({
          phone: next.phone,
          notification_preferences: next.notificationPreferences,
          onboarding_completed: next.onboardingCompleted,
        })
        .eq('user_id', next.userId);

      if (error) return { success: false, error: error.message };
    }

    return { success: true };
  };

  const createNewOrganization = async (name: string, slug: string, title = 'Owner', industry?: string) => {
    if (!user) return { success: false, error: 'Authentication required' };

    if (isSupabaseConfigured) {
      const { data, error } = await supabase.rpc('create_organization', {
        p_name: name,
        p_slug: slug,
        p_title: title,
        p_industry: industry || 'Technology',
      });

      if (error) return { success: false, error: error.message };

      const newOrg: Organization = {
        id: data.organization_id,
        name: data.name,
        slug: data.slug,
        industry,
      };

      setPrimaryOrg(newOrg);
      setOrgMembership({
        id: `mem-${Date.now()}`,
        organizationId: newOrg.id,
        userId: user.id,
        role: 'owner',
        title,
        status: 'active',
      });

      return { success: true, organization: newOrg };
    }

    // Local mock fallback
    const mockOrg: Organization = {
      id: `org-${Date.now()}`,
      name,
      slug,
      industry,
    };
    setPrimaryOrg(mockOrg);
    setOrgMembership({
      id: `mem-${Date.now()}`,
      organizationId: mockOrg.id,
      userId: user.id,
      role: 'owner',
      title,
      status: 'active',
    });

    return { success: true, organization: mockOrg };
  };

  const signOut = () => {
    if (isSupabaseConfigured) {
      supabase.auth.signOut();
    }
    setUser(null);
    setPrivateProfile(null);
    setPrimaryOrg(null);
    setOrgMembership(null);
    localStorage.removeItem('triple_motive_active_user');
  };

  const upgradeToPro = async () => {
    if (user) {
      setUser({ ...user, isPro: true });
    }
  };

  const rotateMeetingSlug = async () => {
    const newSlug = `motive-${Math.floor(100000 + Math.random() * 900000)}`;
    if (user) {
      setUser({ ...user, customSlug: newSlug });
    }
    return newSlug;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        privateProfile,
        primaryOrg,
        orgMembership,
        isLoading,
        signInWithGoogle,
        signInWithEmailOtp,
        sendEmailOtp: signInWithEmailOtp,
        verifyEmailOtp,
        signInWithDemoExecutive,
        updateProfile,
        updatePrivateProfile,
        createNewOrganization,
        upgradeToPro,
        rotateMeetingSlug,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
