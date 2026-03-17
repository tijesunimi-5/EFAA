"use client";

import React, { ReactNode } from 'react';
import { Activity, ArrowLeft } from 'lucide-react';

interface Props {
  children: ReactNode;
  onBack: () => void;
  title: string;
  subtitle: string;
}

export default function EmergencyLayout({ children, onBack, title, subtitle }: Props) {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 flex flex-col">
      <header className="flex items-center justify-between px-6 py-4 sticky top-0 bg-white/90 backdrop-blur-md z-50 border-b border-slate-100">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 -ml-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-all"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <Activity className="text-teal-700 w-4 h-4" />
              <span className="font-black text-teal-800 text-xs uppercase tracking-tighter">
                {title} Guide
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{subtitle}</p>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col py-8">
        {children}
      </main>
    </div>
  );
}