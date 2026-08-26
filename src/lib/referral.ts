import { supabase, isSupabaseConfigured } from './supabase';

const REF_STORAGE_KEY = 'letitbeme_active_ref_slug';

export interface ReferralLink {
  id: string;
  hostId: string;
  ambassadorName: string;
  ambassadorEmail: string;
  refSlug: string;
  commissionPercent: number;
  totalClicks: number;
  totalSales: number;
  totalRevenue: number;
  totalCommission: number;
  createdAt: string;
}

export interface CommissionRecord {
  id: string;
  refSlug: string;
  stripeSessionId?: string;
  customerEmail?: string;
  saleAmount: number;
  commissionAmount: number;
  status: 'pending' | 'approved' | 'paid';
  createdAt: string;
}

// 1. Capture referral click from URL (?ref=slug)
export async function trackReferralClick(refSlug: string): Promise<void> {
  if (!refSlug || !refSlug.trim()) return;
  const cleanSlug = refSlug.toLowerCase().trim();

  // Save to persistent storage (30-day cookie / local storage)
  localStorage.setItem(REF_STORAGE_KEY, cleanSlug);

  if (!isSupabaseConfigured) return;

  try {
    // Log individual click
    await supabase.from('letitbeme_referral_clicks').insert({
      id: `clk_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      ref_slug: cleanSlug,
      user_agent: navigator.userAgent,
    });

    // Increment aggregate counter in referral links table
    const { data: link } = await supabase
      .from('letitbeme_referral_links')
      .select('id, total_clicks')
      .eq('ref_slug', cleanSlug)
      .single();

    if (link) {
      await supabase
        .from('letitbeme_referral_links')
        .update({
          total_clicks: (link.total_clicks || 0) + 1,
        })
        .eq('id', link.id);
    }
  } catch (err) {
    console.warn('Referral click tracking note:', err);
  }
}

// 2. Get active referral attribution
export function getActiveReferralSlug(): string | null {
  return localStorage.getItem(REF_STORAGE_KEY);
}

// 3. Record commission on sale completion
export async function recordReferralSale(
  saleAmount: number,
  customerEmail?: string,
  stripeSessionId?: string
): Promise<{ success: boolean; commissionAmount?: number; ambassadorName?: string }> {
  const activeRef = getActiveReferralSlug();
  if (!activeRef) return { success: false };

  if (!isSupabaseConfigured) {
    // Local fallback
    const commission = (saleAmount * 0.15);
    return { success: true, commissionAmount: commission, ambassadorName: activeRef };
  }

  try {
    const { data: link } = await supabase
      .from('letitbeme_referral_links')
      .select('*')
      .eq('ref_slug', activeRef)
      .single();

    const commissionPercent = link?.commission_percent || 15.0;
    const commissionAmount = Number(((saleAmount * commissionPercent) / 100).toFixed(2));

    const commissionId = `comm_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    // Log commission record
    await supabase.from('letitbeme_commissions').insert({
      id: commissionId,
      ref_slug: activeRef,
      stripe_session_id: stripeSessionId || `test_${Date.now()}`,
      customer_email: customerEmail || 'guest@example.com',
      sale_amount: saleAmount,
      commission_amount: commissionAmount,
      status: 'approved',
    });

    // Update aggregate stats on referral link
    if (link) {
      await supabase
        .from('letitbeme_referral_links')
        .update({
          total_sales: (link.total_sales || 0) + 1,
          total_revenue: Number(((link.total_revenue || 0) + saleAmount).toFixed(2)),
          total_commission: Number(((link.total_commission || 0) + commissionAmount).toFixed(2)),
        })
        .eq('id', link.id);
    }

    return {
      success: true,
      commissionAmount,
      ambassadorName: link?.ambassador_name || activeRef,
    };
  } catch (err) {
    console.warn('Referral sale recording note:', err);
    return { success: false };
  }
}
