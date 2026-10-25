// MSG91 OTP widget for the WEBSITE. The browser talks to MSG91 directly (same 3 calls the phone app makes),
// so the SMS is requested from the visitor's own connection instead of from our Render server — MSG91 keeps
// blocking Render's IP addresses for this call. Our server only confirms the finished verification.
// WIDGET_ID / TOKEN_AUTH are PUBLIC client values (MSG91 dashboard -> OTP -> Widgets -> your widget -> Client Side Integration).
// The secret Authkey must never appear here.
const BASE = 'https://control.msg91.com/api/v5/widget';

export const WIDGET_ID  = '366a6b6c7473303931343932';     // currently the same widget as the phone app
export const TOKEN_AUTH = '547547TmgtXVJebi56a5876e3P1';
export const OTP_LENGTH = 4;                              // must equal "OTP Length" in the widget settings

async function post(path, body) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 20000);
  try {
    const res = await fetch(`${BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ widgetId: WIDGET_ID, tokenAuth: TOKEN_AUTH, ...body }),
      signal: ctrl.signal,
    });
    const data = await res.json().catch(() => ({}));
    // verifyOtp's reply carries the JWT in `message` and no `type` on success.
    const ok = data?.type === 'success' || (data?.type !== 'error' && res.ok && typeof data?.message === 'string' && data.message.startsWith('eyJ'));
    if (!ok) throw new Error(typeof data?.message === 'string' && data.message ? data.message : 'OTP service error');
    return data;
  } catch (e) {
    if (e.name === 'AbortError') throw new Error('Network timeout. Please try again.');
    if (e instanceof TypeError) throw new Error('Could not reach the OTP service. Check your connection and try again.');
    throw e;
  } finally { clearTimeout(timer); }
}

/** Send an OTP to a 10-digit Indian number. Returns reqId (also used for "resend"). */
export async function sendOtp(phone10) {
  const d = await post('/sendOtpMobile', { identifier: `91${phone10}` });
  return d.message;
}

/** Verify the OTP. Returns the access token to give OUR server. */
export async function verifyOtp(reqId, otp) {
  const d = await post('/verifyOtp', { reqId, otp });
  return d.message;
}