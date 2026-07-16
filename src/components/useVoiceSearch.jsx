import { useState, useRef, useCallback } from 'react';

// Language codes for Web Speech API
const LANG_CODES = {
  te: 'te-IN',
  hi: 'hi-IN',
  en: 'en-IN',
};

// Skill keywords mapping — what workers say → what we search
const SKILL_MAP = {
  // Telugu
  'ఎలక్ట్రీషియన్': 'Electrician', 'విద్యుత్': 'Electrician', 'ఎలక్ట్రిక్': 'Electrician',
  'పెయింటర్': 'Painter', 'రంగు': 'Painter', 'పెయింటింగ్': 'Painter',
  'కార్పెంటర్': 'Carpenter', 'వడ్రంగి': 'Carpenter', 'వడ్రంగం': 'Carpenter',
  'ప్లంబర్': 'Plumber', 'పైపులు': 'Plumber', 'నీళ్ళు': 'Plumber',
  'మేసన్': 'Mason', 'రాళ్ళు': 'Mason', 'సిమెంట్': 'Mason',
  'వెల్డర్': 'Welder', 'వెల్డింగ్': 'Welder',
  'డ్రైవర్': 'Driver', 'వాహనం': 'Driver',
  'కూలీ': 'Labour', 'కూలి': 'Labour', 'లేబర్': 'Labour',

  // Hindi
  'इलेक्ट्रीशियन': 'Electrician', 'बिजली': 'Electrician', 'इलेक्ट्रिक': 'Electrician',
  'पेंटर': 'Painter', 'रंग': 'Painter', 'पेंटिंग': 'Painter',
  'कारपेंटर': 'Carpenter', 'बढ़ई': 'Carpenter', 'लकड़ी': 'Carpenter',
  'प्लंबर': 'Plumber', 'पाइप': 'Plumber', 'नल': 'Plumber',
  'मिस्त्री': 'Mason', 'राजमिस्त्री': 'Mason', 'सीमेंट': 'Mason',
  'वेल्डर': 'Welder', 'वेल्डिंग': 'Welder',
  'ड्राइवर': 'Driver', 'चालक': 'Driver',
  'मजदूर': 'Labour', 'मज़दूर': 'Labour', 'कुली': 'Labour',
  'फार्मर': 'Farmer', 'किसान': 'Farmer', 'खेती': 'Farmer',

  // English
  'electrician': 'Electrician', 'electric': 'Electrician',
  'painter': 'Painter', 'painting': 'Painter', 'paint': 'Painter',
  'carpenter': 'Carpenter', 'carpentry': 'Carpenter',
  'plumber': 'Plumber', 'plumbing': 'Plumber',
  'mason': 'Mason', 'masonry': 'Mason',
  'welder': 'Welder', 'welding': 'Welder',
  'driver': 'Driver', 'driving': 'Driver',
  'labour': 'Labour', 'labor': 'Labour', 'worker': 'Labour', 'labourer': 'Labour',
  'farmer': 'Farmer', 'farming': 'Farmer',
  'mechanic': 'Mechanic',
};

// City keywords mapping
const CITY_MAP = {
  'హైదరాబాద్': 'Hyderabad', 'హైదరాబాద': 'Hyderabad',
  'విశాఖపట్నం': 'Visakhapatnam', 'విజాగ్': 'Visakhapatnam',
  'విజయవాడ': 'Vijayawada',
  'వరంగల్': 'Warangal',
  'తిరుపతి': 'Tirupati',
  'हैदराबाद': 'Hyderabad',
  'विशाखापत्तनम': 'Visakhapatnam', 'विज़ाग': 'Visakhapatnam',
  'विजयवाड़ा': 'Vijayawada',
  'बेंगलुरु': 'Bengaluru', 'बैंगलोर': 'Bengaluru',
  'चेन्नई': 'Chennai',
  'मुंबई': 'Mumbai',
  'दिल्ली': 'Delhi',
  'पुणे': 'Pune',
  'hyderabad': 'Hyderabad',
  'visakhapatnam': 'Visakhapatnam', 'vizag': 'Visakhapatnam',
  'vijayawada': 'Vijayawada',
  'warangal': 'Warangal',
  'tirupati': 'Tirupati',
  'bengaluru': 'Bengaluru', 'bangalore': 'Bengaluru',
  'chennai': 'Chennai',
  'mumbai': 'Mumbai',
  'delhi': 'Delhi',
  'pune': 'Pune',
};

// ── FIX: strip punctuation that speech recognition adds (periods, commas,
// question marks, etc.) before doing any matching ─────────────────────────
function cleanWord(word) {
  return word
    .replace(/[.,!?;:"'’"„«»()[\]{}]/g, '')  // strip common punctuation
    .trim();
}

// Parse spoken text into skill + city
export function parseVoiceQuery(transcript) {
  // Split on whitespace, then clean each token of trailing punctuation
  const rawWords = transcript.split(/\s+/).filter(Boolean);
  const cleanedWords = rawWords.map(cleanWord).filter(Boolean);

  let skill = '';
  let city  = '';

  for (const word of cleanedWords) {
    const lower = word.toLowerCase();

    if (!skill) {
      // Check exact original-script match first (Telugu/Hindi), then lowercase English
      if (SKILL_MAP[word]) {
        skill = SKILL_MAP[word];
      } else if (SKILL_MAP[lower]) {
        skill = SKILL_MAP[lower];
      }
    }

    if (!city) {
      if (CITY_MAP[word]) {
        city = CITY_MAP[word];
      } else if (CITY_MAP[lower]) {
        city = CITY_MAP[lower];
      }
    }
  }

  return { skill, city, raw: transcript };
}

// Main hook
export function useVoiceSearch(lang = 'en') {
  const [listening,   setListening]   = useState(false);
  const [transcript,  setTranscript]  = useState('');
  const [parsed,      setParsed]      = useState({ skill: '', city: '', raw: '' });
  const [error,       setError]       = useState('');
  const [supported,   setSupported]   = useState(
    typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
  );

  const recRef = useRef(null);

  const startListening = useCallback(() => {
    setError('');
    setTranscript('');
    setParsed({ skill: '', city: '', raw: '' });

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setError('Voice not supported on this browser. Use Chrome.');
      setSupported(false);
      return;
    }

    const rec = new SR();
    recRef.current = rec;

    rec.lang            = LANG_CODES[lang] || 'en-IN';
    rec.continuous       = false;
    rec.interimResults   = true;
    rec.maxAlternatives  = 3;

    rec.onstart = () => setListening(true);

    rec.onresult = (e) => {
      let best = '';
      for (let i = 0; i < e.results.length; i++) {
        const result = e.results[i];
        for (let j = 0; j < result.length; j++) {
          if (result[j].transcript.length > best.length) {
            best = result[j].transcript;
          }
        }
      }
      setTranscript(best);
      if (e.results[e.results.length - 1].isFinal) {
        const p = parseVoiceQuery(best);
        setParsed(p);
      }
    };

    rec.onerror = (e) => {
      setListening(false);
      if (e.error === 'not-allowed') setError('Microphone access denied. Please allow microphone.');
      else if (e.error === 'no-speech') setError('No speech detected. Please try again.');
      else setError('Voice recognition error. Please try again.');
    };

    rec.onend = () => setListening(false);

    rec.start();
  }, [lang]);

  const stopListening = useCallback(() => {
    recRef.current?.stop();
    setListening(false);
  }, []);

  return { listening, transcript, parsed, error, supported, startListening, stopListening };
}