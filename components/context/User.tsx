"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";

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
  const [user, setUser] = useState<User | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [onlineTime, setOnlineTime] = useState(0);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  // Load from localStorage **only on client** after mount
  useEffect(() => {
    // Skip on server
    if (typeof window === "undefined") return;

    try {
      const storedUser = localStorage.getItem("efaa_user");
      const token = localStorage.getItem("efaa_token");

      if (storedUser && token) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsActive(true);
      }
    } catch (err) {
      console.error("Failed to parse stored user:", err);
      // Optional: clear bad data
      localStorage.removeItem("efaa_user");
      localStorage.removeItem("efaa_token");
    } finally {
      setInitialLoadComplete(true);
    }
  }, []); // runs once on client mount

  // Online timer – only if user is logged in
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      setOnlineTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [user]);

  // WebSocket pulse – only if user exists
  useEffect(() => {
    if (!user) return;

    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "wss://efaa-backend.onrender.com";
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "IDENTIFY", userId: user.id }));
    };

    // Optional: handle close/error if needed
    ws.onclose = () => console.log("WebSocket closed");
    ws.onerror = (err) => console.error("WebSocket error:", err);

    return () => ws.close();
  }, [user]);

  const login = useCallback((userData: User, token: string) => {
    if (typeof window === "undefined") return;

    localStorage.setItem("efaa_user", JSON.stringify(userData));
    localStorage.setItem("efaa_token", token);
    setUser(userData);
    setIsActive(true);
    setOnlineTime(0);
  }, []);

  const logout = useCallback(() => {
    if (typeof window === "undefined") return;

    localStorage.removeItem("efaa_user");
    localStorage.removeItem("efaa_token");
    setUser(null);
    setIsActive(false);
    setOnlineTime(0);
  }, []);

  return (
    <UserContext.Provider
      value={{ user, isActive, onlineTime, login, logout, initialLoadComplete }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
};