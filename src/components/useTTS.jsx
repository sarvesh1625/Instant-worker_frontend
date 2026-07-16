import { useState, useCallback, useEffect, useRef } from 'react';

// ── ONE global audio + ONE global state ──────────────────────────────────────
// Shared across ALL SpeakButton instances on the page
const AUDIO      = new Audio();
let   listeners  = new Set();          // all hook instances subscribe here
let   gSpeaking  = false;
let   gActiveId  = null;

function setGlobal(speaking, activeId) {
  gSpeaking = speaking;
  gActiveId = activeId;
  listeners.forEach(fn => fn(speaking, activeId)); // notify every hook
}

function stopGlobal() {
  AUDIO.pause();
  AUDIO.src = '';
  window.speechSynthesis?.cancel();
  setGlobal(false, null);
}

// ── Build spoken text ─────────────────────────────────────────────────────────
export function buildJobSpeech(job, lang) {
  const wage    = job.wage           || 0;
  const skill   = job.skill          || '';
  const title   = job.title          || '';
  const city    = job.location?.city || '';
  const area    = job.location?.area || '';
  const workers = job.workersNeeded  || 1;
  const duration= job.duration       || '';
  const poster  = job.postedBy?.name || '';
  const date    = job.startDate
    ? new Date(job.startDate).toLocaleDateString('en-IN', { day:'numeric', month:'long' })
    : '';
  const time = job.startTime || '';

  if (lang === 'te') return [
    `${title}.`,
    `నైపుణ్యం ${skill}.`,
    `స్థలం ${city}${area ? ` ${area}` : ''}.`,
    `రోజువారీ వేతనం ${wage} రూపాయలు.`,
    workers > 1 ? `${workers} మంది కార్మికులు అవసరం.` : 'ఒక కార్మికుడు అవసరం.',
    duration ? `వ్యవధి ${duration}.` : '',
    date ? `పని ప్రారంభం ${date}${time ? ` ${time} కి` : ''}.` : '',
    poster ? `పోస్ట్ చేసినది ${poster}.` : '',
    'Apply బటన్ నొక్కి Apply చేయండి.',
  ].filter(Boolean).join(' ');

  if (lang === 'hi') return [
    `${title}.`,
    `काम ${skill}.`,
    `जगह ${city}${area ? ` ${area}` : ''}.`,
    `रोज़ का वेतन ${wage} रुपये.`,
    workers > 1 ? `${workers} मज़दूर चाहिए.` : 'एक मज़दूर चाहिए.',
    duration ? `अवधि ${duration}.` : '',
    date ? `काम शुरू ${date}${time ? ` ${time} बजे` : ''}.` : '',
    poster ? `पोस्ट किया ${poster} ने.` : '',
    'Apply बटन दबाकर Apply करें.',
  ].filter(Boolean).join(' ');

  return [
    `${title}.`,
    `Skill: ${skill}.`,
    `Location: ${city}${area ? `, ${area}` : ''}.`,
    `Daily wage: ${wage} rupees.`,
    workers > 1 ? `${workers} workers needed.` : '1 worker needed.',
    duration ? `Duration: ${duration}.` : '',
    date ? `Starts on ${date}${time ? ` at ${time}` : ''}.` : '',
    poster ? `Posted by ${poster}.` : '',
    'Tap Apply to apply for this job.',
  ].filter(Boolean).join(' ');
}

// ── Split text into ≤180-char chunks ─────────────────────────────────────────
function splitChunks(text, max = 180) {
  const parts  = text.split(/(?<=[.!?।])\s+/);
  const chunks = [];
  let cur      = '';
  for (const p of parts) {
    if ((cur + ' ' + p).trim().length > max) {
      if (cur.trim()) chunks.push(cur.trim());
      cur = p;
    } else {
      cur = cur ? cur + ' ' + p : p;
    }
  }
  if (cur.trim()) chunks.push(cur.trim());
  return chunks.length ? chunks : [text.slice(0, max)];
}

// ── Play one chunk on the shared AUDIO element ───────────────────────────────
function playChunk(text, lang) {
  return new Promise((resolve, reject) => {
    AUDIO.pause();
    AUDIO.src             = `/api/tts?text=${encodeURIComponent(text)}&lang=${lang}`;
    AUDIO.onended         = resolve;
    AUDIO.onerror         = reject;
    AUDIO.oncanplaythrough = () => AUDIO.play().catch(reject);
    AUDIO.load();
  });
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useTTS() {
  const [speaking, setSpeaking] = useState(gSpeaking);
  const [activeId, setActiveId] = useState(gActiveId);
  const myStop = useRef(false);

  // Subscribe to global state changes
  useEffect(() => {
    const handler = (s, id) => { setSpeaking(s); setActiveId(id); };
    listeners.add(handler);
    return () => listeners.delete(handler);
  }, []);

  const speak = useCallback(async (text, lang = 'en', id = null) => {
    // Stop whatever is already playing globally
    myStop.current = true;
    stopGlobal();
    await new Promise(r => setTimeout(r, 60));

    myStop.current = false;
    setGlobal(true, id);

    const chunks = splitChunks(text);
    try {
      for (const chunk of chunks) {
        if (myStop.current) break;
        await playChunk(chunk, lang);
      }
    } catch { /* silent */ }
    finally {
      if (!myStop.current) setGlobal(false, null);
    }
  }, []);

  const stop = useCallback(() => {
    myStop.current = true;
    stopGlobal();
  }, []);

  useEffect(() => () => { myStop.current = true; }, []);

  return { speak, stop, speaking, activeId, supported: true };
}