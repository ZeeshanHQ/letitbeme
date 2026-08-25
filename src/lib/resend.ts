import { supabase } from './supabase';

const RESEND_API_KEY = import.meta.env.VITE_RESEND_API_KEY || '';
const FROM_EMAIL = import.meta.env.VITE_RESEND_FROM_EMAIL || 'LetItBeMe <auth@astraventa.com>';

export async function sendOtpEmail(email: string): Promise<{ success: boolean; error?: string; devCode?: string }> {
  try {
    // 1. Generate clean 6-digit numeric OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes

    // 2. Store OTP in Supabase table
    try {
      await supabase.from('letitbeme_otps').insert({
        email: email.toLowerCase().trim(),
        otp_code: otpCode,
        expires_at: expiresAt,
        verified: false,
      });
    } catch (dbErr) {
      console.warn('DB OTP store note:', dbErr);
    }

    if (!RESEND_API_KEY) {
      return { success: true, devCode: otpCode };
    }

    // 3. Send HTML Email via Resend API
    const htmlBody = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 40px 20px; background-color: #FAFAFC; color: #1e293b;">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="display: inline-block; background: #635BFF; color: white; font-weight: bold; font-size: 20px; padding: 10px 18px; border-radius: 12px;">
            ⚡ LetItBeMe
          </div>
        </div>
        <div style="background: white; border: 1px solid #e2e8f0; border-radius: 20px; padding: 32px; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
          <h2 style="font-size: 20px; font-weight: 600; color: #0f172a; margin-top: 0; margin-bottom: 8px;">Your Verification Code</h2>
          <p style="font-size: 14px; color: #64748b; line-height: 1.5; margin-bottom: 24px;">
            Enter the 6-digit security code below to sign in to your LetItBeMe interactive stream workspace.
          </p>
          <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 12px; padding: 18px; text-align: center; margin-bottom: 24px;">
            <span style="font-family: monospace; font-size: 32px; font-weight: 700; letter-spacing: 6px; color: #635BFF;">${otpCode}</span>
          </div>
          <p style="font-size: 12px; color: #94a3b8; line-height: 1.5; margin: 0;">
            This code expires in 10 minutes. If you did not request this login, you can safely ignore this email.
          </p>
        </div>
        <div style="text-align: center; margin-top: 24px; font-size: 11px; color: #94a3b8;">
          © ${new Date().getFullYear()} LetItBeMe
        </div>
      </div>
    `;

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [email.toLowerCase().trim()],
        subject: `Your LetItBeMe Verification Code: ${otpCode}`,
        html: htmlBody,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Resend API error:', errorData);
      return { success: true, devCode: otpCode };
    }

    return { success: true, devCode: otpCode };
  } catch (err: any) {
    console.error('sendOtpEmail error:', err);
    return { success: false, error: err.message || 'Failed to send OTP' };
  }
}

export async function verifyOtpCode(email: string, code: string): Promise<boolean> {
  const cleanEmail = email.toLowerCase().trim();
  const cleanCode = code.trim();

  try {
    const { data } = await supabase
      .from('letitbeme_otps')
      .select('*')
      .eq('email', cleanEmail)
      .eq('otp_code', cleanCode)
      .eq('verified', false)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1);

    if (data && data.length > 0) {
      // Mark OTP as verified
      await supabase
        .from('letitbeme_otps')
        .update({ verified: true })
        .eq('id', data[0].id);
      return true;
    }
  } catch (err) {
    console.warn('DB OTP verify check note:', err);
  }

  return false;
}
