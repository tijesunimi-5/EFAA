"use client";

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ArrowLeft, Home, Activity } from 'lucide-react';

export default function NavHeader() {
  const router = useRouter();
  const pathname = usePathname();

  // Don't show the back button on the main Dashboard/Home to keep it clean
  const isHome = pathname === '/home';

  return (
    <header className="sticky top-0 z-[100] w-full bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4">
      <div className="max-w-5xl mx-auto flex items-center justify-between">

        <div className="flex items-center gap-4">
          {!isHome ? (
            <button
              onClick={() => router.back()}
              className="p-2 -ml-2 hover:bg-slate-100 rounded-xl transition-all group"
              aria-label="Go back"
            >
              <ArrowLeft className="w-6 h-6 text-slate-600 group-hover:text-teal-700 group-hover:-translate-x-1 transition-all" />
            </button>
          ) : (
            <div className="bg-teal-700 p-2 rounded-xl shadow-lg shadow-teal-100">
              <Activity className="text-white w-5 h-5" />
            </div>
          )}

          <span className="font-black text-slate-900 tracking-tighter text-xl uppercase">
            EFAA <span className="text-teal-700 font-medium lowercase tracking-normal text-sm ml-1">Assistant</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {!isHome && (
            <button
              onClick={() => router.push('/home')}
              className="p-2 text-slate-400 hover:text-teal-700 hover:bg-teal-50 rounded-xl transition-all"
              title="Return Home"
            >
              <Home className="w-5 h-5" />
            </button>
          )}
          {/* User Profile Avatar could go here */}
        </div>
      </div>
    </header>
  );
}