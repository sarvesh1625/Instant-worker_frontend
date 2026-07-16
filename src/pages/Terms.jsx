import { useNavigate } from 'react-router-dom';
import '../styles/theme.css';

export default function Terms() {
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
          <h1 className="il-topbar-title">Terms & Conditions</h1>
        </div>
      </div>

      <div className="il-shell" style={{ maxWidth: 760 }}>
        <div className="il-card il-card-pad">
          <p className="il-muted" style={{ margin: '0 0 20px', fontSize: 12.5 }}>
            Last updated: June 2026 · Instant Worker ("the Platform")
          </p>

          <S n="1" title="Acceptance of Terms">
            By creating an account on Instant Worker, you agree to these Terms & Conditions and our Privacy Policy. If you do not agree, please do not use the Platform.
          </S>

          <S n="2" title="Who Can Use the Platform">
            You must be at least 18 years old to register. You agree to provide accurate information including your real name and a mobile number that belongs to you, verified via OTP at registration.
          </S>

          <S n="3" title="Our Role">
            Instant Worker is a connecting platform between workers, contractors, vendors, and customers. We do not employ workers, and we are not a party to any work agreement, wage negotiation, or payment made between users. Users are responsible for verifying each other's suitability before entering into any work arrangement.
          </S>

          <S n="4" title="Location Sharing">
            When a worker is accepted for a job, the worker's live GPS location is shared with the job poster while the job is active, so the poster can see the worker's arrival. Location sharing stops automatically when the work is completed or can be stopped manually by the worker at any time. By using the Platform, workers consent to this location sharing during active jobs.
          </S>

          <S n="5" title="Chat and Communication">
            Chat between users unlocks only after a job application is accepted. Chat metadata is logged for safety. If a user reports a conversation, the reported conversation may be reviewed by our safety team to investigate fraud, harassment, or abuse, in accordance with India's Digital Personal Data Protection (DPDP) Act.
          </S>

          <S n="6" title="Prohibited Conduct">
            You agree not to: post fake jobs or fake profiles; harass, abuse, or defraud other users; ask for advance payments before work begins; share other users' personal information outside the Platform; use the Platform for any illegal activity. Violations may lead to account suspension or permanent ban.
          </S>

          <S n="7" title="ID Verification">
            Workers may submit government ID for verification to receive a verified badge. ID documents are visible only to our verification team and are never shown publicly. Verification does not guarantee a user's conduct — always exercise your own judgement.
          </S>

          <S n="8" title="Ratings and Reviews">
            Reviews must be honest and based on real work experience. Fake, abusive, or paid reviews will be removed, and repeat offenders may be banned.
          </S>

          <S n="9" title="Payments">
            All wage payments are currently made directly between users. Instant Worker is not responsible for payment disputes. We strongly recommend agreeing on wages in writing (chat) before work begins.
          </S>

          <S n="10" title="Account Suspension">
            We may suspend or terminate accounts that violate these terms, receive repeated verified reports, or engage in fraudulent activity, with or without prior notice.
          </S>

          <S n="11" title="Limitation of Liability">
            The Platform is provided "as is". To the maximum extent permitted by law, Instant Worker is not liable for any loss, injury, dispute, or damage arising from work arrangements made between users.
          </S>

          <S n="12" title="Changes to These Terms">
            We may update these terms from time to time. Continued use of the Platform after changes means you accept the updated terms.
          </S>

          <S n="13" title="Contact">
            For questions about these terms or to report a problem, contact us through the in-app report feature or the support section.
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