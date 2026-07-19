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

    // ── NEW: History ──
    historyTitle: 'History', historyTagline: 'Purane kaam — your completed jobs',
    completedJobs: 'Completed jobs', completedOn: 'Completed', worked: 'You worked for',
    rated: 'Rated', ratePoster: 'Rate poster', rateWorkerBtn: 'Rate worker',
    noHistory: 'No completed jobs yet', noHistoryWorker: 'Finish your first job and it will appear here',
    noHistoryUser: 'Once a worker completes a job, it will appear here',

    // ── NEW: Notifications ──
    notifTitle: 'Notifications', notifTagline: 'Suchnaye — stay updated',
    markAllRead: 'Mark all read', clear: 'Clear',
    noNotifs: 'No notifications yet', noNotifsSub: 'Job updates and messages will appear here',

    // ── NEW: Portfolio ──
    myPortfolio: 'My Portfolio', portfolioTagline: 'Kaam ki photos — show your best work',
    addWork: 'Add work', addPastWork: 'Add past work', title: 'Title',
    skillUsed: 'Skill used', photosMax: 'Photos (max 5)', description: 'Description',
    chooseFiles: 'Choose Files', noFileChosen: 'No file chosen',
    describeWork: 'Describe the work you did...', noPortfolio: 'No portfolio items yet',
    noPortfolioSub: 'Add photos of your past work to attract more clients',

    // ── NEW: Help ──
    helpTitle: 'Help & Support', helpTagline: 'Sahayata — we are here to help',
    chatWithUs: 'Chat with Us', whatsappSupport: 'WhatsApp Support', fastestResponse: 'Fastest response',
    callSupport: 'Call Support', emailUs: 'Email us', faqTitle: 'Frequently Asked Questions',
    needMoreHelp: 'Need more help?', messageOnWhatsapp: 'Message us on WhatsApp',
    termsConditions: 'Terms & Conditions', privacyPolicy: 'Privacy Policy',

    // ── NEW: Wallet ──
    walletTitle: 'Wallet', walletTaglineWorker: 'Meri kamai — your earning records',
    walletTaglineUser: 'Payment records for completed jobs',
    filterBy: 'Filter by', monthlyEarnings2: 'Monthly earnings', monthlyPayments: 'Monthly payments',
    avgEarning: 'Average earning', avgPayment: 'Average payment', jobsDone2: 'Jobs done',
    completedThisMonth: 'Completed this month', lifetimeEarnings: 'Lifetime earnings',
    lifetimePayments: 'Lifetime payments', totalRecords: 'total records',
    earningsHistory: 'Earnings history', paymentHistory: 'Payment history',
    noRecordsIn: (m, y) => `No records in ${m} ${y}`, tryDifferentMonth: 'Try selecting a different month',
    completeFirstJobWorker: 'Complete your first job and your earning will show here',
    completeFirstJobUser: 'Complete a job with a worker and the record will show here',
    from: 'From', to2: 'To', walletInfoWorker: 'Amounts appear here automatically when your work is marked completed. Payment itself happens directly between you and the job poster (cash or UPI) — Instant Worker takes no commission.',
    walletInfoUser: "Records appear here automatically when you mark a worker's job as completed. Payment itself happens directly between you and the worker (cash or UPI).",

    // ── NEW: Verification ──
    idVerificationTitle: 'ID Verification', notVerifiedYet: 'Not verified yet',
    underReview: 'Under review', verifiedStatus: 'Verified ✓', verificationRejected: 'Verification rejected',
    verifyMyIdentity: 'Verify my identity', resubmitId: 'Resubmit ID',
    idType: 'ID Type', selectIdType: 'Select ID type', idNumberOptional: 'ID Number (optional, kept private)',
    photoOfId: 'Photo of your ID', tapToUpload: 'Tap to take photo or upload',
    makeSureVisible: 'Make sure all details are clearly visible',
    selfieOptional: 'Selfie holding your ID (optional, speeds up approval)', tapAddSelfie: 'Tap to add selfie',
    submitForReview: 'Submit for review', submitting: 'Submitting...',
    privacyNoteVerify: 'Your ID document is only visible to our verification team. We never show your full ID number publicly — only the last 4 digits if you choose to share them.',
    getVerifiedBadge: 'Get a verified badge on your profile. Contractors trust verified workers more.',
    reviewWithin: 'We review within 24-48 hours.',
    identityVerified: 'Your identity is verified. A verified badge now shows on your profile.',
    canResubmit: 'You can submit again with a clearer photo.',

    // ── NEW: Conversations ──
    messagesTitle: 'Messages', messagesTagline: 'Baatcheet — your chats',
    refresh: 'Refresh', noConversations: 'No conversations yet',
    chatOpensAfter: 'Chat opens after a job application is accepted',
    viewMyJobs: 'View my jobs', justNow: 'Just now', newBadge: 'NEW',
    chatUnlockedSayHello: 'Chat unlocked — say hello!',
    acceptedFor: (title) => `Accepted for: ${title}`,

    // ── NEW: Notification message builders (title + body constructed
    // client-side from raw data, so they render in the current language
    // instead of whatever language they were created in) ──
    notifJobAppliedTitle: 'New applicant!',
    notifJobAppliedBody: (name, job) => `${name} applied to your job: ${job}`,
    notifAcceptedTitle: 'You got the job! 🎉',
    notifAcceptedBody: (job) => `Your application for "${job}" was accepted. You can now chat with the poster.`,
    notifRejectedTitle: 'Application not selected',
    notifRejectedBody: (job) => `Your application for "${job}" was not selected this time.`,
    notifWorkStartedTitle: 'Work has started! 🔨',
    notifWorkStartedBody: (name, job) => `${name} marked "${job}" as started. Time to begin work!`,
    notifWorkCompletedTitle: 'Work completed! ✅',
    notifWorkCompletedBody: (name, job, amount) => `${name} marked "${job}" as completed. ₹${amount} added to your wallet records. Don't forget to rate them!`,
    notifUrgentJobTitle: '🔴 Urgent work nearby!',
    notifUrgentJobBody: (job, skill, city, wage) => `${job} — ${skill} needed NOW in ${city}. ₹${wage}/day. Tap to respond fast!`,
    notifUrgentFilledTitle: 'Urgent job — worker confirmed! ⚡',
    notifUrgentFilledBody: (name, job) => `${name} accepted your urgent job "${job}" and is on the way. Chat is open now.`,
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

    historyTitle: 'इतिहास', historyTagline: 'पुराने काम — आपके पूरे किए काम',
    completedJobs: 'पूरे किए काम', completedOn: 'पूरा हुआ', worked: 'आपने काम किया',
    rated: 'रेट किया गया', ratePoster: 'पोस्टर को रेट करें', rateWorkerBtn: 'मजदूर को रेट करें',
    noHistory: 'अभी कोई पूरा काम नहीं', noHistoryWorker: 'अपना पहला काम पूरा करें, यह यहाँ दिखेगा',
    noHistoryUser: 'जब मजदूर काम पूरा करेगा, यह यहाँ दिखेगा',

    notifTitle: 'सूचनाएं', notifTagline: 'सूचनाएं — अपडेट रहें',
    markAllRead: 'सभी पढ़ा हुआ मार्क करें', clear: 'साफ़ करें',
    noNotifs: 'अभी कोई सूचना नहीं', noNotifsSub: 'काम अपडेट और संदेश यहाँ दिखेंगे',

    myPortfolio: 'मेरा पोर्टफोलियो', portfolioTagline: 'काम की फ़ोटो — अपना बेहतरीन काम दिखाएं',
    addWork: 'काम जोड़ें', addPastWork: 'पुराना काम जोड़ें', title: 'शीर्षक',
    skillUsed: 'इस्तेमाल किया गया काम', photosMax: 'फ़ोटो (अधिकतम 5)', description: 'विवरण',
    chooseFiles: 'फ़ाइलें चुनें', noFileChosen: 'कोई फ़ाइल नहीं चुनी',
    describeWork: 'आपने जो काम किया उसका विवरण दें...', noPortfolio: 'अभी कोई पोर्टफोलियो नहीं',
    noPortfolioSub: 'ज़्यादा ग्राहकों के लिए अपने पुराने काम की फ़ोटो जोड़ें',

    helpTitle: 'सहायता', helpTagline: 'सहायता — हम यहाँ मदद के लिए हैं',
    chatWithUs: 'हमसे चैट करें', whatsappSupport: 'व्हाट्सएप सहायता', fastestResponse: 'सबसे तेज़ जवाब',
    callSupport: 'कॉल सहायता', emailUs: 'हमें ईमेल करें', faqTitle: 'अक्सर पूछे जाने वाले सवाल',
    needMoreHelp: 'और मदद चाहिए?', messageOnWhatsapp: 'व्हाट्सएप पर संदेश भेजें',
    termsConditions: 'नियम व शर्तें', privacyPolicy: 'गोपनीयता नीति',

    walletTitle: 'वॉलेट', walletTaglineWorker: 'मेरी कमाई — आपके कमाई के रिकॉर्ड',
    walletTaglineUser: 'पूरे किए काम के भुगतान रिकॉर्ड',
    filterBy: 'फ़िल्टर करें', monthlyEarnings2: 'महीने की कमाई', monthlyPayments: 'महीने के भुगतान',
    avgEarning: 'औसत कमाई', avgPayment: 'औसत भुगतान', jobsDone2: 'पूरे किए काम',
    completedThisMonth: 'इस महीने पूरे हुए', lifetimeEarnings: 'कुल कमाई',
    lifetimePayments: 'कुल भुगतान', totalRecords: 'कुल रिकॉर्ड',
    earningsHistory: 'कमाई का इतिहास', paymentHistory: 'भुगतान का इतिहास',
    noRecordsIn: (m, y) => `${m} ${y} में कोई रिकॉर्ड नहीं`, tryDifferentMonth: 'दूसरा महीना चुनकर देखें',
    completeFirstJobWorker: 'अपना पहला काम पूरा करें, आपकी कमाई यहाँ दिखेगी',
    completeFirstJobUser: 'किसी मजदूर के साथ काम पूरा करें, रिकॉर्ड यहाँ दिखेगा',
    from: 'से', to2: 'तक', walletInfoWorker: 'आपका काम पूरा होते ही राशि यहाँ अपने आप दिख जाती है। भुगतान सीधे आपके और काम देने वाले के बीच होता है (नकद या UPI) — Instant Worker कोई कमीशन नहीं लेता।',
    walletInfoUser: 'जब आप किसी मजदूर का काम पूरा हुआ मार्क करते हैं, रिकॉर्ड यहाँ अपने आप दिख जाता है। भुगतान सीधे आपके और मजदूर के बीच होता है (नकद या UPI)।',

    idVerificationTitle: 'ID सत्यापन', notVerifiedYet: 'अभी सत्यापित नहीं',
    underReview: 'समीक्षा में', verifiedStatus: 'सत्यापित ✓', verificationRejected: 'सत्यापन अस्वीकृत',
    verifyMyIdentity: 'मेरी पहचान सत्यापित करें', resubmitId: 'फिर से जमा करें',
    idType: 'ID प्रकार', selectIdType: 'ID प्रकार चुनें', idNumberOptional: 'ID नंबर (वैकल्पिक, निजी रखा जाएगा)',
    photoOfId: 'अपने ID की फ़ोटो', tapToUpload: 'फ़ोटो लें या अपलोड करें',
    makeSureVisible: 'सुनिश्चित करें कि सभी जानकारी साफ़ दिख रही है',
    selfieOptional: 'ID के साथ सेल्फ़ी (वैकल्पिक, जल्दी मंज़ूरी में मदद करता है)', tapAddSelfie: 'सेल्फ़ी जोड़ें',
    submitForReview: 'समीक्षा के लिए भेजें', submitting: 'भेजा जा रहा है...',
    privacyNoteVerify: 'आपका ID दस्तावेज़ सिर्फ़ हमारी सत्यापन टीम को दिखता है। हम आपका पूरा ID नंबर कभी सार्वजनिक नहीं करते — सिर्फ़ आखिरी 4 अंक, अगर आप चाहें।',
    getVerifiedBadge: 'अपनी प्रोफाइल पर सत्यापित बैज पाएं। ठेकेदार सत्यापित मजदूरों पर ज़्यादा भरोसा करते हैं।',
    reviewWithin: 'हम 24-48 घंटों में समीक्षा करते हैं।',
    identityVerified: 'आपकी पहचान सत्यापित हो गई है। अब आपकी प्रोफाइल पर सत्यापित बैज दिखेगा।',
    canResubmit: 'आप साफ़ फ़ोटो के साथ फिर से जमा कर सकते हैं।',

    messagesTitle: 'संदेश', messagesTagline: 'बातचीत — आपकी चैट',
    refresh: 'रीफ़्रेश करें', noConversations: 'अभी कोई बातचीत नहीं',
    chatOpensAfter: 'काम स्वीकार होने के बाद चैट खुलती है',
    viewMyJobs: 'मेरे काम देखें', justNow: 'अभी अभी', newBadge: 'नया',
    chatUnlockedSayHello: 'चैट खुल गई — नमस्ते कहें!',
    acceptedFor: (title) => `स्वीकृत: ${title}`,

    notifJobAppliedTitle: 'नया आवेदन!',
    notifJobAppliedBody: (name, job) => `${name} ने आपके काम पर आवेदन किया: ${job}`,
    notifAcceptedTitle: 'आपको काम मिल गया! 🎉',
    notifAcceptedBody: (job) => `"${job}" के लिए आपका आवेदन स्वीकार हो गया। अब आप पोस्टर से चैट कर सकते हैं।`,
    notifRejectedTitle: 'आवेदन नहीं चुना गया',
    notifRejectedBody: (job) => `"${job}" के लिए आपका आवेदन इस बार नहीं चुना गया।`,
    notifWorkStartedTitle: 'काम शुरू हो गया! 🔨',
    notifWorkStartedBody: (name, job) => `${name} ने "${job}" को शुरू हुआ मार्क किया। काम शुरू करने का समय!`,
    notifWorkCompletedTitle: 'काम पूरा हुआ! ✅',
    notifWorkCompletedBody: (name, job, amount) => `${name} ने "${job}" को पूरा हुआ मार्क किया। ₹${amount} आपके वॉलेट रिकॉर्ड में जोड़े गए। रेटिंग देना न भूलें!`,
    notifUrgentJobTitle: '🔴 पास में तुरंत काम!',
    notifUrgentJobBody: (job, skill, city, wage) => `${job} — ${city} में अभी ${skill} चाहिए। ₹${wage}/दिन। जल्दी जवाब दें!`,
    notifUrgentFilledTitle: 'तुरंत वाला काम — मजदूर पुष्टि! ⚡',
    notifUrgentFilledBody: (name, job) => `${name} ने आपका तुरंत वाला काम "${job}" स्वीकार किया और रास्ते में है। चैट अब खुली है।`,
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

    historyTitle: 'చరిత్ర', historyTagline: 'పాత పనులు — మీ పూర్తయిన పనులు',
    completedJobs: 'పూర్తయిన పనులు', completedOn: 'పూర్తయింది', worked: 'మీరు పని చేశారు',
    rated: 'రేట్ చేయబడింది', ratePoster: 'పోస్టర్‌కి రేటింగ్ ఇవ్వండి', rateWorkerBtn: 'కార్మికుడికి రేటింగ్ ఇవ్వండి',
    noHistory: 'ఇంకా పూర్తయిన పనులు లేవు', noHistoryWorker: 'మీ మొదటి పని పూర్తి చేయండి, ఇది ఇక్కడ కనిపిస్తుంది',
    noHistoryUser: 'కార్మికుడు పని పూర్తి చేసినప్పుడు, ఇది ఇక్కడ కనిపిస్తుంది',

    notifTitle: 'నోటిఫికేషన్లు', notifTagline: 'నోటిఫికేషన్లు — అప్‌డేట్‌గా ఉండండి',
    markAllRead: 'అన్నీ చదివినట్లు గుర్తించండి', clear: 'తొలగించు',
    noNotifs: 'ఇంకా నోటిఫికేషన్లు లేవు', noNotifsSub: 'పని అప్‌డేట్‌లు మరియు సందేశాలు ఇక్కడ కనిపిస్తాయి',

    myPortfolio: 'నా పోర్ట్‌ఫోలియో', portfolioTagline: 'పని ఫోటోలు — మీ ఉత్తమ పనిని చూపించండి',
    addWork: 'పని జోడించండి', addPastWork: 'పాత పని జోడించండి', title: 'శీర్షిక',
    skillUsed: 'ఉపయోగించిన నైపుణ్యం', photosMax: 'ఫోటోలు (గరిష్టం 5)', description: 'వివరణ',
    chooseFiles: 'ఫైల్‌లను ఎంచుకోండి', noFileChosen: 'ఫైల్ ఎంచుకోలేదు',
    describeWork: 'మీరు చేసిన పనిని వివరించండి...', noPortfolio: 'ఇంకా పోర్ట్‌ఫోలియో లేదు',
    noPortfolioSub: 'ఎక్కువ మంది క్లయింట్‌లను ఆకర్షించడానికి మీ పాత పని ఫోటోలను జోడించండి',

    helpTitle: 'సహాయం', helpTagline: 'సహాయం — మేము సహాయం చేయడానికి ఇక్కడ ఉన్నాము',
    chatWithUs: 'మాతో చాట్ చేయండి', whatsappSupport: 'వాట్సాప్ మద్దతు', fastestResponse: 'వేగవంతమైన స్పందన',
    callSupport: 'కాల్ మద్దతు', emailUs: 'మాకు ఇమెయిల్ చేయండి', faqTitle: 'తరచుగా అడిగే ప్రశ్నలు',
    needMoreHelp: 'మరింత సహాయం కావాలా?', messageOnWhatsapp: 'వాట్సాప్‌లో మాకు సందేశం పంపండి',
    termsConditions: 'నిబంధనలు & షరతులు', privacyPolicy: 'గోప్యతా విధానం',

    walletTitle: 'వాలెట్', walletTaglineWorker: 'నా సంపాదన — మీ సంపాదన రికార్డులు',
    walletTaglineUser: 'పూర్తయిన పనుల చెల్లింపు రికార్డులు',
    filterBy: 'ఫిల్టర్ చేయండి', monthlyEarnings2: 'నెలవారీ సంపాదన', monthlyPayments: 'నెలవారీ చెల్లింపులు',
    avgEarning: 'సగటు సంపాదన', avgPayment: 'సగటు చెల్లింపు', jobsDone2: 'పూర్తయిన పనులు',
    completedThisMonth: 'ఈ నెల పూర్తయినవి', lifetimeEarnings: 'మొత్తం సంపాదన',
    lifetimePayments: 'మొత్తం చెల్లింపులు', totalRecords: 'మొత్తం రికార్డులు',
    earningsHistory: 'సంపాదన చరిత్ర', paymentHistory: 'చెల్లింపు చరిత్ర',
    noRecordsIn: (m, y) => `${m} ${y} లో రికార్డులు లేవు`, tryDifferentMonth: 'వేరే నెల ఎంచుకోండి',
    completeFirstJobWorker: 'మీ మొదటి పని పూర్తి చేయండి, మీ సంపాదన ఇక్కడ కనిపిస్తుంది',
    completeFirstJobUser: 'కార్మికుడితో పని పూర్తి చేయండి, రికార్డు ఇక్కడ కనిపిస్తుంది',
    from: 'నుండి', to2: 'వరకు', walletInfoWorker: 'మీ పని పూర్తయినప్పుడు మొత్తం ఇక్కడ స్వయంచాలకంగా కనిపిస్తుంది. చెల్లింపు నేరుగా మీకు మరియు పని ఇచ్చినవారికి మధ్య జరుగుతుంది (నగదు లేదా UPI) — Instant Worker ఎలాంటి కమీషన్ తీసుకోదు.',
    walletInfoUser: 'మీరు కార్మికుడి పని పూర్తయినట్లు గుర్తించినప్పుడు, రికార్డు ఇక్కడ స్వయంచాలకంగా కనిపిస్తుంది. చెల్లింపు నేరుగా మీకు మరియు కార్మికుడికి మధ్య జరుగుతుంది (నగదు లేదా UPI).',

    idVerificationTitle: 'ID ధృవీకరణ', notVerifiedYet: 'ఇంకా ధృవీకరించబడలేదు',
    underReview: 'సమీక్షలో ఉంది', verifiedStatus: 'ధృవీకరించబడింది ✓', verificationRejected: 'ధృవీకరణ తిరస్కరించబడింది',
    verifyMyIdentity: 'నా గుర్తింపును ధృవీకరించండి', resubmitId: 'మళ్ళీ సమర్పించండి',
    idType: 'ID రకం', selectIdType: 'ID రకాన్ని ఎంచుకోండి', idNumberOptional: 'ID నంబర్ (ఐచ్ఛికం, ప్రైవేట్‌గా ఉంచబడుతుంది)',
    photoOfId: 'మీ ID ఫోటో', tapToUpload: 'ఫోటో తీయండి లేదా అప్‌లోడ్ చేయండి',
    makeSureVisible: 'అన్ని వివరాలు స్పష్టంగా కనిపించేలా చూసుకోండి',
    selfieOptional: 'ID తో సెల్ఫీ (ఐచ్ఛికం, వేగవంతమైన ఆమోదానికి సహాయపడుతుంది)', tapAddSelfie: 'సెల్ఫీ జోడించండి',
    submitForReview: 'సమీక్ష కోసం సమర్పించండి', submitting: 'సమర్పిస్తోంది...',
    privacyNoteVerify: 'మీ ID పత్రం మా ధృవీకరణ బృందానికి మాత్రమే కనిపిస్తుంది. మేము మీ పూర్తి ID నంబర్‌ను బహిరంగంగా ఎప్పుడూ చూపించము — మీరు పంచుకోవాలనుకుంటే చివరి 4 అంకెలు మాత్రమే.',
    getVerifiedBadge: 'మీ ప్రొఫైల్‌పై ధృవీకరించబడిన బ్యాడ్జ్ పొందండి. కాంట్రాక్టర్లు ధృవీకరించిన కార్మికులను ఎక్కువగా నమ్ముతారు.',
    reviewWithin: 'మేము 24-48 గంటలలో సమీక్షిస్తాము.',
    identityVerified: 'మీ గుర్తింపు ధృవీకరించబడింది. ఇప్పుడు మీ ప్రొఫైల్‌పై ధృవీకరించిన బ్యాడ్జ్ కనిపిస్తుంది.',
    canResubmit: 'మీరు స్పష్టమైన ఫోటోతో మళ్ళీ సమర్పించవచ్చు.',

    messagesTitle: 'సందేశాలు', messagesTagline: 'సంభాషణ — మీ చాట్‌లు',
    refresh: 'రిఫ్రెష్ చేయండి', noConversations: 'ఇంకా సంభాషణలు లేవు',
    chatOpensAfter: 'పని దరఖాస్తు ఆమోదించిన తర్వాత చాట్ తెరుచుకుంటుంది',
    viewMyJobs: 'నా పనులు చూడండి', justNow: 'ఇప్పుడే', newBadge: 'కొత్తది',
    chatUnlockedSayHello: 'చాట్ తెరిచింది — హలో చెప్పండి!',
    acceptedFor: (title) => `ఆమోదించబడింది: ${title}`,

    notifJobAppliedTitle: 'కొత్త దరఖాస్తు!',
    notifJobAppliedBody: (name, job) => `${name} మీ పని కోసం దరఖాస్తు చేశారు: ${job}`,
    notifAcceptedTitle: 'మీకు పని దొరికింది! 🎉',
    notifAcceptedBody: (job) => `"${job}" కోసం మీ దరఖాస్తు ఆమోదించబడింది. ఇప్పుడు మీరు పోస్టర్‌తో చాట్ చేయవచ్చు.`,
    notifRejectedTitle: 'దరఖాస్తు ఎంపిక కాలేదు',
    notifRejectedBody: (job) => `"${job}" కోసం మీ దరఖాస్తు ఈసారి ఎంపిక కాలేదు.`,
    notifWorkStartedTitle: 'పని ప్రారంభమైంది! 🔨',
    notifWorkStartedBody: (name, job) => `${name} "${job}" ను ప్రారంభమైనట్లు గుర్తించారు. పని మొదలుపెట్టే సమయం!`,
    notifWorkCompletedTitle: 'పని పూర్తయింది! ✅',
    notifWorkCompletedBody: (name, job, amount) => `${name} "${job}" ను పూర్తయినట్లు గుర్తించారు. ₹${amount} మీ వాలెట్ రికార్డులకు జోడించబడింది. రేటింగ్ ఇవ్వడం మర్చిపోవద్దు!`,
    notifUrgentJobTitle: '🔴 సమీపంలో అత్యవసర పని!',
    notifUrgentJobBody: (job, skill, city, wage) => `${job} — ${city} లో ఇప్పుడే ${skill} కావాలి. ₹${wage}/రోజు. త్వరగా స్పందించండి!`,
    notifUrgentFilledTitle: 'అత్యవసర పని — కార్మికుడు నిర్ధారించారు! ⚡',
    notifUrgentFilledBody: (name, job) => `${name} మీ అత్యవసర పని "${job}" ను అంగీకరించారు మరియు వస్తున్నారు. చాట్ ఇప్పుడు తెరిచి ఉంది.`,
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

  // t(key) for plain strings, t(key, arg) for single-argument functions
  // (e.g. t('showingWithin', 15)), t(key, [a, b, c]) for multi-argument
  // functions (e.g. t('notifWorkCompletedBody', [name, job, amount])).
  const t = (key, arg) => {
    const val = STRINGS[lang]?.[key] ?? STRINGS.en[key] ?? key;
    if (typeof val !== 'function') return val;
    return Array.isArray(arg) ? val(...arg) : val(arg);
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