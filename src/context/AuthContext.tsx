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
  rotateMeetingSlug: () => Promise<string>;
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

  // Listen to Supabase Auth State
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
              brandColor: existingUser.brand_color || '#0084FF',
              pricingMode: 'free',
              isPro: Boolean(existingUser.is_pro),
              tier: existingUser.tier || 'free',
              proSince: existingUser.pro_since,
            };

            setUser(profile);
          } else {
            const newId = `user_${Date.now()}`;
            const slug = email.split('@')[0].replace(/[^a-zA-Z0-9-_]/g, '') || `user${Math.floor(Math.random()*1000)}`;
            const newProfile: UserProfile = {
              id: newId,
              email: email.toLowerCase().trim(),
              fullName,
              avatarUrl: googleAvatar,
              role: 'host',
              customSlug: slug,
              brandColor: '#0084FF',
              pricingMode: 'free',
              isPro: false,
              tier: 'free',
            };

            await supabase.from('letitbeme_users').insert({
              id: newId,
              email: newProfile.email,
              full_name: newProfile.fullName,
              custom_slug: newProfile.customSlug,
              brand_color: newProfile.brandColor,
              is_pro: false,
              tier: 'free',
            });

            setUser(newProfile);
          }
        } catch (err) {
          console.warn('OAuth database sync note:', err);
        }
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [user]);

  const signInWithGoogle = async (): Promise<{ error?: string }> => {
    if (!isSupabaseConfigured) {
      signInAsGuest('host');
      return {};
    }

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/?view=presenter`,
        },
      });

      if (error) throw error;
      return {};
    } catch (err: unknown) {
      console.warn('Google OAuth redirected to guest:', err);
      signInAsGuest('host');
      return {};
    }
  };

  const sendEmailOtp = async (email: string) => {
    setIsLoading(true);
    try {
      const result = await sendOtpEmail(email);
      return result;
    } finally {
      setIsLoading(false);
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
      const isValid = await verifyOtpCode(email, code);
      if (!isValid) {
        return { success: false, error: 'Invalid or expired OTP code.' };
      }

      const cleanEmail = email.toLowerCase().trim();
      let userProfile: UserProfile | null = null;
      let isNew = false;

      if (isSupabaseConfigured) {
        try {
          const { data: existingUser } = await supabase
            .from('letitbeme_users')
            .select('*')
            .eq('email', cleanEmail)
            .single();

          if (existingUser) {
            userProfile = {
              id: existingUser.id,
              email: existingUser.email,
              fullName: existingUser.full_name,
              avatarUrl: existingUser.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(existingUser.full_name)}`,
              role: existingUser.role || role,
              customSlug: existingUser.custom_slug || cleanEmail.split('@')[0],
              brandColor: existingUser.brand_color || '#0084FF',
              pricingMode: 'free',
              isPro: Boolean(existingUser.is_pro),
              tier: existingUser.tier || 'free',
              proSince: existingUser.pro_since,
            };
          } else {
            isNew = true;
            const newId = `user_${Date.now()}`;
            const chosenName = fullName?.trim() || cleanEmail.split('@')[0];
            const chosenSlug = chosenName.toLowerCase().replace(/[^a-z0-9]/g, '') || `user${Math.floor(Math.random()*1000)}`;

            userProfile = {
              id: newId,
              email: cleanEmail,
              fullName: chosenName,
              avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(chosenName)}`,
              role,
              customSlug: chosenSlug,
              brandColor: '#0084FF',
              pricingMode: 'free',
              isPro: false,
              tier: 'free',
            };

            await supabase.from('letitbeme_users').insert({
              id: newId,
              email: cleanEmail,
              full_name: chosenName,
              custom_slug: chosenSlug,
              brand_color: '#0084FF',
              is_pro: false,
              tier: 'free',
            });
          }
        } catch (dbErr) {
          console.warn('Database lookup note, using local profile:', dbErr);
        }
      }

      if (!userProfile) {
        const chosenName = fullName?.trim() || cleanEmail.split('@')[0];
        userProfile = {
          id: `user_${Date.now()}`,
          email: cleanEmail,
          fullName: chosenName,
          avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(chosenName)}`,
          role,
          customSlug: chosenName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'live',
          brandColor: '#0084FF',
          pricingMode: 'free',
          isPro: false,
          tier: 'free',
        };
      }

      setUser(userProfile);
      return { success: true, isNewUser: isNew };
    } finally {
      setIsLoading(false);
    }
  };

  const signInAsGuest = (role: 'host' | 'ambassador' = 'host') => {
    const guestUser: UserProfile = {
      id: `guest_${Date.now()}`,
      email: 'demo@letitbe.me',
      fullName: 'Host Presenter',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role,
      customSlug: 'live',
      brandColor: '#0084FF',
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
            updated_at: new Date().toISOString(),
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

  const rotateMeetingSlug = async (): Promise<string> => {
    if (!user) return 'live';
    const prefix = user.fullName.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 8) || 'meet';
    const randomSuffix = Math.random().toString(36).substring(2, 6);
    const newSlug = `${prefix}-${randomSuffix}`;

    const updatedUser: UserProfile = { ...user, customSlug: newSlug };
    setUser(updatedUser);
    localStorage.setItem('letitbeme_active_user', JSON.stringify(updatedUser));

    if (isSupabaseConfigured && !user.isGuest) {
      try {
        await supabase
          .from('letitbeme_users')
          .update({
            custom_slug: newSlug,
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id);

        await supabase.from('letitbeme_rooms').upsert({
          room_slug: newSlug,
          host_id: user.id,
          title: `${user.fullName}'s Executive Meeting Room`,
          updated_at: new Date().toISOString(),
        });
      } catch (err) {
        console.warn('Supabase rotate slug note:', err);
      }
    }

    return newSlug;
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
