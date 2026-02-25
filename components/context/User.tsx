"use client";

import { usePathname, useRouter } from 'next/navigation';
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode
} from 'react';

/**
 * USER CONTEXT & AUTH GUARD
 * This context manages the global user state and enforces authentication.
 * * * NOTE: In your local Next.js project, please uncomment the import below:
 * import { useRouter, usePathname } from 'next/navigation';
 */



interface User {
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

  // Define paths that DON'T require a token
  const publicPaths = ['/onboarding', '/login', '/'];

  useEffect(() => {
    const checkAuth = () => {
      if (typeof window === 'undefined') return;

      const token = localStorage.getItem('efaa_token');
      const savedUser = localStorage.getItem('efaa_user');

      // 1. If we have a token, restore the user state
      if (token && savedUser) {
        try {
          setUserState(JSON.parse(savedUser));
        } catch (e) {
          console.error("Failed to parse user data", e);
        }
      }

      // 2. Redirect Logic: If no token and trying to access a private route
      else if (!token && !publicPaths.includes(pathname)) {
        // Only redirect if we are not already on a public page
        router.push('/onboarding');
      }

      setIsLoading(false);
    };

    checkAuth();
  }, [pathname]);

  // Sync user state to localStorage whenever it changes
  const setUser = (newUser: User | null) => {
    setUserState(newUser);
    if (typeof window === 'undefined') return;

    if (newUser) {
      localStorage.setItem('efaa_user', JSON.stringify(newUser));
    } else {
      localStorage.removeItem('efaa_user');
      localStorage.removeItem('efaa_token');
    }
  };

  const logout = () => {
    setUser(null);
    router.push('/login');
  };

  return (
    <UserContext.Provider value={{ user, setUser, isLoading, logout }}>
      {/* Optional: Only show content after loading to prevent 
        flashing private content before the redirect kicks in.
      */}
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
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};