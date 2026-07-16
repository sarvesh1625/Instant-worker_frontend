import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

// FIX: was hardcoded to 'http://localhost:5000', so in production the
// socket tried to connect to the user's own machine instead of the real
// Render backend — meaning chat, live tracking, and typing indicators would
// silently fail to connect at all once deployed. Falls back to localhost
// only when VITE_API_URL isn't set (local dev).
const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket]           = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (!user) return;

    // userId in the connection query lets the server join this socket to
    // its own room (user_${userId}) — required for chat/notifications to
    // actually be delivered in real time, not just saved via REST.
    const s = io(SOCKET_URL, { query: { userId: user._id } });
    setSocket(s);

    s.emit('user_online', user._id);
    s.on('online_users', (users) => setOnlineUsers(users));

    return () => s.disconnect();
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);