"use client";

import { EmergencyContact } from '@/types';
import { usePathname, useRouter } from 'next/navigation';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define clear roles for scalability
export type UserRole = 'user' | 'admin';

export interface User {
  fullName: string;
  firstName?: string;
  email: string;
  state: string;
  role: UserRole; // Added for RBAC
  contacts?: EmergencyContact[];
  phone?: string; // Optional phone field for profile
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
  logout: () => void;
  isAdmin: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Define route sets for cleaner logic
  // Inside UserProvider
  const publicPaths = ['/onboarding', '/onboarding/login', '/login', '/', '/admin/auth'];  const adminPaths = ['/admin'];

  const setUser = (newUser: User | null) => {
    setUserState(newUser);
    if (typeof window === 'undefined') return;

    if (newUser) {
      localStorage.setItem('efaa_user', JSON.stringify(newUser));
      localStorage.setItem('efaa_has_account', 'true');
    } else {
      localStorage.removeItem('efaa_user');
      localStorage.removeItem('efaa_token');
    }
  };

  const logout = () => {
    setUser(null);
    router.push('/onboarding/login');
  };

  useEffect(() => {
    const checkAuth = () => {
      if (typeof window === 'undefined') return;
      
      const token = localStorage.getItem('efaa_token');
      const savedUser = localStorage.getItem('efaa_user');

      if (token && savedUser) {
        try {
          const parsedUser: User = JSON.parse(savedUser);
          setUserState(parsedUser);

          // Role-based protection: Prevent users from accessing admin routes
         
          if (parsedUser.role !== 'admin' && pathname.startsWith('/admin') && pathname !== '/admin/auth') {
            router.push('/home');
          }

        } catch (e) {
          console.error("Auth hydration failed:", e);
          logout();
        }
      }
      else if (!token && !publicPaths.includes(pathname)) {
        const hasAccountHint = localStorage.getItem('efaa_has_account');

        // Redirect logic based on history
        if (hasAccountHint === 'true') {
          router.push('/onboarding/login');
        } else {
          router.push('/onboarding');
        }
      }

      setIsLoading(false);
    };

    checkAuth();
  }, [pathname, router]);

 

  

  const value = {
    user,
    setUser,
    isLoading,
    logout,
    isAdmin: user?.role === 'admin'
  };

  return (
    <UserContext.Provider value={value}>
      {/* Show loader only on private routes while validating. 
         Public paths should be "instant" for SEO and speed.
      */}
      {!isLoading || publicPaths.includes(pathname) ? children : (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
          <div className="w-10 h-10 border-4 border-teal-700 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 font-medium text-sm animate-pulse">Securing session...</p>
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