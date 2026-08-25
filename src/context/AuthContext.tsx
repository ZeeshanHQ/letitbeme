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

        // Google avatar extraction
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
              customSlug,
              brandColor: '#FF6B00',
              pricingMode: 'free',
            };

            await supabase.from('letitbeme_users').insert({
              id: session.user.id,
              email: newUser.email,
              full_name: newUser.fullName,
              avatar_url: newUser.avatarUrl,
              role: 'host',
              custom_slug: newUser.customSlug,
              brand_color: '#FF6B00',
              pricing_mode: 'free',
            });

            setUser(newUser);
          }
        } catch (err) {
          console.warn('OAuth user sync note:', err);
        }
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [user]);

  const signInWithGoogle = async (): Promise<{ error?: string }> => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      setIsLoading(false);
      if (error) return { error: error.message };
      return {};
    } catch (err: any) {
      setIsLoading(false);
      return { error: err.message || 'Google Sign-In failed' };
    }
  };

  const sendEmailOtp = async (email: string) => {
    setIsLoading(true);
    const result = await sendOtpEmail(email);
    setIsLoading(false);
    return result;
  };

  const verifyEmailOtp = async (
    email: string,
    code: string,
    fullName?: string,
    role: 'host' | 'ambassador' = 'host'
  ): Promise<{ success: boolean; error?: string; isNewUser?: boolean }> => {
    setIsLoading(true);
    const isValid = await verifyOtpCode(email, code);

    if (!isValid) {
      setIsLoading(false);
      return { success: false, error: 'Invalid or expired 6-digit verification code' };
    }

    try {
      const { data: existingUser } = await supabase
        .from('letitbeme_users')
        .select('*')
        .eq('email', email.toLowerCase().trim())
        .single();

      if (existingUser) {
        const profile: UserProfile = {
          id: existingUser.id,
          email: existingUser.email,
          fullName: existingUser.full_name,
          avatarUrl: existingUser.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(existingUser.full_name)}`,
          role: existingUser.role || 'host',
          customSlug: existingUser.custom_slug || email.split('@')[0],
          brandColor: existingUser.brand_color || '#FF6B00',
          pricingMode: 'free',
        };
        setUser(profile);
        setIsLoading(false);
        return { success: true, isNewUser: false };
      } else {
        const name = fullName?.trim() || email.split('@')[0];
        const customSlug = name.toLowerCase().replace(/[^a-z0-9]/g, '');
        const newUser: UserProfile = {
          id: `user-${Date.now()}`,
          email: email.toLowerCase().trim(),
          fullName: name,
          avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
          role,
          customSlug,
          brandColor: '#FF6B00',
          pricingMode: 'free',
        };

        await supabase.from('letitbeme_users').insert({
          email: newUser.email,
          full_name: newUser.fullName,
          avatar_url: newUser.avatarUrl,
          role: newUser.role,
          custom_slug: newUser.customSlug,
          brand_color: newUser.brandColor,
          pricing_mode: 'free',
        });

        setUser(newUser);
        setIsLoading(false);
        return { success: true, isNewUser: true };
      }
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: err.message || 'Verification failed' };
    }
  };

  const signInAsGuest = (role: 'host' | 'ambassador' = 'host') => {
    const guestUser: UserProfile = {
      id: `guest-${Date.now()}`,
      email: 'alex@astraventa.com',
      fullName: 'Alex Vance',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      role,
      customSlug: 'alex-live',
      brandColor: '#FF6B00',
      pricingMode: 'free',
      isGuest: true,
    };
    setUser(guestUser);
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updated: UserProfile = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem('letitbeme_active_user', JSON.stringify(updated));

    try {
      await supabase.from('letitbeme_users').update({
        full_name: updated.fullName,
        role: updated.role,
        custom_slug: updated.customSlug,
        brand_color: updated.brandColor,
        pricing_mode: updated.pricingMode,
      }).eq('email', user.email);
    } catch (err) {
      console.warn('Profile sync note', err);
    }
  };

  const signOut = async () => {
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (e) {}
    }
    setUser(null);
    localStorage.removeItem('letitbeme_active_user');
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
