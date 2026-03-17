"use client";

import React from 'react';
import Header from '@/components/UI/Header';
import MobileNav from '@/components/home/MobileNav';

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-24">
      <Header />
      <main className="max-w-2xl mx-auto">
        {children}
      </main>
      <MobileNav />
    </div>
  );
}