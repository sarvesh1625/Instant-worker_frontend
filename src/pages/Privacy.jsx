import { useNavigate } from 'react-router-dom';
import '../styles/theme.css';

export default function Privacy() {
  const navigate = useNavigate();

  const S = ({ n, title, children }) => (
    <div style={{ marginBottom: 22 }}>
      <h2 style={{ margin: '0 0 8px', fontSize: 15.5, fontWeight: 700, color: 'var(--text)' }}>{n}. {title}</h2>
      <div style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.75 }}>{children}</div>
    </div>
  );

  return (
    <div className="il-page">
      <div className="il-topbar il-topbar-brand">
        <div className="il-topbar-inner" style={{ maxWidth: 760 }}>
          <button onClick={() => navigate(-1)} className="il-back-btn"><i className="ti ti-arrow-left" aria-hidden="true"></i></button>
          <h1 className="il-topbar-title">Privacy Policy</h1>
        </div>
      </div>

      <div className="il-shell" style={{ maxWidth: 760 }}>
        <div className="il-card il-card-pad">
          <p className="il-muted" style={{ margin: '0 0 20px', fontSize: 12.5 }}>
            Last updated: June 2026 · Instant Worker ("the Platform")
          </p>

          <S n="1" title="What We Collect">
            When you register: your name, mobile number, password (stored encrypted), and role. Workers may add: skill, experience, daily wage, city/area, languages, profile photo, and portfolio photos. Optionally: government ID for verification.
          </S>

          <S n="2" title="Location Data">
            Worker GPS location is collected ONLY while a job is active — from when a worker is accepted until the work is marked complete, or until the worker stops sharing manually. Location is shared only with the poster of that specific job. We store only the last known coordinates, not a movement history trail.
          </S>

          <S n="3" title="Chat Data">
            Messages are stored so both parties can see their conversation history. Chat metadata (who talked to whom, when) is logged for safety. Message content is reviewed by our safety team ONLY when a conversation is reported by a participant — never routinely.
          </S>

          <S n="4" title="ID Verification Documents">
            ID photos submitted for verification are visible ONLY to our verification team. They are never shown publicly, never shared with other users, and never sold or shared with third parties. Only your verification status (verified badge) is public.
          </S>

          <S n="5" title="How We Use Your Data">
            To match workers with jobs near them; to show your profile to potential hirers; to enable chat and live tracking during active jobs; to send job notifications; to prevent fraud and keep the Platform safe. We do NOT sell your personal data to anyone.
          </S>

          <S n="6" title="Who Can See What">
            Public: your name, photo, skill, city, rating, portfolio, verified badge. Private: your phone number is shared only with users you have an accepted job with; your ID documents, password, and exact location history are never public.
          </S>

          <S n="7" title="Data Security">
            Passwords are encrypted (bcrypt). Accounts are protected by OTP verification, login attempt lockouts, and rate limiting. Our servers use industry-standard security headers and access controls.
          </S>

          <S n="8" title="Your Rights (DPDP Act)">
            Under India's Digital Personal Data Protection Act, you can: request a copy of your data; correct inaccurate data; delete your account and associated personal data; withdraw consent for location sharing at any time (by stopping sharing or not accepting jobs). Contact support to exercise these rights.
          </S>

          <S n="9" title="Data Retention">
            Active account data is kept while your account exists. If you delete your account, personal data is removed within 30 days, except records we must keep for legal or fraud-prevention purposes.
          </S>

          <S n="10" title="Cookies & Sessions">
            We use a login token stored on your device to keep you signed in. We do not use advertising or third-party tracking cookies.
          </S>

          <S n="11" title="Children">
            The Platform is for users 18 and above. We do not knowingly collect data from minors.
          </S>

          <S n="12" title="Changes & Contact">
            We may update this policy; continued use means acceptance. Questions or data requests: contact us via the support section or in-app report feature.
          </S>

          <hr className="il-divider" />
          <p style={{ margin: 0, fontSize: 12, color: 'var(--text-tertiary)', textAlign: 'center' }}>
            © 2026 Instant Worker. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}