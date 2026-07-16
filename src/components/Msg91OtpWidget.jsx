import { useEffect, useRef } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// Msg91OtpWidget — loads MSG91's OTP widget script once and triggers it.
//
// The widget renders its OWN popup UI for entering/resending the OTP — we
// don't build a custom OTP-input screen here, because the exact exposed
// method names/signatures for `exposeMethods: true` custom-UI mode aren't
// something I can verify with full confidence right now. This built-in-modal
// integration path (configuration + sendOtp trigger + top-level
// success/failure callbacks) is the long-stable, documented MSG91 pattern.
//
// IMPORTANT: `data.message` in the success callback is a verified ACCESS
// TOKEN, not a phone number. It must be sent to YOUR server, which then
// calls MSG91's server-side verifyAccessToken API (using your account
// authkey — never exposed to the browser) to confirm it's genuine and to
// get the actual verified phone number back. Never trust a phone number the
// browser sends alongside the token.
//
// Props:
//   widgetId   — from your MSG91 dashboard
//   tokenAuth  — from your MSG91 dashboard (safe to expose client-side)
//   identifier — phone number to verify, e.g. "91XXXXXXXXXX"
//   onVerified — called with the raw access token string on success
//   onError    — called with the error payload on failure
//   trigger    — bump this number to re-open/re-trigger the widget for a
//                new identifier (e.g. when the user edits their phone number)
// ─────────────────────────────────────────────────────────────────────────────
export default function Msg91OtpWidget({ widgetId, tokenAuth, identifier, onVerified, onError, trigger }) {
  const configuredRef = useRef(false);

  useEffect(() => {
    if (!widgetId || !tokenAuth || !identifier) return;

    const configuration = {
      widgetId,
      tokenAuth,
      identifier,
      exposeMethods: false, // using MSG91's built-in popup UI, not a custom form
      success: (data) => {
        // data.message is the verified access token — send it to the server
        onVerified && onVerified(data?.message || data);
      },
      failure: (error) => {
        onError && onError(error);
      },
    };

    function initWidget() {
      if (typeof window.initSendOTP !== 'function') return;
      window.initSendOTP(configuration);
      configuredRef.current = true;
      // Trigger the widget's popup immediately for this identifier
      if (typeof window.sendOtp === 'function') {
        window.sendOtp(
          identifier,
          () => {},                 // OTP sent — widget shows its own UI from here
          (err) => onError && onError(err)
        );
      }
    }

    if (window.initSendOTP) {
      initWidget();
      return;
    }

    if (document.getElementById('msg91-otp-script')) {
      const wait = setInterval(() => {
        if (window.initSendOTP) { clearInterval(wait); initWidget(); }
      }, 200);
      return () => clearInterval(wait);
    }

    // Two-URL fallback, matching MSG91's own recommended loader pattern
    const urls = ['https://verify.msg91.com/otp-provider.js', 'https://verify.phone91.com/otp-provider.js'];
    let i = 0;
    function attempt() {
      const s = document.createElement('script');
      s.id = 'msg91-otp-script';
      s.src = urls[i];
      s.async = true;
      s.onload = initWidget;
      s.onerror = () => {
        i++;
        if (i < urls.length) attempt();
        else onError && onError({ message: 'Could not load OTP service. Check your connection and try again.' });
      };
      document.head.appendChild(s);
    }
    attempt();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [identifier, trigger]);

  // The widget renders its own popup/overlay — nothing to render here.
  return null;
}