import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user, token } = useAuth();

  const getSocketBaseUrl = () => {
    const explicitSocketUrl = import.meta.env.VITE_SOCKET_URL;
    const apiUrl = import.meta.env.VITE_API_URL;
    const fallback = 'http://localhost:5000';

    const raw = explicitSocketUrl || apiUrl || fallback;
    // Ensure we do NOT include '/api' when connecting to Socket.IO
    return raw.replace(/\/?api\/?$/, '');
  };

  const getUserIdFromToken = (jwtToken) => {
    try {
      const parts = jwtToken.split('.');
      if (parts.length !== 3) return null;
      const payload = JSON.parse(atob(parts[1]));
      return payload.userId || payload.id || null;
    } catch (_) {
      return null;
    }
  };

  useEffect(() => {
    if (user && token) {
      const baseUrl = getSocketBaseUrl();

      const newSocket = io(baseUrl, {
        auth: { token },
        transports: ['websocket', 'polling']
      });

      // Expose userId on client socket for UI convenience
      newSocket.userId = getUserIdFromToken(token);

      newSocket.on('connect', () => {
        setIsConnected(true);
      });

      newSocket.on('disconnect', (reason) => {
        setIsConnected(false);
      });

      newSocket.on('connect_error', (error) => {
        console.error('❌ [SocketContext] Socket connection error:', error);
      });

      newSocket.on('error', (error) => {
        console.error('❌ [SocketContext] Socket error:', error);
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [user, token]);

  const value = {
    socket,
    isConnected
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
