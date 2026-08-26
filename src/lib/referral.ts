import { supabase, isSupabaseConfigured } from './supabase';

const REF_STORAGE_KEY = 'letitbeme_active_ref_slug';

export interface ReferralLink {
  id: string;
  host_id: string;
  ambassador_id?: string;
  ambassador_name: string;
  ambassador_email: string;
  ref_slug: string;
  commission_rate?: number;
  commission_percent?: number;
  total_clicks: number;
  total_sales: number;
  total_revenue: number;
  total_commission: number;
  payout_email?: string;
  payout_status?: string;
  created_at: string;
}

export interface CommissionRecord {
  id: string;
  ref_slug: string;
  stripe_session_id?: string;
  customer_email?: string;
  sale_amount: number;
  commission_amount: number;
  status: 'pending' | 'approved' | 'paid';
  created_at: string;
}

// 1. Capture referral click from URL (?ref=slug)
export async function trackReferralClick(refSlug: string): Promise<void> {
  if (!refSlug || !refSlug.trim()) return;
  const cleanSlug = refSlug.toLowerCase().trim();

  // Save to persistent storage (30-day attribution window)
  localStorage.setItem(REF_STORAGE_KEY, cleanSlug);

  if (!isSupabaseConfigured) return;

  try {
    // Log individual click with user agent
    await supabase.from('letitbeme_referral_clicks').insert({
      id: `clk_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      ref_slug: cleanSlug,
      user_agent: navigator.userAgent,
    });

    // Increment aggregate counter in referral links table
    const { data: link } = await supabase
      .from('letitbeme_referral_links')
      .select('id, total_clicks, clicks')
      .or(`ref_slug.eq.${cleanSlug},code.eq.${cleanSlug}`)
      .maybeSingle();

    if (link) {
      const currentClicks = link.total_clicks || link.clicks || 0;
      await supabase
        .from('letitbeme_referral_links')
        .update({
          total_clicks: currentClicks + 1,
          clicks: currentClicks + 1,
        })
        .eq('id', link.id);
    }
  } catch (err) {
    console.warn('Referral click tracking note:', err);
  }
}

// 2. Get active referral attribution slug
export function getActiveReferralSlug(): string | null {
  return localStorage.getItem(REF_STORAGE_KEY);
}

// 3. Claim a link by Slug (?claim=slug) to bind it to signed-in user's account
export async function claimReferralLink(
  refSlug: string,
  userId: string,
  userEmail: string,
  userName?: string
): Promise<{ success: boolean; link?: ReferralLink }> {
  if (!refSlug || !isSupabaseConfigured) return { success: false };

  try {
    const cleanSlug = refSlug.toLowerCase().trim();

    // Check if link exists
    const { data: link } = await supabase
      .from('letitbeme_referral_links')
      .select('*')
      .or(`ref_slug.eq.${cleanSlug},code.eq.${cleanSlug}`)
      .maybeSingle();

    if (link) {
      // Update link with ambassador user id and email
      const { data: updated } = await supabase
        .from('letitbeme_referral_links')
        .update({
          ambassador_id: userId,
          ambassador_email: userEmail.toLowerCase().trim(),
          ambassador_name: link.ambassador_name || userName || 'Verified Partner',
        })
        .eq('id', link.id)
        .select()
        .single();

      return { success: true, link: updated as ReferralLink };
    }

    return { success: false };
  } catch (err) {
    console.warn('Claim referral link note:', err);
    return { success: false };
  }
}

// 4. Record commission on sale completion
export async function recordReferralSale(
  saleAmount: number,
  customerEmail?: string,
  stripeSessionId?: string
): Promise<{ success: boolean; commissionAmount?: number; ambassadorName?: string }> {
  const activeRef = getActiveReferralSlug();
  if (!activeRef) return { success: false };

  if (!isSupabaseConfigured) {
    const commission = saleAmount * 0.15;
    return { success: true, commissionAmount: commission, ambassadorName: activeRef };
  }

  try {
    const { data: link } = await supabase
      .from('letitbeme_referral_links')
      .select('*')
      .or(`ref_slug.eq.${activeRef},code.eq.${activeRef}`)
      .maybeSingle();

    const commissionPercent = link?.commission_percent || link?.commission_rate || 15.0;
    const commissionAmount = Number(((saleAmount * commissionPercent) / 100).toFixed(2));
    const commissionId = `comm_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    // Log commission record in Supabase
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
      const currentSales = link.total_sales || link.conversions || 0;
      const currentRevenue = Number(link.total_revenue || link.revenue || 0);
      const currentCommission = Number(link.total_commission || 0);

      await supabase
        .from('letitbeme_referral_links')
        .update({
          total_sales: currentSales + 1,
          conversions: currentSales + 1,
          total_revenue: Number((currentRevenue + saleAmount).toFixed(2)),
          revenue: Number((currentRevenue + saleAmount).toFixed(2)),
          total_commission: Number((currentCommission + commissionAmount).toFixed(2)),
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
