import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';
import AppShell from '../components/AppShell';
import '../styles/theme.css';

// FAQ content is fully translated per language below — selected in the
// component based on the current language.
const SUPPORT = {
  email:    'sarveshthokala1625@gmail.com',
  phone:    '+91 93906 83569',
  whatsapp: '919390683569',
  hours:    'Mon–Sat, 9 AM – 7 PM IST',
};

// FAQ content, fully translated per language — selected in the component
// below based on the current language, not machine-translated on the fly.
const WORKER_FAQS = {
  en: [
    { q: 'How do I receive job requests?', a: 'Make sure your status is "Online" on the dashboard and your skill and city are filled in your profile. Matching jobs will appear in Find Work, and urgent jobs will alert you instantly.' },
    { q: 'Can I reject a job?', a: 'Yes. You are never forced to accept. Simply do not apply, or if you already applied and changed your mind, message the job poster in chat before work starts.' },
    { q: 'How do I update my location?', a: 'Your live location is shared automatically only while a job is active, so the poster can see you are on the way. It stops when work is completed. To change your city or area, go to My Profile → Edit Profile.' },
    { q: 'When will I receive my earnings?', a: 'Payment happens directly between you and the job poster — cash or UPI, whatever you agree. Instant Worker takes no commission. Your Wallet page records every completed job so you have proof of the amount.' },
    { q: 'What if the poster refuses to pay?', a: 'Report them immediately using the Report button on their profile. Our team reviews every report and bans posters with verified payment complaints. Always agree on the wage in chat before starting work — it protects you.' },
    { q: 'How do I update my profile?', a: 'Go to My Profile in the sidebar (or bottom nav on phone), then tap Edit Profile. You can change your name, skill, daily wage, city, languages, and photo.' },
    { q: 'I cannot read or type well. Can I still use this?', a: 'Yes — that is exactly who we built this for. You can search jobs by speaking, and job details can be read aloud. You only need your name, phone number, and an OTP to register.' },
  ],
  hi: [
    { q: 'मुझे काम के अनुरोध कैसे मिलेंगे?', a: 'सुनिश्चित करें कि डैशबोर्ड पर आपकी स्थिति "ऑनलाइन" है और आपकी प्रोफाइल में काम और शहर भरा हुआ है। मिलते-जुलते काम Find Work में दिखेंगे, और तुरंत वाले काम की सूचना आपको तुरंत मिलेगी।' },
    { q: 'क्या मैं कोई काम मना कर सकता हूं?', a: 'हां। आपको कभी भी स्वीकार करने के लिए मजबूर नहीं किया जाता। बस आवेदन न करें, या अगर आपने पहले ही आवेदन किया है और अपना मन बदल लिया है, तो काम शुरू होने से पहले चैट में काम देने वाले को बताएं।' },
    { q: 'मैं अपनी लोकेशन कैसे बदलूं?', a: 'आपकी लाइव लोकेशन सिर्फ़ तभी अपने आप शेयर होती है जब कोई काम चालू हो, ताकि काम देने वाला देख सके कि आप रास्ते में हैं। काम पूरा होते ही यह बंद हो जाती है। अपना शहर या इलाका बदलने के लिए, मेरी प्रोफाइल → प्रोफाइल बदलें में जाएं।' },
    { q: 'मुझे मेरी कमाई कब मिलेगी?', a: 'भुगतान सीधे आपके और काम देने वाले के बीच होता है — नकद या UPI, जो भी आप तय करें। Instant Worker कोई कमीशन नहीं लेता। आपका वॉलेट पेज हर पूरे किए काम को रिकॉर्ड करता है ताकि आपके पास राशि का सबूत हो।' },
    { q: 'अगर काम देने वाला भुगतान करने से मना कर दे तो?', a: 'तुरंत उनकी प्रोफाइल पर Report बटन से रिपोर्ट करें। हमारी टीम हर रिपोर्ट की जांच करती है और सत्यापित भुगतान शिकायतों वाले पोस्टरों को बैन करती है। काम शुरू करने से पहले हमेशा चैट में मजदूरी तय कर लें — यह आपकी सुरक्षा करता है।' },
    { q: 'मैं अपनी प्रोफाइल कैसे बदलूं?', a: 'साइडबार में मेरी प्रोफाइल पर जाएं (फ़ोन पर नीचे के मेन्यू में), फिर प्रोफाइल बदलें पर टैप करें। आप अपना नाम, काम, दैनिक मजदूरी, शहर, भाषाएं, और फ़ोटो बदल सकते हैं।' },
    { q: 'मुझे ठीक से पढ़ना या टाइप करना नहीं आता। क्या मैं फिर भी इसका उपयोग कर सकता हूं?', a: 'हां — हमने इसे बिल्कुल आपके जैसे लोगों के लिए बनाया है। आप बोलकर काम खोज सकते हैं, और काम की जानकारी सुनी जा सकती है। रजिस्टर करने के लिए आपको सिर्फ़ अपना नाम, फ़ोन नंबर, और एक OTP चाहिए।' },
  ],
  te: [
    { q: 'నాకు పని అభ్యర్థనలు ఎలా వస్తాయి?', a: 'డాష్‌బోర్డ్‌లో మీ స్థితి "ఆన్‌లైన్"గా ఉందని మరియు మీ ప్రొఫైల్‌లో మీ నైపుణ్యం మరియు నగరం నింపబడి ఉన్నాయని నిర్ధారించుకోండి. సరిపోలే పనులు Find Work లో కనిపిస్తాయి, మరియు అత్యవసర పనుల నోటిఫికేషన్ మీకు వెంటనే వస్తుంది.' },
    { q: 'నేను ఒక పనిని తిరస్కరించవచ్చా?', a: 'అవును. మిమ్మల్ని ఎప్పుడూ అంగీకరించమని బలవంతం చేయరు. దరఖాస్తు చేయకండి, లేదా మీరు ఇప్పటికే దరఖాస్తు చేసి మీ మనసు మార్చుకుంటే, పని మొదలవ్వకముందే చాట్‌లో పని ఇచ్చినవారికి చెప్పండి.' },
    { q: 'నా లొకేషన్‌ను ఎలా అప్‌డేట్ చేయాలి?', a: 'పని ఇచ్చినవారు మీరు వస్తున్నారని చూడగలిగేలా, పని జరుగుతున్నప్పుడు మాత్రమే మీ లైవ్ లొకేషన్ స్వయంచాలకంగా షేర్ అవుతుంది. పని పూర్తయినప్పుడు ఇది ఆగిపోతుంది. మీ నగరం లేదా ప్రాంతం మార్చడానికి, నా ప్రొఫైల్ → ప్రొఫైల్ మార్చండి కి వెళ్ళండి.' },
    { q: 'నా సంపాదన నాకు ఎప్పుడు వస్తుంది?', a: 'చెల్లింపు నేరుగా మీకు మరియు పని ఇచ్చినవారికి మధ్య జరుగుతుంది — నగదు లేదా UPI, మీరు అంగీకరించినది ఏదైనా. Instant Worker ఎలాంటి కమీషన్ తీసుకోదు. మీ వాలెట్ పేజీ ప్రతి పూర్తయిన పనిని రికార్డ్ చేస్తుంది కాబట్టి మీ వద్ద మొత్తానికి రుజువు ఉంటుంది.' },
    { q: 'పోస్టర్ చెల్లించడానికి నిరాకరిస్తే?', a: 'వెంటనే వారి ప్రొఫైల్‌లో Report బటన్‌తో రిపోర్ట్ చేయండి. మా బృందం ప్రతి రిపోర్ట్‌ను సమీక్షిస్తుంది మరియు ధృవీకరించిన చెల్లింపు ఫిర్యాదులు ఉన్న పోస్టర్లను నిషేధిస్తుంది. పని మొదలుపెట్టే ముందు ఎల్లప్పుడూ చాట్‌లో వేతనాన్ని అంగీకరించండి — ఇది మిమ్మల్ని రక్షిస్తుంది.' },
    { q: 'నా ప్రొఫైల్‌ను ఎలా అప్‌డేట్ చేయాలి?', a: 'సైడ్‌బార్‌లో (ఫోన్‌లో దిగువ మెనూలో) నా ప్రొఫైల్‌కి వెళ్ళి, ప్రొఫైల్ మార్చండి నొక్కండి. మీరు మీ పేరు, నైపుణ్యం, రోజు కూలి, నగరం, భాషలు మరియు ఫోటోను మార్చవచ్చు.' },
    { q: 'నాకు సరిగ్గా చదవడం లేదా టైప్ చేయడం రాదు. నేను దీన్ని ఉపయోగించవచ్చా?', a: 'అవును — మేము దీన్ని మీలాంటి వారి కోసమే తయారు చేసాము. మీరు మాట్లాడి పనులను వెతకవచ్చు, మరియు పని వివరాలు వినిపించవచ్చు. నమోదు చేయడానికి మీకు కేవలం మీ పేరు, ఫోన్ నంబర్ మరియు OTP మాత్రమే కావాలి.' },
  ],
};

const USER_FAQS = {
  en: [
    { q: 'How do I post a job?', a: 'Tap Post a Job, fill in the work needed, skill required, city, daily wage, and start date. For urgent work, choose "Urgent" — nearby available workers are alerted instantly and the first to accept is auto-confirmed.' },
    { q: 'How do I find the right worker?', a: 'Use Find Workers to browse by skill, city, and availability. Check their rating, past work photos in their portfolio, and whether they have a verified ID badge before hiring.' },
    { q: 'Can I track the worker on the way?', a: 'Yes. Once you accept a worker, a "Track worker live" button appears on that job card in My Job Posts. You can see them on a map with an estimated arrival time — like tracking a cab.' },
    { q: 'How do I pay the worker?', a: 'Payment is direct between you and the worker — cash or UPI, whatever you both agree. Instant Worker takes no commission. Your Wallet page records every completed job for your reference.' },
    { q: 'What if a worker does not turn up?', a: 'Report them using the Report button on their profile. Our team reviews every report. Workers with repeated no-show complaints are suspended or banned from the platform.' },
    { q: 'Is the worker verified?', a: 'Workers can optionally submit government ID for verification. A green "Verified" badge on their profile means our team checked their document. Always also check their rating and reviews.' },
    { q: 'How do I close a job post?', a: 'Go to My Job Posts and tap Close on the job. Once all workers you needed are accepted, the job closes automatically.' },
  ],
  hi: [
    { q: 'मैं काम कैसे पोस्ट करूं?', a: 'काम पोस्ट करें पर टैप करें, ज़रूरी काम, चाहिए काम, शहर, दैनिक मजदूरी, और शुरू होने की तारीख भरें। तुरंत वाले काम के लिए "Urgent" चुनें — पास के उपलब्ध मजदूरों को तुरंत सूचना मिलती है और पहले स्वीकार करने वाला अपने आप पुष्ट हो जाता है।' },
    { q: 'मैं सही मजदूर कैसे ढूंढूं?', a: 'काम, शहर, और उपलब्धता के अनुसार देखने के लिए Find Workers का उपयोग करें। काम पर रखने से पहले उनकी रेटिंग, पोर्टफोलियो में पुराने काम की फ़ोटो, और सत्यापित ID बैज है या नहीं, ज़रूर देखें।' },
    { q: 'क्या मैं मजदूर को रास्ते में ट्रैक कर सकता हूं?', a: 'हां। एक बार जब आप किसी मजदूर को स्वीकार कर लेते हैं, तो My Job Posts में उस काम पर "मजदूर को ट्रैक करें" बटन दिखता है। आप उन्हें मैप पर अनुमानित पहुंचने के समय के साथ देख सकते हैं — जैसे कैब ट्रैक करना।' },
    { q: 'मैं मजदूर को भुगतान कैसे करूं?', a: 'भुगतान सीधे आपके और मजदूर के बीच होता है — नकद या UPI, जो भी आप दोनों तय करें। Instant Worker कोई कमीशन नहीं लेता। आपका वॉलेट पेज आपके संदर्भ के लिए हर पूरे किए काम को रिकॉर्ड करता है।' },
    { q: 'अगर मजदूर नहीं आता तो?', a: 'उनकी प्रोफाइल पर Report बटन से रिपोर्ट करें। हमारी टीम हर रिपोर्ट की जांच करती है। बार-बार न आने की शिकायत वाले मजदूरों को प्लेटफ़ॉर्म से निलंबित या बैन किया जाता है।' },
    { q: 'क्या मजदूर सत्यापित है?', a: 'मजदूर चाहें तो सत्यापन के लिए सरकारी ID जमा कर सकते हैं। उनकी प्रोफाइल पर हरा "सत्यापित" बैज इसका मतलब है कि हमारी टीम ने उनका दस्तावेज़ जांचा है। हमेशा उनकी रेटिंग और समीक्षाएं भी ज़रूर देखें।' },
    { q: 'मैं काम पोस्ट कैसे बंद करूं?', a: 'My Job Posts में जाएं और उस काम पर Close टैप करें। जब आपके ज़रूरी सभी मजदूर स्वीकार हो जाते हैं, तो काम अपने आप बंद हो जाता है।' },
  ],
  te: [
    { q: 'నేను పనిని ఎలా పోస్ట్ చేయాలి?', a: 'పని పోస్ట్ చేయండి నొక్కండి, అవసరమైన పని, నైపుణ్యం, నగరం, రోజు కూలి, మరియు ప్రారంభ తేదీని నింపండి. అత్యవసర పని కోసం "Urgent" ఎంచుకోండి — సమీపంలో అందుబాటులో ఉన్న కార్మికులకు వెంటనే తెలియజేయబడుతుంది మరియు మొదట అంగీకరించినవారు స్వయంచాలకంగా నిర్ధారించబడతారు.' },
    { q: 'నేను సరైన కార్మికుడిని ఎలా కనుగొనాలి?', a: 'నైపుణ్యం, నగరం మరియు లభ్యత ప్రకారం చూడటానికి Find Workers ఉపయోగించండి. నియమించుకునే ముందు వారి రేటింగ్, పోర్ట్‌ఫోలియోలో పాత పని ఫోటోలు, మరియు ధృవీకరించిన ID బ్యాడ్జ్ ఉందో లేదో తనిఖీ చేయండి.' },
    { q: 'నేను కార్మికుడిని దారిలో ట్రాక్ చేయవచ్చా?', a: 'అవును. మీరు ఒక కార్మికుడిని అంగీకరించిన తర్వాత, My Job Posts లో ఆ పని కార్డ్‌పై "కార్మికుడిని ట్రాక్ చేయండి" బటన్ కనిపిస్తుంది. మీరు వారిని మ్యాప్‌లో అంచనా వేసిన రాక సమయంతో చూడవచ్చు — క్యాబ్‌ను ట్రాక్ చేసినట్లు.' },
    { q: 'నేను కార్మికుడికి ఎలా చెల్లించాలి?', a: 'చెల్లింపు నేరుగా మీకు మరియు కార్మికుడికి మధ్య జరుగుతుంది — నగదు లేదా UPI, మీరిద్దరూ అంగీకరించినది ఏదైనా. Instant Worker ఎలాంటి కమీషన్ తీసుకోదు. మీ వాలెట్ పేజీ మీ సూచన కోసం ప్రతి పూర్తయిన పనిని రికార్డ్ చేస్తుంది.' },
    { q: 'కార్మికుడు రాకపోతే?', a: 'వారి ప్రొఫైల్‌లో Report బటన్‌తో రిపోర్ట్ చేయండి. మా బృందం ప్రతి రిపోర్ట్‌ను సమీక్షిస్తుంది. పదేపదే రాని ఫిర్యాదులు ఉన్న కార్మికులు ప్లాట్‌ఫారమ్ నుండి సస్పెండ్ లేదా నిషేధించబడతారు.' },
    { q: 'కార్మికుడు ధృవీకరించబడ్డారా?', a: 'కార్మికులు ఐచ్ఛికంగా ధృవీకరణ కోసం ప్రభుత్వ ID సమర్పించవచ్చు. వారి ప్రొఫైల్‌పై ఆకుపచ్చ "ధృవీకరించబడింది" బ్యాడ్జ్ అంటే మా బృందం వారి పత్రాన్ని తనిఖీ చేసిందని అర్థం. ఎల్లప్పుడూ వారి రేటింగ్ మరియు సమీక్షలను కూడా తనిఖీ చేయండి.' },
    { q: 'నేను పని పోస్ట్‌ను ఎలా మూసివేయాలి?', a: 'My Job Posts కి వెళ్ళి ఆ పనిపై Close నొక్కండి. మీకు అవసరమైన కార్మికులందరూ అంగీకరించిన తర్వాత, పని స్వయంచాలకంగా మూసివేయబడుతుంది.' },
  ],
};

export default function Help() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t, lang } = useLang();
  const isWorker = user?.role === 'worker';
  const faqSet = isWorker ? WORKER_FAQS : USER_FAQS;
  const faqs = faqSet[lang] || faqSet.en;

  const [open, setOpen] = useState(null);

  return (
    <AppShell>
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '22px 18px 30px' }}>

        <h1 style={{ margin: '0 0 4px', fontSize: 24, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: 9 }}>
          <i className="ti ti-headset" style={{ fontSize: 26, color: 'var(--primary-dark)' }} aria-hidden="true"></i>
          {t('helpTitle')}
        </h1>
        <p style={{ margin: '0 0 22px', fontSize: 13.5, color: 'var(--text-secondary)' }}>{t('helpTagline')}</p>

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
              <p style={{ margin: 0, fontSize: 17, fontWeight: 800, color: '#fff' }}>{t('chatWithUs')}</p>
              <p style={{ margin: '2px 0 0', fontSize: 13.5, color: 'rgba(255,255,255,.9)' }}>{t('whatsappSupport')}</p>
              <p style={{ margin: '2px 0 0', fontSize: 11.5, color: 'rgba(255,255,255,.7)' }}>{t('fastestResponse')}</p>
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
              <p style={{ margin: 0, fontSize: 17, fontWeight: 800, color: '#fff' }}>{t('callSupport')}</p>
              <p style={{ margin: '2px 0 0', fontSize: 13.5, color: 'rgba(255,255,255,.9)' }}>{SUPPORT.phone}</p>
              <p style={{ margin: '2px 0 0', fontSize: 11.5, color: 'rgba(255,255,255,.7)' }}>{SUPPORT.hours}</p>
            </div>
            <i className="ti ti-chevron-right" style={{ fontSize: 22, color: 'rgba(255,255,255,.7)' }} aria-hidden="true"></i>
          </a>
        </div>

        <a href={`mailto:${SUPPORT.email}`} className="il-card" style={{
          padding: '15px 20px', marginBottom: 26, textDecoration: 'none',
          display: 'flex', alignItems: 'center', gap: 13,
        }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--surface)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <i className="ti ti-mail" style={{ fontSize: 20, color: 'var(--text-secondary)' }} aria-hidden="true"></i>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: 13.5, fontWeight: 700, color: 'var(--text)' }}>{t('emailUs')}</p>
            <p style={{ margin: 0, fontSize: 12, color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{SUPPORT.email}</p>
          </div>
          <i className="ti ti-external-link" style={{ fontSize: 17, color: 'var(--text-tertiary)' }} aria-hidden="true"></i>
        </a>

        <p style={{ margin: '0 0 14px', fontSize: 16, fontWeight: 800, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <i className="ti ti-help-circle" style={{ fontSize: 20, color: 'var(--primary-dark)' }} aria-hidden="true"></i>
          {t('faqTitle')}
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

        <div className="il-card il-card-pad" style={{ textAlign: 'center' }}>
          <div style={{ width: 50, height: 50, borderRadius: 14, background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
            <i className="ti ti-message-2-question" style={{ fontSize: 25, color: 'var(--primary-dark)' }} aria-hidden="true"></i>
          </div>
          <p style={{ margin: '0 0 6px', fontSize: 16, fontWeight: 800, color: 'var(--text)' }}>{t('needMoreHelp')}</p>
          <p style={{ margin: '0 0 18px', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65, maxWidth: 420, marginLeft: 'auto', marginRight: 'auto' }}>
            Our support team is available {SUPPORT.hours} to help with any question or problem.
            For urgent safety issues, use the in-app Report button — those are reviewed on priority.
          </p>
          <a href={`https://wa.me/${SUPPORT.whatsapp}?text=Hi%2C%20I%20need%20help%20with%20Instant%20Worker`}
             target="_blank" rel="noopener noreferrer" className="il-btn il-btn-primary">
            <i className="ti ti-brand-whatsapp" style={{ fontSize: 18 }} aria-hidden="true"></i>
            {t('messageOnWhatsapp')}
          </a>
        </div>

        <div style={{ display: 'flex', gap: 18, justifyContent: 'center', marginTop: 24, flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/terms')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} className="il-link">{t('termsConditions')}</button>
          <button onClick={() => navigate('/privacy')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} className="il-link">{t('privacyPolicy')}</button>
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