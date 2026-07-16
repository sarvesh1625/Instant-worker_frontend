import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import '../styles/theme.css';

export default function Chat() {
  const { userId }  = useParams();
  const { user }    = useAuth();
  const { socket }  = useSocket();
  const navigate    = useNavigate();

  const [messages, setMessages]     = useState([]);
  const [text, setText]             = useState('');
  const [typing, setTyping]         = useState(false);
  const [otherUser, setOtherUser]   = useState(null);
  const [allowed, setAllowed]       = useState(null);
  const [recording, setRecording]   = useState(false);
  const [recordTime, setRecordTime] = useState(0);
  const [loading, setLoading]       = useState(true);
  const [sending, setSending]       = useState(false);

  const bottomRef   = useRef(null);
  const typingTimer = useRef(null);
  const mediaRecRef = useRef(null);
  const chunksRef   = useRef([]);
  const timerRef    = useRef(null);
  const addedIds    = useRef(new Set());

  // ── Check chat access + load the other user's info ──
  useEffect(() => {
    const check = async () => {
      try {
        const { data } = await axios.get(`/api/chat/access/${userId}`);
        setAllowed(data.allowed);
        if (data.otherUser) setOtherUser(data.otherUser);
        if (data.allowed) loadMessages();
        else setLoading(false);
      } catch {
        setAllowed(false);
        setLoading(false);
      }
    };
    check();
  }, [userId]);

  const loadMessages = async () => {
    try {
      const { data } = await axios.get(`/api/chat/${userId}`);
      data.messages.forEach(m => addedIds.current.add(m._id));
      setMessages(data.messages);
      if (data.messages.length > 0 && !otherUser) {
        const m = data.messages[0];
        const other = (m.sender?._id === user._id) ? m.receiver : m.sender;
        if (other) setOtherUser(other);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  // ── Socket: realtime delivery of the other side's messages ──
  useEffect(() => {
    if (!socket) return;
    const onReceive = (msg) => {
      const senderId = msg.sender?._id || msg.sender;
      if (senderId !== userId) return;
      if (addedIds.current.has(msg._id)) return;
      addedIds.current.add(msg._id);
      setMessages(prev => [...prev, msg]);
      if (!otherUser && msg.sender?.name) setOtherUser(msg.sender);
    };
    socket.on('receive_message', onReceive);
    socket.on('user_typing',      ({ senderId }) => { if (senderId === userId) setTyping(true); });
    socket.on('user_stop_typing', ({ senderId }) => { if (senderId === userId) setTyping(false); });
    return () => {
      socket.off('receive_message', onReceive);
      socket.off('user_typing');
      socket.off('user_stop_typing');
    };
  }, [socket, userId, otherUser]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  // ── Send: save via REST first (persists + returns real msg), then emit ──
  const handleSend = async () => {
    if (!text.trim() || sending) return;
    const trimmed = text.trim();
    setText('');
    setSending(true);

    const tempId = `temp_${Date.now()}`;
    setMessages(prev => [...prev, {
      _id: tempId, _isTemp: true,
      sender:   { _id: user._id, name: user.name },
      receiver: { _id: userId },
      text: trimmed, type: 'text',
      createdAt: new Date().toISOString(),
    }]);
    socket?.emit('stop_typing', { senderId: user._id, receiverId: userId });

    try {
      const { data } = await axios.post(`/api/chat/${userId}`, { text: trimmed });
      const real = data.message;
      addedIds.current.add(real._id);
      setMessages(prev => prev.map(m => m._id === tempId ? real : m));
      socket?.emit('send_message', { senderId: user._id, receiverId: userId, message: real });
    } catch (err) {
      setMessages(prev => prev.filter(m => m._id !== tempId));
      setText(trimmed);
      alert(err.response?.data?.message || 'Could not send message');
    } finally {
      setSending(false);
    }
  };

  const handleTyping = (e) => {
    setText(e.target.value);
    socket?.emit('typing', { senderId: user._id, receiverId: userId });
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => {
      socket?.emit('stop_typing', { senderId: user._id, receiverId: userId });
    }, 1500);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecRef.current = new MediaRecorder(stream);
      chunksRef.current = [];
      mediaRecRef.current.ondataavailable = e => chunksRef.current.push(e.data);
      mediaRecRef.current.start();
      setRecording(true);
      setRecordTime(0);
      timerRef.current = setInterval(() => setRecordTime(t => t + 1), 1000);
    } catch { alert('Microphone access denied'); }
  };

  const stopRecording = () => {
    if (!mediaRecRef.current || mediaRecRef.current.state === 'inactive') return;
    mediaRecRef.current.stop();
    clearInterval(timerRef.current);
    setRecording(false);
    mediaRecRef.current.onstop = async () => {
      const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
      const fd = new FormData();
      fd.append('audio', blob, 'voice.webm');
      fd.append('duration', recordTime);
      try {
        const { data } = await axios.post(`/api/chat/${userId}/voice`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (!addedIds.current.has(data.message._id)) {
          addedIds.current.add(data.message._id);
          setMessages(prev => [...prev, data.message]);
          socket?.emit('send_message', { senderId: user._id, receiverId: userId, message: data.message });
        }
      } catch { alert('Failed to send voice message'); }
    };
  };

  const formatTime = (s) => new Date(s).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  const formatDur  = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  const formatDateGroup = (dateStr) => {
    const d = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
    if (d.toDateString() === today.toDateString()) return 'Today';
    if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const grouped = messages.reduce((acc, msg) => {
    const dateKey = new Date(msg.createdAt).toDateString();
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(msg);
    return acc;
  }, {});

  if (allowed === null || loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', fontSize: 14, fontFamily: 'var(--font)' }}>
      <span className="il-spinner" style={{ borderTopColor: 'var(--primary)', borderColor: 'var(--border)', marginRight: 10 }}></span>
      Checking access...
    </div>
  );

  if (allowed === false) return (
    <div className="il-page" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div className="il-card il-card-pad" style={{ maxWidth: 340, textAlign: 'center' }}>
        <div style={{ width: 72, height: 72, borderRadius: 20, background: 'var(--secondary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
          <i className="ti ti-lock" style={{ fontSize: 36, color: 'var(--secondary)' }} aria-hidden="true"></i>
        </div>
        <h2 style={{ margin: '0 0 8px', fontSize: 19, fontWeight: 800, color: 'var(--text)' }}>Chat is locked</h2>
        <p style={{ margin: '0 0 20px', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65 }}>
          You can message each other once a worker has been accepted for a job. Apply to a job or accept a worker to unlock chat.
        </p>
        <button onClick={() => navigate(user?.role === 'worker' ? '/jobs' : '/jobs/my')} className="il-btn il-btn-primary il-btn-block">
          {user?.role === 'worker' ? 'Browse jobs' : 'View my job posts'}
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--surface)', maxWidth: 560, margin: '0 auto', fontFamily: 'var(--font)' }}>
      <div style={{ background: 'linear-gradient(135deg, #059669, #10B981)', padding: '13px 16px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 2px 10px rgba(16,185,129,.25)' }}>
        <button onClick={() => navigate('/conversations')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff', fontSize: 22, padding: 0, display: 'flex' }}>
          <i className="ti ti-arrow-left" aria-hidden="true"></i>
        </button>
        <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800, color: '#fff', flexShrink: 0, overflow: 'hidden' }}>
          {otherUser?.profilePhoto
            ? <img src={otherUser.profilePhoto} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
            : (otherUser?.name?.charAt(0).toUpperCase() || '?')}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: 15.5, fontWeight: 700, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{otherUser?.name || 'Chat'}</p>
          {typing
            ? <p style={{ margin: 0, fontSize: 11.5, color: '#D1FAE5' }}>typing...</p>
            : otherUser?.role && <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,.75)', textTransform: 'capitalize' }}>{otherUser.role}</p>}
        </div>
        {otherUser?.phone && (
          <a href={`tel:${otherUser.phone}`} style={{ color: '#fff', fontSize: 20, display: 'flex', width: 38, height: 38, borderRadius: 10, background: 'rgba(255,255,255,.15)', alignItems: 'center', justifyContent: 'center' }}>
            <i className="ti ti-phone" aria-hidden="true"></i>
          </a>
        )}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 12px 8px' }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', marginTop: 50 }}>
            <div style={{ width: 60, height: 60, borderRadius: 18, background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <i className="ti ti-message-2" style={{ fontSize: 30, color: 'var(--primary-dark)' }} aria-hidden="true"></i>
            </div>
            <p style={{ color: 'var(--text)', fontSize: 15, fontWeight: 700, margin: 0 }}>Chat unlocked!</p>
            <p style={{ color: 'var(--text-tertiary)', fontSize: 13, marginTop: 4 }}>Say hello and discuss the work</p>
          </div>
        )}

        {Object.entries(grouped).map(([dateKey, msgs]) => (
          <div key={dateKey}>
            <div style={{ textAlign: 'center', margin: '12px 0' }}>
              <span style={{ background: 'var(--border)', color: 'var(--text-secondary)', fontSize: 11, padding: '3px 12px', borderRadius: 20, fontWeight: 600 }}>
                {formatDateGroup(msgs[0].createdAt)}
              </span>
            </div>
            {msgs.map(msg => {
              const isMine = (msg.sender?._id || msg.sender) === user._id;
              return (
                <div key={msg._id} style={{ display: 'flex', justifyContent: isMine ? 'flex-end' : 'flex-start', marginBottom: 6 }}>
                  <div style={{
                    maxWidth: '75%',
                    background: isMine ? 'var(--primary)' : '#fff',
                    color: isMine ? '#fff' : 'var(--text)',
                    borderRadius: isMine ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    padding: '9px 13px',
                    opacity: msg._isTemp ? 0.65 : 1,
                    boxShadow: isMine ? '0 2px 8px rgba(16,185,129,.25)' : 'var(--shadow-sm)',
                    border: isMine ? 'none' : '1px solid var(--border)',
                  }}>
                    {msg.type === 'voice' ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <i className="ti ti-microphone" style={{ fontSize: 18 }} aria-hidden="true"></i>
                        <audio src={msg.voiceUrl} controls style={{ height: 30, width: 150 }}/>
                        {msg.voiceDuration > 0 && <span style={{ fontSize: 11, opacity: .7 }}>{formatDur(msg.voiceDuration)}</span>}
                      </div>
                    ) : (
                      <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5 }}>{msg.text}</p>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4, marginTop: 3 }}>
                      <span style={{ fontSize: 10, opacity: .65 }}>{formatTime(msg.createdAt)}</span>
                      {isMine && <i className={`ti ${msg._isTemp ? 'ti-clock' : 'ti-checks'}`} style={{ fontSize: 12, opacity: .7 }} aria-hidden="true"></i>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        {typing && (
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 6 }}>
            <div style={{ background: '#fff', borderRadius: '16px 16px 16px 4px', padding: '11px 16px', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                {[0, 150, 300].map(d => (
                  <span key={d} style={{ width: 7, height: 7, background: 'var(--text-tertiary)', borderRadius: '50%', display: 'inline-block', animation: 'bounce 1s infinite', animationDelay: `${d}ms` }}></span>
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {recording && (
        <div style={{ background: 'var(--danger-bg)', padding: '9px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 10, height: 10, background: 'var(--danger)', borderRadius: '50%', animation: 'pulse 1s infinite' }}></span>
          <span style={{ fontSize: 13, color: 'var(--danger)', fontWeight: 700 }}>Recording... {formatDur(recordTime)}</span>
          <button onClick={stopRecording} style={{ marginLeft: 'auto', background: 'var(--danger)', color: '#fff', border: 'none', borderRadius: 8, padding: '5px 14px', fontSize: 12, cursor: 'pointer', fontWeight: 700 }}>
            Send
          </button>
        </div>
      )}

      <div style={{ background: '#fff', borderTop: '1px solid var(--border)', padding: '10px 12px', display: 'flex', gap: 8, alignItems: 'flex-end' }}>
        <button
          onMouseDown={startRecording} onMouseUp={stopRecording}
          onTouchStart={startRecording} onTouchEnd={stopRecording}
          title="Hold to record"
          style={{
            width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
            background: recording ? 'var(--danger-bg)' : 'var(--surface)',
            border: recording ? '2px solid var(--danger)' : '1.5px solid var(--border)',
            color: recording ? 'var(--danger)' : 'var(--text-secondary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', fontSize: 20,
          }}>
          <i className="ti ti-microphone" aria-hidden="true"></i>
        </button>

        <input
          value={text}
          onChange={handleTyping}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }}}
          placeholder="Type a message..."
          style={{
            flex: 1, borderRadius: 22, border: '1.5px solid var(--border)',
            padding: '11px 16px', fontSize: 14, outline: 'none',
            background: 'var(--surface)', fontFamily: 'var(--font)',
          }}
        />

        <button onClick={handleSend} disabled={!text.trim() || sending} style={{
          width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
          background: text.trim() ? 'var(--primary)' : 'var(--border)',
          border: 'none', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: text.trim() ? 'pointer' : 'not-allowed', fontSize: 20,
          transition: 'background .15s',
        }}>
          <i className={`ti ${sending ? 'ti-loader-2' : 'ti-send'}`} style={sending ? { animation: 'il-spin .8s linear infinite' } : {}} aria-hidden="true"></i>
        </button>
      </div>

      <style>{`
        @keyframes bounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        @keyframes pulse  { 0%,100% { opacity: 1; } 50% { opacity: .4; } }
      `}</style>
    </div>
  );
}