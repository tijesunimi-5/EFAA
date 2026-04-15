"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  AlertCircle, BookOpen, Lightbulb, Activity,
  Heart, MessageSquare, Users, ShieldCheck
} from 'lucide-react';
import { useUser } from '@/components/context/User';
import Card from '@/components/UI/Card';
import SButton from '@/components/UI/SButton';

/**
 * MODERN DASHBOARD HUB
 * Merged Welcome, ActionCards, and Nudge for better performance and less split-code fatigue.
 */
export default function HomeScreen() {
  const { user } = useUser();
  const router = useRouter();

  // Logic from WelcomeHeader
  const firstName = user?.fullName?.split(" ")[0] || "there";

  // Logic from HealthNudge
  const nudge = {
    tip: "Don't restrain seizures.",
    context: "Restraining can cause injury. Clear the area and cushion their head instead."
  };

  const footerLinks = [
    { label: "Support EFAA", icon: Heart, color: "text-rose-500" },
    { label: "Suggest Topic", icon: MessageSquare, color: "text-teal-500" },
    { label: "Volunteer", icon: Users, color: "text-blue-500" },
    { label: "Feedback", icon: Lightbulb, color: "text-amber-500" },
  ];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 md:px-8 space-y-12 animate-in fade-in duration-700">

      {/* 1. HERO SECTION */}
      <section className="space-y-2">
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
          Stay calm, <span className="text-teal-700">{firstName}.</span>
        </h1>
        <p className="text-slate-500 font-medium text-lg md:text-xl">
          Your emergency guidance is ready. How can we help?
        </p>
      </section>

      {/* 2. CORE ACTIONS GRID */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* EMERGENCY CARD */}
        <Card className="p-8 border-rose-100 bg-rose-50/20 hover:shadow-xl hover:shadow-rose-100 transition-all group border-2">
          <div className="flex flex-col h-full">
            <div className="bg-rose-600 w-14 h-14 rounded-2xl shadow-lg shadow-rose-200 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <AlertCircle className="text-white w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-rose-700 mb-2 tracking-tight uppercase">Emergency</h2>
            <p className="text-rose-600/80 font-medium mb-8 flex-1">
              Immediate, clinical step-by-step guidance for ongoing medical crises.
            </p>
            <SButton
              variant="emergency"
              className="w-full py-4 text-lg font-black uppercase tracking-widest shadow-lg shadow-rose-200"
              onClick={() => router.push('/emergency')}
            >
              Start Guidance
            </SButton>
          </div>
        </Card>

        {/* PREPARE CARD */}
        <Card className="p-8 border-slate-100 hover:shadow-xl hover:shadow-slate-100 transition-all group border-2">
          <div className="flex flex-col h-full">
            <div className="bg-teal-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <BookOpen className="text-teal-700 w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-slate-800 mb-2 tracking-tight uppercase">Learn</h2>
            <p className="text-slate-500 font-medium mb-8 flex-1">
              Browse the library of first-aid protocols and prepare for future incidents.
            </p>
            <SButton
              variant="secondary"
              className="w-full py-4 text-lg font-black uppercase tracking-widest"
              onClick={() => router.push("/learn")}
            >
              Open Library
            </SButton>
          </div>
        </Card>
      </section>

      {/* 3. DAILY INSIGHTS */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-1 h-6 bg-amber-400 rounded-full" />
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Daily Health Nudge</h3>
        </div>
        <Card className="bg-white border-slate-100 p-8 relative overflow-hidden group shadow-sm">
          <div className="absolute -right-6 -bottom-6 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
            <Activity className="w-48 h-48 text-teal-900" />
          </div>
          <div className="relative z-10 max-w-xl">
            <p className="text-teal-900 font-black text-2xl mb-3 tracking-tight">{nudge.tip}</p>
            <p className="text-slate-500 text-lg font-medium leading-relaxed">{nudge.context}</p>
          </div>
        </Card>
      </section>

      {/* 4. MODULAR FOOTER GRID */}
      <footer className="pt-12 border-t border-slate-100 space-y-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {footerLinks.map((link) => {
            const Icon = link.icon;
            return (
              <button
                key={link.label}
                className="flex flex-col items-center gap-3 p-6 bg-slate-50 rounded-[2rem] border border-transparent hover:border-slate-200 hover:bg-white transition-all group"
              >
                <Icon className={`w-6 h-6 ${link.color} group-hover:scale-110 transition-transform`} />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{link.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-col items-center text-center max-w-lg mx-auto space-y-4 pb-12">
          <div className="flex items-center gap-2 px-4 py-1.5 bg-slate-100 rounded-full text-[9px] font-black text-slate-400 uppercase tracking-widest">
            <ShieldCheck className="w-3 h-3" /> Medical Disclaimer
          </div>
          <p className="text-[10px] text-slate-400 font-bold leading-relaxed uppercase tracking-tighter">
            EFAA is a support tool, not a replacement for professional medical help.
            Always contact Nigeria emergency services (112) immediately in critical situations.
          </p>
        </div>
      </footer>
    </div>
  );
}