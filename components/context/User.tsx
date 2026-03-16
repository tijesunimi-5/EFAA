"use client";

import { usePathname, useRouter } from 'next/navigation';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  fullName: string;
  firstName?: string;
  email: string;
  state: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const publicPaths = ['/onboarding', '/onboarding/login', '/login', '/'];

  useEffect(() => {
    const checkAuth = () => {
      if (typeof window === 'undefined') return;

      const token = localStorage.getItem('efaa_token');
      const savedUser = localStorage.getItem('efaa_user');
      const hasAccountHint = localStorage.getItem('efaa_has_account'); // The hint

      if (token && savedUser) {
        try {
          setUserState(JSON.parse(savedUser));
        } catch (e) {
          console.error("Failed to parse user data", e);
        }
      }
      // Redirect Logic for private routes
      // Inside UserProvider useEffect:
      else if (!token && !publicPaths.includes(pathname)) {
        const hasAccountHint = localStorage.getItem('efaa_has_account');

        if (hasAccountHint === 'true') {
          router.push('/onboarding/login'); // They have an account, just need to re-identify
        } else {
          router.push('/onboarding'); // Brand new user
        }
      }

      setIsLoading(false);
    };

    checkAuth();
  }, [pathname, router]);

  const setUser = (newUser: User | null) => {
    setUserState(newUser);
    if (typeof window === 'undefined') return;

    if (newUser) {
      localStorage.setItem('efaa_user', JSON.stringify(newUser));
      localStorage.setItem('efaa_has_account', 'true'); // Set the hint here
    } else {
      localStorage.removeItem('efaa_user');
      localStorage.removeItem('efaa_token');
      // Note: We do NOT remove efaa_has_account on logout
    }
  };

  const logout = () => {
    setUser(null);
    router.push('/onboarding/login');
  };

  return (
    <UserContext.Provider value={{ user, setUser, isLoading, logout }}>
      {!isLoading || publicPaths.includes(pathname) ? children : (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-teal-700 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) throw new Error('useUser must be used within a UserProvider');
  return context;
};