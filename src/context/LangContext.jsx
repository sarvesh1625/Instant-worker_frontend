import { createContext, useContext, useState, useEffect } from 'react';

const LangContext = createContext();

export const useLang = () => {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used inside <LangProvider>');
  return ctx;
};

export const LANGUAGES = [
  { code: 'en', label: 'EN', full: 'English' },
  { code: 'hi', label: 'हि',  full: 'हिन्दी' },
  { code: 'te', label: 'తె',  full: 'తెలుగు' },
];

const STRINGS = {
  en: {
    dashboard: 'Dashboard', findWork: 'Find Work', myWork: 'My Work',
    wallet: 'Wallet', history: 'History', messages: 'Messages',
    portfolio: 'Portfolio', notifications: 'Notifications',
    myProfile: 'My Profile', verification: 'Verification', help: 'Help',
    logout: 'Logout', postJob: 'Post a Job', myJobPosts: 'My Job Posts',
    findWorkers: 'Find Workers', home: 'Home', profile: 'Profile',
    save: 'Save', cancel: 'Cancel', edit: 'Edit', delete: 'Delete',
    select: 'Select', search: 'Search', apply: 'Apply', loading: 'Loading...',
    back: 'Back', submit: 'Submit', close: 'Close', confirm: 'Confirm',
    yourSkill: 'Your skill', city: 'City', area: 'Area',
    experience: 'Experience (years)', dailyWage: 'Daily wage (₹)',
    available: 'I am available for work', aboutYou: 'About yourself',
    languages: 'Languages', fullName: 'Full name', phoneNumber: 'Phone number',
    age: 'Age', gender: 'Gender', saveProfile: 'Save Profile',
    editProfile: 'Edit Profile', yourRating: 'Your Rating',
    browseJobs: 'Browse jobs', noJobs: 'No jobs available right now',
    jobsAvailable: 'jobs available', perDay: 'per day',
    workersNeeded: 'workers needed', applied: 'Applied', accepted: 'Accepted',
    urgent: 'URGENT', acceptNow: 'Accept now', jobPoster: 'Job poster',
    notStarted: 'Waiting to start', inProgress: 'Work in progress',
    completed: 'Work completed', markStarted: 'Mark Work as Started',
    markCompleted: 'Mark Work as Completed', trackWorker: 'Track worker live',
    rateWorker: 'Rate Worker', rateContractor: 'Rate this poster',
    online: "You're Online", offline: "You're Offline",
    goOnline: 'Go Online', goOffline: 'Go Offline',
    readyForWork: 'Ready to receive job requests',
    notReceiving: 'You will not receive new job alerts',
    totalEarned: 'Total earned', totalPaid: 'Total paid',
    monthlyEarnings: 'Monthly earnings', averagePerJob: 'Average per job',
    jobsDone: 'Jobs done', noRecords: 'No records yet',
    goodMorning: 'Good morning', goodAfternoon: 'Good afternoon',
    goodEvening: 'Good evening', quickActions: 'Quick actions',

    // ── NEW: Dashboard ──
    jobsPosted: 'Jobs posted', rating: 'Rating', worker: 'Worker', user: 'User',
    readyToReceive: (skill) => `Ready to receive ${skill} job requests`,
    findWorkTitle: 'Browse Jobs',      findWorkSub: 'Kaam dhundo',
    myWorkTitle: 'My Work',            myWorkSub: 'Mera kaam',
    portfolioTitle: 'Portfolio',       portfolioSub: 'Kaam ki photos',
    verificationTitle: 'Verification', verificationSub: 'ID verify karo',
    postJobTitle: 'Post a Job',        postJobSub: 'Kaam post karo',
    myJobPostsTitle: 'My Job Posts',   myJobPostsSub: 'Mere jobs',
    findWorkersTitle: 'Find Workers',  findWorkersSub: 'Worker dhundo',

    // ── NEW: Common actions/labels used across many pages ──
    filters: 'Filters', clear: 'Clear', clearFilters: 'Clear filters',
    allSkills: 'All skills', allCities: 'All cities', allTypes: 'All types',
    regular: 'Regular', partTime: 'Part-time', urgentOnly: 'Urgent only',
    searchJobs: 'Search jobs', voiceSearch: 'Voice search',
    noJobsFound: 'No jobs available right now', tryRemovingFilters: 'Try removing some filters, or check back soon',
    willNotify: 'We will notify you when a new job matches your skill',
    jobFull: 'Job Full', call: 'Call', chat: 'Chat',
    postedBy: 'Posted by', kmAway: 'km away',
    showingWithin: (km) => `Showing jobs within ${km}km of you`,
    noJobsExpanded: (km) => `No jobs within 6km — showing up to ${km}km instead`,
    locationDenied: 'Location access denied — showing jobs by city/skill filter instead',
  },
  hi: {
    dashboard: 'डैशबोर्ड', findWork: 'काम ढूंढो', myWork: 'मेरा काम',
    wallet: 'वॉलेट', history: 'इतिहास', messages: 'संदेश',
    portfolio: 'पोर्टफोलियो', notifications: 'सूचनाएं',
    myProfile: 'मेरी प्रोफाइल', verification: 'सत्यापन', help: 'सहायता',
    logout: 'लॉग आउट', postJob: 'काम पोस्ट करें', myJobPosts: 'मेरे काम',
    findWorkers: 'मजदूर ढूंढो', home: 'होम', profile: 'प्रोफाइल',
    save: 'सेव करें', cancel: 'रद्द करें', edit: 'बदलें', delete: 'हटाएं',
    select: 'चुनें', search: 'खोजें', apply: 'आवेदन करें', loading: 'लोड हो रहा है...',
    back: 'वापस', submit: 'जमा करें', close: 'बंद करें', confirm: 'पुष्टि करें',
    yourSkill: 'आपका काम', city: 'शहर', area: 'इलाका',
    experience: 'अनुभव (साल)', dailyWage: 'दैनिक मजदूरी (₹)',
    available: 'मैं काम के लिए उपलब्ध हूं', aboutYou: 'अपने बारे में',
    languages: 'भाषाएं', fullName: 'पूरा नाम', phoneNumber: 'मोबाइल नंबर',
    age: 'उम्र', gender: 'लिंग', saveProfile: 'प्रोफाइल सेव करें',
    editProfile: 'प्रोफाइल बदलें', yourRating: 'आपकी रेटिंग',
    browseJobs: 'काम देखें', noJobs: 'अभी कोई काम उपलब्ध नहीं है',
    jobsAvailable: 'काम उपलब्ध', perDay: 'प्रति दिन',
    workersNeeded: 'मजदूर चाहिए', applied: 'आवेदन किया', accepted: 'स्वीकृत',
    urgent: 'तुरंत', acceptNow: 'अभी स्वीकारें', jobPoster: 'काम देने वाला',
    notStarted: 'शुरू होने का इंतज़ार', inProgress: 'काम चल रहा है',
    completed: 'काम पूरा हुआ', markStarted: 'काम शुरू करें',
    markCompleted: 'काम पूरा करें', trackWorker: 'मजदूर को ट्रैक करें',
    rateWorker: 'मजदूर को रेट करें', rateContractor: 'रेटिंग दें',
    online: 'आप ऑनलाइन हैं', offline: 'आप ऑफलाइन हैं',
    goOnline: 'ऑनलाइन जाएं', goOffline: 'ऑफलाइन जाएं',
    readyForWork: 'काम के लिए तैयार',
    notReceiving: 'आपको नए काम की सूचना नहीं मिलेगी',
    totalEarned: 'कुल कमाई', totalPaid: 'कुल भुगतान',
    monthlyEarnings: 'महीने की कमाई', averagePerJob: 'प्रति काम औसत',
    jobsDone: 'पूरे किए काम', noRecords: 'अभी कोई रिकॉर्ड नहीं',
    goodMorning: 'सुप्रभात', goodAfternoon: 'नमस्कार',
    goodEvening: 'शुभ संध्या', quickActions: 'तेज़ काम',

    jobsPosted: 'पोस्ट किए गए काम', rating: 'रेटिंग', worker: 'मजदूर', user: 'उपयोगकर्ता',
    readyToReceive: (skill) => `${skill} काम के अनुरोध पाने के लिए तैयार`,
    findWorkTitle: 'काम ढूंढो',      findWorkSub: 'नौकरी खोजें',
    myWorkTitle: 'मेरा काम',         myWorkSub: 'मेरा काम देखें',
    portfolioTitle: 'पोर्टफोलियो',    portfolioSub: 'काम की फ़ोटो',
    verificationTitle: 'सत्यापन',    verificationSub: 'ID सत्यापित करें',
    postJobTitle: 'काम पोस्ट करें',   postJobSub: 'काम पोस्ट करो',
    myJobPostsTitle: 'मेरे काम',      myJobPostsSub: 'मेरी पोस्ट',
    findWorkersTitle: 'मजदूर ढूंढो',  findWorkersSub: 'वर्कर ढूंढो',

    filters: 'फ़िल्टर', clear: 'साफ़ करें', clearFilters: 'फ़िल्टर हटाएं',
    allSkills: 'सभी काम', allCities: 'सभी शहर', allTypes: 'सभी प्रकार',
    regular: 'सामान्य', partTime: 'पार्ट-टाइम', urgentOnly: 'सिर्फ़ तुरंत वाले',
    searchJobs: 'काम खोजें', voiceSearch: 'आवाज़ से खोजें',
    noJobsFound: 'अभी कोई काम उपलब्ध नहीं है', tryRemovingFilters: 'कुछ फ़िल्टर हटाएं, या बाद में देखें',
    willNotify: 'नया काम मिलते ही हम आपको बताएंगे',
    jobFull: 'जगह भर गई', call: 'कॉल करें', chat: 'चैट',
    postedBy: 'पोस्ट किया', kmAway: 'किमी दूर',
    showingWithin: (km) => `आपके ${km}किमी के अंदर के काम दिखाए जा रहे हैं`,
    noJobsExpanded: (km) => `6किमी में कोई काम नहीं — अब ${km}किमी तक दिखाया जा रहा है`,
    locationDenied: 'लोकेशन नहीं मिली — शहर/काम के अनुसार दिखाया जा रहा है',
  },
  te: {
    dashboard: 'డాష్‌బోర్డ్', findWork: 'పని వెతకండి', myWork: 'నా పని',
    wallet: 'వాలెట్', history: 'చరిత్ర', messages: 'సందేశాలు',
    portfolio: 'పోర్ట్‌ఫోలియో', notifications: 'నోటిఫికేషన్లు',
    myProfile: 'నా ప్రొఫైల్', verification: 'ధృవీకరణ', help: 'సహాయం',
    logout: 'లాగ్ అవుట్', postJob: 'పని పోస్ట్ చేయండి', myJobPosts: 'నా పనులు',
    findWorkers: 'కార్మికులను వెతకండి', home: 'హోమ్', profile: 'ప్రొఫైల్',
    save: 'సేవ్ చేయండి', cancel: 'రద్దు చేయండి', edit: 'మార్చండి', delete: 'తొలగించండి',
    select: 'ఎంచుకోండి', search: 'వెతకండి', apply: 'దరఖాస్తు చేయండి', loading: 'లోడ్ అవుతోంది...',
    back: 'వెనుకకు', submit: 'సమర్పించండి', close: 'మూసివేయండి', confirm: 'నిర్ధారించండి',
    yourSkill: 'మీ నైపుణ్యం', city: 'నగరం', area: 'ప్రాంతం',
    experience: 'అనుభవం (సంవత్సరాలు)', dailyWage: 'రోజు కూలి (₹)',
    available: 'నేను పనికి అందుబాటులో ఉన్నాను', aboutYou: 'మీ గురించి',
    languages: 'భాషలు', fullName: 'పూర్తి పేరు', phoneNumber: 'మొబైల్ నంబర్',
    age: 'వయస్సు', gender: 'లింగం', saveProfile: 'ప్రొఫైల్ సేవ్ చేయండి',
    editProfile: 'ప్రొఫైల్ మార్చండి', yourRating: 'మీ రేటింగ్',
    browseJobs: 'పనులు చూడండి', noJobs: 'ప్రస్తుతం పనులు అందుబాటులో లేవు',
    jobsAvailable: 'పనులు అందుబాటులో', perDay: 'రోజుకు',
    workersNeeded: 'కార్మికులు కావాలి', applied: 'దరఖాస్తు చేశారు', accepted: 'ఆమోదించబడింది',
    urgent: 'అత్యవసరం', acceptNow: 'ఇప్పుడే అంగీకరించండి', jobPoster: 'పని ఇచ్చేవారు',
    notStarted: 'మొదలవ్వడానికి ఎదురుచూస్తోంది', inProgress: 'పని జరుగుతోంది',
    completed: 'పని పూర్తయింది', markStarted: 'పని మొదలుపెట్టండి',
    markCompleted: 'పని పూర్తి చేయండి', trackWorker: 'కార్మికుడిని ట్రాక్ చేయండి',
    rateWorker: 'కార్మికుడికి రేటింగ్ ఇవ్వండి', rateContractor: 'రేటింగ్ ఇవ్వండి',
    online: 'మీరు ఆన్‌లైన్‌లో ఉన్నారు', offline: 'మీరు ఆఫ్‌లైన్‌లో ఉన్నారు',
    goOnline: 'ఆన్‌లైన్ వెళ్ళండి', goOffline: 'ఆఫ్‌లైన్ వెళ్ళండి',
    readyForWork: 'పని అభ్యర్థనలకు సిద్ధంగా ఉన్నారు',
    notReceiving: 'మీకు కొత్త పని నోటిఫికేషన్లు రావు',
    totalEarned: 'మొత్తం సంపాదన', totalPaid: 'మొత్తం చెల్లింపు',
    monthlyEarnings: 'నెలవారీ సంపాదన', averagePerJob: 'ఒక్కో పనికి సగటు',
    jobsDone: 'పూర్తయిన పనులు', noRecords: 'ఇంకా రికార్డులు లేవు',
    goodMorning: 'శుభోదయం', goodAfternoon: 'నమస్కారం',
    goodEvening: 'శుభ సాయంత్రం', quickActions: 'త్వరిత చర్యలు',

    jobsPosted: 'పోస్ట్ చేసిన పనులు', rating: 'రేటింగ్', worker: 'కార్మికుడు', user: 'వినియోగదారు',
    readyToReceive: (skill) => `${skill} పని అభ్యర్థనలను స్వీకరించడానికి సిద్ధంగా ఉన్నారు`,
    findWorkTitle: 'పనులు చూడండి',    findWorkSub: 'పని వెతకండి',
    myWorkTitle: 'నా పని',            myWorkSub: 'నా పని చూడండి',
    portfolioTitle: 'పోర్ట్‌ఫోలియో',    portfolioSub: 'పని ఫోటోలు',
    verificationTitle: 'ధృవీకరణ',     verificationSub: 'ID ధృవీకరించండి',
    postJobTitle: 'పని పోస్ట్ చేయండి', postJobSub: 'పని పోస్ట్ చేయండి',
    myJobPostsTitle: 'నా పనులు',       myJobPostsSub: 'నా పోస్ట్‌లు',
    findWorkersTitle: 'కార్మికులను వెతకండి', findWorkersSub: 'వర్కర్ వెతకండి',

    filters: 'ఫిల్టర్లు', clear: 'తొలగించు', clearFilters: 'ఫిల్టర్లు తొలగించండి',
    allSkills: 'అన్ని నైపుణ్యాలు', allCities: 'అన్ని నగరాలు', allTypes: 'అన్ని రకాలు',
    regular: 'సాధారణ', partTime: 'పార్ట్-టైమ్', urgentOnly: 'అత్యవసరం మాత్రమే',
    searchJobs: 'పనులు వెతకండి', voiceSearch: 'వాయిస్ సెర్చ్',
    noJobsFound: 'ప్రస్తుతం పనులు అందుబాటులో లేవు', tryRemovingFilters: 'కొన్ని ఫిల్టర్లు తీసివేయండి, లేదా త్వరలో మళ్ళీ చూడండి',
    willNotify: 'కొత్త పని వచ్చినప్పుడు మేము మీకు తెలియజేస్తాము',
    jobFull: 'స్థానం నిండింది', call: 'కాల్ చేయండి', chat: 'చాట్',
    postedBy: 'పోస్ట్ చేసినవారు', kmAway: 'కి.మీ దూరం',
    showingWithin: (km) => `మీకు ${km}కి.మీ లోపు పనులు చూపిస్తున్నాము`,
    noJobsExpanded: (km) => `6కి.మీ లో పనులు లేవు — ఇప్పుడు ${km}కి.మీ వరకు చూపిస్తున్నాము`,
    locationDenied: 'లొకేషన్ అందుబాటులో లేదు — నగరం/నైపుణ్యం ప్రకారం చూపిస్తున్నాము',
  },
};

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    try {
      const saved = localStorage.getItem('lang');
      return ['en', 'hi', 'te'].includes(saved) ? saved : 'en';
    } catch { return 'en'; }
  });

  const setLang = (code) => {
    if (!['en', 'hi', 'te'].includes(code)) return;
    setLangState(code);
    try { localStorage.setItem('lang', code); } catch {}
  };

  useEffect(() => { document.documentElement.lang = lang; }, [lang]);

  // t(key) for plain strings, t(key, arg) for function-based strings
  // (e.g. t('readyToReceive', 'Painter') or t('showingWithin', 15))
  const t = (key, arg) => {
    const val = STRINGS[lang]?.[key] ?? STRINGS.en[key] ?? key;
    return typeof val === 'function' ? val(arg) : val;
  };

  return (
    <LangContext.Provider value={{
      lang, setLang, t,
      changeLang: setLang,
      languages: LANGUAGES,
    }}>
      {children}
    </LangContext.Provider>
  );
}

export default LangContext;