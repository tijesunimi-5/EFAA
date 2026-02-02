"use client";

import React, { ReactNode, useState, useEffect } from 'react';
import {
  Activity,
  AlertCircle,
  BookOpen,
  ChevronRight,
  Heart,
  MessageSquare,
  Users,
  Lightbulb,
  Search,
  Menu,
  X
} from 'lucide-react';
import SButton from '@/components/UI/SButton';
import Card from '@/components/UI/Card';
import Header from '@/components/UI/Header';


export default function HomeScreen() {
  const [userName, setUserName] = useState("Friend");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Mock health nudge
  const dailyNudge = {
    tip: "Did you know you should never restrain someone having a seizure?",
    context: "Restraining can cause injury. Instead, clear the area and cushion their head."
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">

      <Header />

      

      {/* --- Welcome Message --- */}
      <section className="px-6 pt-8 pb-6 max-w-2xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight">
          Stay calm, {userName}.<br />
          <span className="text-slate-500 font-medium text-lg">How can EFAA help you?</span>
        </h1>
      </section>

      {/* --- Primary Actions --- */}
      <section className="px-6 grid gap-4 max-w-2xl mx-auto">
        {/* Emergency Action */}
        <Card className="border-rose-100 bg-rose-50/30 group">
          <div className="flex items-start gap-4">
            <div className="bg-rose-600 p-3 rounded-2xl shadow-lg shadow-rose-200">
              <AlertCircle className="text-white w-8 h-8" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-black text-rose-700 mb-1">EMERGENCY</h2>
              <p className="text-rose-600/80 text-sm font-medium mb-4 leading-snug">
                Something is happening right now. Get immediate, step-by-step guidance.
              </p>
              <SButton variant="emergency" className="py-3 text-base">
                Start Guidance Now
              </SButton>
            </div>
          </div>
        </Card>

        {/* Learn Action */}
        <Card className="border-teal-100 group">
          <div className="flex items-start gap-4">
            <div className="bg-teal-100 p-3 rounded-2xl">
              <BookOpen className="text-teal-700 w-8 h-8" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-black text-teal-800 mb-1">LEARN & PREPARE</h2>
              <p className="text-slate-500 text-sm mb-4 leading-snug">
                Browse medical guides and prepare yourself for future emergencies.
              </p>
              <SButton variant="secondary" className="py-3 text-base">
                Browse Library
              </SButton>
            </div>
          </div>
        </Card>
      </section>

      {/* --- Daily Nudge --- */}
      <section className="px-6 py-8 max-w-2xl mx-auto">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-5 h-5 text-amber-500" />
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Daily Health Nudge</h3>
        </div>
        <Card className="bg-linear-to-br from-teal-50 to-white border-none shadow-sm relative overflow-hidden">
          <div className="absolute -right-4 -top-4 opacity-5">
            <Activity className="w-32 h-32" />
          </div>
          <p className="text-teal-900 font-bold text-lg mb-2 relative z-10">
            {dailyNudge.tip}
          </p>
          <p className="text-teal-700/80 text-sm leading-relaxed relative z-10">
            {dailyNudge.context}
          </p>
        </Card>
      </section>

      {/* --- Footer Links --- */}
      <footer className="px-6 py-8 border-t border-slate-100 mt-4 max-w-2xl mx-auto">
        <div className="grid grid-cols-2 gap-4">
          <a href="#" className="flex items-center gap-2 p-3 bg-white rounded-2xl border border-slate-100 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors">
            <Heart className="w-4 h-4 text-rose-500" /> Support EFAA
          </a>
          <a href="#" className="flex items-center gap-2 p-3 bg-white rounded-2xl border border-slate-100 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors">
            <MessageSquare className="w-4 h-4 text-teal-500" /> Suggest Topic
          </a>
          <a href="#" className="flex items-center gap-2 p-3 bg-white rounded-2xl border border-slate-100 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors">
            <Users className="w-4 h-4 text-blue-500" /> Volunteer
          </a>
          <a href="#" className="flex items-center gap-2 p-3 bg-white rounded-2xl border border-slate-100 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors">
            <Lightbulb className="w-4 h-4 text-amber-500" /> Feedback
          </a>
        </div>

        <div className="mt-8 text-center">
          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">
            EFAA is not a replacement for professional medical help. Always call emergency services first.
          </p>
        </div>
      </footer>

      {/* --- Mobile Bottom Nav (Simplified) --- */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-8 py-3 flex justify-around items-center md:hidden">
        <button className="text-teal-700 flex flex-col items-center gap-1">
          <Activity className="w-6 h-6" />
          <span className="text-[10px] font-bold">HOME</span>
        </button>
        <button className="text-slate-400 flex flex-col items-center gap-1">
          <Search className="w-6 h-6" />
          <span className="text-[10px] font-bold">SEARCH</span>
        </button>
        <button className="text-slate-400 flex flex-col items-center gap-1">
          <BookOpen className="w-6 h-6" />
          <span className="text-[10px] font-bold">GUIDES</span>
        </button>
      </nav>

    </div>
  );
}