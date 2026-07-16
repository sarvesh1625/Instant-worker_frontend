import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AppShell from '../components/AppShell';
import '../styles/theme.css';

const SUPPORT = {
  email:    'sarveshthokala1625@gmail.com',
  phone:    '+91 93906 83569',
  whatsapp: '919390683569',
  hours:    'Mon–Sat, 9 AM – 7 PM IST',
};

const WORKER_FAQS = [
  { q: 'How do I receive job requests?', a: 'Make sure your status is "Online" on the dashboard and your skill and city are filled in your profile. Matching jobs will appear in Find Work, and urgent jobs will alert you instantly.' },
  { q: 'Can I reject a job?', a: 'Yes. You are never forced to accept. Simply do not apply, or if you already applied and changed your mind, message the job poster in chat before work starts.' },
  { q: 'How do I update my location?', a: 'Your live location is shared automatically only while a job is active, so the poster can see you are on the way. It stops when work is completed. To change your city or area, go to My Profile → Edit Profile.' },
  { q: 'When will I receive my earnings?', a: 'Payment happens directly between you and the job poster — cash or UPI, whatever you agree. Instant Worker takes no commission. Your Wallet page records every completed job so you have proof of the amount.' },
  { q: 'What if the poster refuses to pay?', a: 'Report them immediately using the Report button on their profile. Our team reviews every report and bans posters with verified payment complaints. Always agree on the wage in chat before starting work — it protects you.' },
  { q: 'How do I update my profile?', a: 'Go to My Profile in the sidebar (or bottom nav on phone), then tap Edit Profile. You can change your name, skill, daily wage, city, languages, and photo.' },
  { q: 'I cannot read or type well. Can I still use this?', a: 'Yes — that is exactly who we built this for. You can search jobs by speaking, and job details can be read aloud. You only need your name, phone number, and an OTP to register.' },
];

const USER_FAQS = [
  { q: 'How do I post a job?', a: 'Tap Post a Job, fill in the work needed, skill required, city, daily wage, and start date. For urgent work, choose "Urgent" — nearby available workers are alerted instantly and the first to accept is auto-confirmed.' },
  { q: 'How do I find the right worker?', a: 'Use Find Workers to browse by skill, city, and availability. Check their rating, past work photos in their portfolio, and whether they have a verified ID badge before hiring.' },
  { q: 'Can I track the worker on the way?', a: 'Yes. Once you accept a worker, a "Track worker live" button appears on that job card in My Job Posts. You can see them on a map with an estimated arrival time — like tracking a cab.' },
  { q: 'How do I pay the worker?', a: 'Payment is direct between you and the worker — cash or UPI, whatever you both agree. Instant Worker takes no commission. Your Wallet page records every completed job for your reference.' },
  { q: 'What if a worker does not turn up?', a: 'Report them using the Report button on their profile. Our team reviews every report. Workers with repeated no-show complaints are suspended or banned from the platform.' },
  { q: 'Is the worker verified?', a: 'Workers can optionally submit government ID for verification. A green "Verified" badge on their profile means our team checked their document. Always also check their rating and reviews.' },
  { q: 'How do I close a job post?', a: 'Go to My Job Posts and tap Close on the job. Once all workers you needed are accepted, the job closes automatically.' },
];

export default function Help() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isWorker = user?.role === 'worker';
  const faqs = isWorker ? WORKER_FAQS : USER_FAQS;

  const [open, setOpen] = useState(null);

  return (
    <AppShell>
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '22px 18px 30px' }}>

        <h1 style={{ margin: '0 0 4px', fontSize: 24, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: 9 }}>
          <i className="ti ti-headset" style={{ fontSize: 26, color: 'var(--primary-dark)' }} aria-hidden="true"></i>
          Help & Support
        </h1>
        <p style={{ margin: '0 0 22px', fontSize: 13.5, color: 'var(--text-secondary)' }}>Sahayata — we are here to help</p>

        {/* ── Contact cards ── */}
        <div className="help-contacts" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 14, marginBottom: 26 }}>

          <a href={`https://wa.me/${SUPPORT.whatsapp}?text=Hi%2C%20I%20need%20help%20with%20Instant%20Worker`}
             target="_blank" rel="noopener noreferrer"
             style={{
               background: 'linear-gradient(135deg, #059669, #10B981)',
               borderRadius: 18, padding: '22px 24px', textDecoration: 'none',
               display: 'flex', alignItems: 'center', gap: 16,
               boxShadow: '0 8px 22px rgba(16,185,129,.3)',
               transition: 'transform .15s',
             }}
             onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
             onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
            <div style={{ width: 54, height: 54, borderRadius: 16, background: 'rgba(255,255,255,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <i className="ti ti-brand-whatsapp" style={{ fontSize: 28, color: '#fff' }} aria-hidden="true"></i>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: 17, fontWeight: 800, color: '#fff' }}>Chat with Us</p>
              <p style={{ margin: '2px 0 0', fontSize: 13.5, color: 'rgba(255,255,255,.9)' }}>WhatsApp Support</p>
              <p style={{ margin: '2px 0 0', fontSize: 11.5, color: 'rgba(255,255,255,.7)' }}>Fastest response</p>
            </div>
            <i className="ti ti-chevron-right" style={{ fontSize: 22, color: 'rgba(255,255,255,.7)' }} aria-hidden="true"></i>
          </a>

          <a href={`tel:${SUPPORT.phone.replace(/\s/g, '')}`}
             style={{
               background: 'linear-gradient(135deg, #EA580C, #F97316)',
               borderRadius: 18, padding: '22px 24px', textDecoration: 'none',
               display: 'flex', alignItems: 'center', gap: 16,
               boxShadow: '0 8px 22px rgba(249,115,22,.3)',
               transition: 'transform .15s',
             }}
             onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
             onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
            <div style={{ width: 54, height: 54, borderRadius: 16, background: 'rgba(255,255,255,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <i className="ti ti-phone" style={{ fontSize: 28, color: '#fff' }} aria-hidden="true"></i>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: 17, fontWeight: 800, color: '#fff' }}>Call Support</p>
              <p style={{ margin: '2px 0 0', fontSize: 13.5, color: 'rgba(255,255,255,.9)' }}>{SUPPORT.phone}</p>
              <p style={{ margin: '2px 0 0', fontSize: 11.5, color: 'rgba(255,255,255,.7)' }}>{SUPPORT.hours}</p>
            </div>
            <i className="ti ti-chevron-right" style={{ fontSize: 22, color: 'rgba(255,255,255,.7)' }} aria-hidden="true"></i>
          </a>
        </div>

        {/* ── Email strip ── */}
        <a href={`mailto:${SUPPORT.email}`} className="il-card" style={{
          padding: '15px 20px', marginBottom: 26, textDecoration: 'none',
          display: 'flex', alignItems: 'center', gap: 13,
        }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--surface)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <i className="ti ti-mail" style={{ fontSize: 20, color: 'var(--text-secondary)' }} aria-hidden="true"></i>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: 13.5, fontWeight: 700, color: 'var(--text)' }}>Email us</p>
            <p style={{ margin: 0, fontSize: 12, color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{SUPPORT.email}</p>
          </div>
          <i className="ti ti-external-link" style={{ fontSize: 17, color: 'var(--text-tertiary)' }} aria-hidden="true"></i>
        </a>

        {/* ── FAQ ── */}
        <p style={{ margin: '0 0 14px', fontSize: 16, fontWeight: 800, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <i className="ti ti-help-circle" style={{ fontSize: 20, color: 'var(--primary-dark)' }} aria-hidden="true"></i>
          Frequently Asked Questions
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 26 }}>
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={i} className="il-card" style={{
                overflow: 'hidden',
                borderColor: isOpen ? 'var(--primary)' : 'var(--border)',
                background: '#fff',
              }}>
                <button onClick={() => setOpen(isOpen ? null : i)} style={{
                  width: '100%', background: 'none', border: 'none', cursor: 'pointer',
                  padding: '16px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  gap: 12, textAlign: 'left', fontFamily: 'var(--font)',
                }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: isOpen ? 'var(--primary-dark)' : 'var(--text)' }}>{f.q}</span>
                  <span style={{
                    width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                    background: isOpen ? 'var(--primary)' : 'var(--primary-light)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all .15s',
                  }}>
                    <i className={`ti ${isOpen ? 'ti-minus' : 'ti-plus'}`}
                       style={{ fontSize: 14, color: isOpen ? '#fff' : 'var(--primary-dark)' }} aria-hidden="true"></i>
                  </span>
                </button>
                {isOpen && (
                  <div style={{ padding: '0 18px 16px' }}>
                    <p style={{ margin: 0, fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.75 }}>{f.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── Need more help ── */}
        <div className="il-card il-card-pad" style={{ textAlign: 'center' }}>
          <div style={{ width: 50, height: 50, borderRadius: 14, background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
            <i className="ti ti-message-2-question" style={{ fontSize: 25, color: 'var(--primary-dark)' }} aria-hidden="true"></i>
          </div>
          <p style={{ margin: '0 0 6px', fontSize: 16, fontWeight: 800, color: 'var(--text)' }}>Need more help?</p>
          <p style={{ margin: '0 0 18px', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65, maxWidth: 420, marginLeft: 'auto', marginRight: 'auto' }}>
            Our support team is available {SUPPORT.hours} to help with any question or problem.
            For urgent safety issues, use the in-app Report button — those are reviewed on priority.
          </p>
          <a href={`https://wa.me/${SUPPORT.whatsapp}?text=Hi%2C%20I%20need%20help%20with%20Instant%20Worker`}
             target="_blank" rel="noopener noreferrer" className="il-btn il-btn-primary">
            <i className="ti ti-brand-whatsapp" style={{ fontSize: 18 }} aria-hidden="true"></i>
            Message us on WhatsApp
          </a>
        </div>

        {/* ── Legal links ── */}
        <div style={{ display: 'flex', gap: 18, justifyContent: 'center', marginTop: 24, flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/terms')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} className="il-link">Terms & Conditions</button>
          <button onClick={() => navigate('/privacy')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} className="il-link">Privacy Policy</button>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .help-contacts { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </AppShell>
  );
}