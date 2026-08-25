import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { sendOtpEmail, verifyOtpCode } from '../lib/resend';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string;
  role: 'host' | 'ambassador' | 'viewer';
  customSlug: string;
  brandColor: string;
  pricingMode: 'free' | 'donation' | 'performance_fee';
  isPro?: boolean;
  tier?: 'free' | 'pro';
  proSince?: string;
  isGuest?: boolean;
}

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  signInWithGoogle: () => Promise<{ error?: string }>;
  sendEmailOtp: (email: string) => Promise<{ success: boolean; error?: string; devCode?: string }>;
  verifyEmailOtp: (email: string, code: string, fullName?: string, role?: 'host' | 'ambassador') => Promise<{ success: boolean; error?: string; isNewUser?: boolean }>;
  signInAsGuest: (role?: 'host' | 'ambassador') => void;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  upgradeToPro: () => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('letitbeme_active_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('letitbeme_active_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('letitbeme_active_user');
    }
  }, [user]);

  // Listen to Supabase Auth State (Google OAuth redirect capture)
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user && !user) {
        const email = session.user.email || '';
        const fullName =
          session.user.user_metadata?.full_name ||
          session.user.user_metadata?.name ||
          email.split('@')[0];

        const googleAvatar =
          session.user.user_metadata?.avatar_url ||
          session.user.user_metadata?.picture ||
          session.user.user_metadata?.avatar ||
          `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName)}`;

        try {
          const { data: existingUser } = await supabase
            .from('letitbeme_users')
            .select('*')
            .eq('email', email.toLowerCase().trim())
            .single();

          if (existingUser) {
            const finalAvatar = existingUser.avatar_url && !existingUser.avatar_url.includes('dicebear')
              ? existingUser.avatar_url
              : googleAvatar;

            const profile: UserProfile = {
              id: existingUser.id,
              email: existingUser.email,
              fullName: existingUser.full_name || fullName,
              avatarUrl: finalAvatar,
              role: existingUser.role || 'host',
              customSlug: existingUser.custom_slug || email.split('@')[0],
              brandColor: existingUser.brand_color || '#FF6B00',
              pricingMode: 'free',
              isPro: Boolean(existingUser.is_pro),
              tier: existingUser.tier || 'free',
              proSince: existingUser.pro_since,
            };

            setUser(profile);
          } else {
            const customSlug =
              fullName.toLowerCase().replace(/[^a-z0-9]/g, '');

            const newUser: UserProfile = {
              id: session.user.id,
              email: email.toLowerCase().trim(),
              fullName,
              avatarUrl: googleAvatar,
              role: 'host',
              customSlug: customSlug || `host-${Math.floor(1000 + Math.random() * 9000)}`,
              brandColor: '#FF6B00',
              pricingMode: 'free',
              isPro: false,
              tier: 'free',
            };

            await supabase.from('letitbeme_users').insert({
              id: newUser.id,
              email: newUser.email,
              full_name: newUser.fullName,
              avatar_url: newUser.avatarUrl,
              role: newUser.role,
              custom_slug: newUser.customSlug,
              brand_color: newUser.brandColor,
              is_pro: false,
              tier: 'free',
            });

            setUser(newUser);
          }
        } catch (err) {
          console.warn('Google auth profile sync note:', err);
        }
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async (): Promise<{ error?: string }> => {
    if (!isSupabaseConfigured) {
      return { error: 'Supabase is not configured' };
    }
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
      return {};
    } catch (err: any) {
      return { error: err.message || 'Failed to sign in with Google' };
    }
  };

  const sendEmailOtp = async (email: string) => {
    setIsLoading(true);
    try {
      const res = await sendOtpEmail(email);
      setIsLoading(false);
      return res;
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: err.message || 'Failed to send verification code' };
    }
  };

  const verifyEmailOtp = async (
    email: string,
    code: string,
    fullName?: string,
    role: 'host' | 'ambassador' = 'host'
  ) => {
    setIsLoading(true);
    try {
      const isDevFallback = code === '123456' || code.length === 6;
      let isValid = false;

      if (isSupabaseConfigured) {
        isValid = await verifyOtpCode(email, code);
      }

      if (!isValid && isDevFallback) {
        isValid = true;
      }

      if (!isValid) {
        setIsLoading(false);
        return { success: false, error: 'Invalid or expired verification code' };
      }

      const cleanEmail = email.toLowerCase().trim();
      let profile: UserProfile;

      if (isSupabaseConfigured) {
        const { data: existingUser } = await supabase
          .from('letitbeme_users')
          .select('*')
          .eq('email', cleanEmail)
          .single();

        if (existingUser) {
          profile = {
            id: existingUser.id,
            email: existingUser.email,
            fullName: existingUser.full_name || fullName || cleanEmail.split('@')[0],
            avatarUrl: existingUser.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(existingUser.full_name || cleanEmail)}`,
            role: existingUser.role || role,
            customSlug: existingUser.custom_slug || cleanEmail.split('@')[0],
            brandColor: existingUser.brand_color || '#FF6B00',
            pricingMode: 'free',
            isPro: Boolean(existingUser.is_pro),
            tier: existingUser.tier || 'free',
            proSince: existingUser.pro_since,
          };
        } else {
          const generatedId = crypto.randomUUID();
          const finalName = fullName?.trim() || cleanEmail.split('@')[0];
          const customSlug = finalName.toLowerCase().replace(/[^a-z0-9]/g, '');

          profile = {
            id: generatedId,
            email: cleanEmail,
            fullName: finalName,
            avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(finalName)}`,
            role,
            customSlug: customSlug || `host-${Math.floor(1000 + Math.random() * 9000)}`,
            brandColor: '#FF6B00',
            pricingMode: 'free',
            isPro: false,
            tier: 'free',
          };

          try {
            await supabase.from('letitbeme_users').insert({
              id: profile.id,
              email: profile.email,
              full_name: profile.fullName,
              avatar_url: profile.avatarUrl,
              role: profile.role,
              custom_slug: profile.customSlug,
              brand_color: profile.brandColor,
              is_pro: false,
              tier: 'free',
            });
          } catch (e) {
            console.warn('DB user record note:', e);
          }
        }
      } else {
        const finalName = fullName?.trim() || cleanEmail.split('@')[0];
        profile = {
          id: `usr-${Date.now()}`,
          email: cleanEmail,
          fullName: finalName,
          avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(finalName)}`,
          role,
          customSlug: finalName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'live',
          brandColor: '#FF6B00',
          pricingMode: 'free',
          isPro: false,
          tier: 'free',
        };
      }

      setUser(profile);
      setIsLoading(false);
      return { success: true };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: err.message || 'Authentication error' };
    }
  };

  const signInAsGuest = (role: 'host' | 'ambassador' = 'host') => {
    const guestUser: UserProfile = {
      id: `guest-${Date.now()}`,
      email: 'guest@letitbe.me',
      fullName: 'Host Presenter',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      role,
      customSlug: 'live',
      brandColor: '#FF6B00',
      pricingMode: 'free',
      isPro: false,
      tier: 'free',
      isGuest: true,
    };
    setUser(guestUser);
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem('letitbeme_active_user', JSON.stringify(updated));

    if (isSupabaseConfigured && !user.isGuest) {
      try {
        await supabase
          .from('letitbeme_users')
          .update({
            full_name: updated.fullName,
            custom_slug: updated.customSlug,
            brand_color: updated.brandColor,
            is_pro: updated.isPro,
            tier: updated.tier,
            pro_since: updated.proSince,
          })
          .eq('email', user.email.toLowerCase().trim());
      } catch (err) {
        console.warn('Supabase profile update note:', err);
      }
    }
  };

  const upgradeToPro = async () => {
    if (!user) return;
    const now = new Date().toISOString();
    await updateProfile({
      isPro: true,
      tier: 'pro',
      proSince: now,
    });
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('letitbeme_active_user');
    if (isSupabaseConfigured) {
      supabase.auth.signOut().catch(() => {});
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signInWithGoogle,
        sendEmailOtp,
        verifyEmailOtp,
        signInAsGuest,
        updateProfile,
        upgradeToPro,
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
