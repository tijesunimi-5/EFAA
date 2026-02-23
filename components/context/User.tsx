"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from "react";

interface User {
  id: string;
  fullName: string;
  email: string;
  state: string;
}

interface UserContextType {
  user: User | null;
  isActive: boolean;
  onlineTime: number; // in seconds
  login: (userData: User, token: string) => void;
  logout: () => void;
  initialLoadComplete: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("efaa_user");
    const token = localStorage.getItem("efaa_token");
    return storedUser && token ? JSON.parse(storedUser) : null;
  });
  const [isActive, setIsActive] = useState(() => {
    const storedUser = localStorage.getItem("efaa_user");
    const token = localStorage.getItem("efaa_token");
    return !!(storedUser && token);
  });
  const [onlineTime, setOnlineTime] = useState(0);
  const [initialLoadComplete, setInitialLoadComplete] = useState(true);

  // 1. PERSISTENCE: Load user on mount
  useEffect(() => {
    // Initialization is now done in state initializers above
  }, []);

  // 2. TRACKING: Online Timer (Only counts if user is logged in)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (user) {
      interval = setInterval(() => {
        setOnlineTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [user]);

  // 3. LIVE STATUS: WebSocket Pulse
  useEffect(() => {
    if (!user) return;

    // Use the backend URL from your env
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "wss://efaa-backend.onrender.com";
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "IDENTIFY", userId: user.id }));
    };

    return () => ws.close();
  }, [user]);

  const login = useCallback((userData: User, token: string) => {
    localStorage.setItem("efaa_user", JSON.stringify(userData));
    localStorage.setItem("efaa_token", token);
    setUser(userData);
    setIsActive(true);
    setOnlineTime(0); // Reset timer on new login
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("efaa_user");
    localStorage.removeItem("efaa_token");
    setUser(null);
    setIsActive(false);
    setOnlineTime(0);
  }, []);

  return (
    <UserContext.Provider value={{ user, isActive, onlineTime, login, logout, initialLoadComplete }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
};