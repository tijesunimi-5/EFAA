"use client";

import React, { ReactNode } from 'react';
import {
  ArrowLeft,
  ShieldCheck,
  AlertCircle,
  Clock,
  Heart,
  MessageSquare,
  Users,
  ChevronRight,
  Activity,
  Phone,
  BookOpen,
} from 'lucide-react';

/**
 * REUSABLE UI COMPONENTS
 * Consolidated to ensure the Help page is self-contained and matches the EFAA system.
 */

const Card = ({ children, className = "", variant = "white" }: { children: ReactNode; className?: string; variant?: "white" | "teal" | "rose" | "slate" }) => {
  const variants = {
    white: "bg-white border-slate-100",
    teal: "bg-teal-50 border-teal-100",
    rose: "bg-rose-50 border-rose-100",
    slate: "bg-slate-50 border-slate-100"
  };

  return (
    <div className={`rounded-4xl p-6 border shadow-sm transition-all ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
};

const SectionTitle = ({ children, icon: Icon }: { children: ReactNode; icon: React.ElementType }) => (
  <div className="flex items-center gap-3 mb-4">
    <div className="bg-teal-100 p-2 rounded-xl text-teal-700">
      <Icon className="w-5 h-5" />
    </div>
    <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">{children}</h3>
  </div>
);



/**
 * MAIN HELP PAGE COMPONENT
 */
export default function HelpPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-teal-100 pb-20">

      {/* --- Sticky Header --- */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <button
            onClick={() => window.history.back()}
            className="p-2 -ml-2 hover:bg-slate-100 rounded-2xl text-slate-400 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl font-black tracking-tight text-slate-900">Help & Safety</h1>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest leading-none mt-1">EFAA usage and boundaries</p>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 pt-8 space-y-10">

        {/* --- Intro Section --- */}
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h2 className="text-3xl font-black text-slate-900 mb-4 leading-tight">How EFAA supports you during emergencies</h2>
          <p className="text-lg text-slate-600 leading-relaxed font-medium">
            EFAA (Emergency First Aid Assistant) is designed to provide calm, step-by-step guidance when every second counts. Whether you are facing a crisis right now or preparing for the future, we are here to walk you through it.
          </p>
        </section>

        {/* --- Safety Boundaries (What EFAA is NOT) --- */}
        <section className="animate-in fade-in slide-in-from-bottom-6 duration-700">
          <SectionTitle icon={ShieldCheck}>Safety & Boundaries</SectionTitle>
          <Card variant="rose" className="border-rose-200">
            <h4 className="font-bold text-rose-800 mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" /> Important Limitations
            </h4>
            <ul className="space-y-4 text-rose-700 font-medium leading-snug">
              <li className="flex gap-3">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                <span>EFAA is <strong className="text-rose-900">not</strong> a medical doctor.</span>
              </li>
              <li className="flex gap-3">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                <span>EFAA is <strong className="text-rose-900">not</strong> a diagnosis tool. It identifies symptoms to provide specific first aid steps.</span>
              </li>
              <li className="flex gap-3">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                <span>EFAA is <strong className="text-rose-900">not</strong> a replacement for emergency services.</span>
              </li>
            </ul>
          </Card>
        </section>

        {/* --- How it Works --- */}
        <section>
          <SectionTitle icon={Activity}>How guidance works</SectionTitle>
          <div className="space-y-4">
            {[
              { step: 1, text: "Select the emergency type from the home screen." },
              { step: 2, text: "Answer quick observation questions to orient the guide." },
              { step: 3, text: "Follow the large, clear first aid steps one by one." },
              { step: 4, text: "Call 112 immediately when the app prompts you to do so." }
            ].map((item) => (
              <div key={item.step} className="flex gap-5 items-start bg-white p-5 rounded-3xl border border-slate-100 shadow-xs">
                <div className="bg-teal-700 text-white w-8 h-8 rounded-full flex items-center justify-center font-black text-sm shrink-0">
                  {item.step}
                </div>
                <p className="text-slate-700 font-semibold leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* --- Timers & Alerts --- */}
        <section>
          <SectionTitle icon={Clock}>Timers & Alerts</SectionTitle>
          <Card variant="slate">
            <p className="text-slate-600 leading-relaxed mb-4">
              Some medical conditions, like seizures, become significantly more dangerous if they last too long.
            </p>
            <div className="flex gap-4 items-start bg-white p-4 rounded-2xl border border-slate-200">
              <div className="bg-amber-100 p-2 rounded-xl text-amber-600">
                <Clock className="w-5 h-5" />
              </div>
              <p className="text-sm text-slate-700 font-bold">
                EFAA automatically tracks durations for you. If a safety threshold is exceeded, a red alert will appear with an immediate &quot;Call 112&quot; button.
              </p>
            </div>
          </Card>
        </section>

        {/* --- Emergency Call Rule --- */}
        <section>
          <Card variant="rose" className="border-rose-300 bg-rose-600 text-white p-8">
            <div className="flex items-center gap-3 mb-4">
              <Phone className="w-6 h-6 fill-current text-rose-200" />
              <h3 className="text-2xl font-black uppercase">When to call help</h3>
            </div>
            <p className="text-rose-50 text-lg leading-relaxed mb-6 font-medium">
              You should call emergency services (112 in Nigeria) whenever the situation feels out of control, or when EFAA explicitly advises it.
            </p>
            <a
              href="tel:112"
              className="inline-flex items-center justify-center w-full bg-white text-rose-600 py-4 rounded-2xl font-black text-xl active:scale-95 transition-transform"
            >
              Call 112 Now
            </a>
          </Card>
        </section>

        {/* --- Learning --- */}
        <section>
          <SectionTitle icon={BookOpen}>Preparation</SectionTitle>
          <Card variant="teal">
            <h4 className="font-bold text-teal-800 mb-2">Learn before it happens</h4>
            <p className="text-teal-700/80 leading-relaxed font-medium">
              In a crisis, panic is the biggest enemy. Use our &quot;Learn&quot; section during your free time to read protocols and practice with quick quizzes. This builds the muscle memory needed to stay calm.
            </p>
          </Card>
        </section>

        {/* --- Feedback & Contribution --- */}
        <section>
          <SectionTitle icon={MessageSquare}>EFAA Community</SectionTitle>
          <div className="grid gap-4">
            <Card className="flex items-center justify-between group hover:border-teal-200 cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="bg-blue-50 p-3 rounded-2xl text-blue-600">
                  <Heart className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="font-bold text-slate-800 leading-none mb-1">Suggest a Topic</h5>
                  <p className="text-xs text-slate-400 font-bold uppercase">Missing a scenario?</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-200 group-hover:text-teal-400" />
            </Card>

            <Card className="flex items-center justify-between group hover:border-teal-200 cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="bg-purple-50 p-3 rounded-2xl text-purple-600">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="font-bold text-slate-800 leading-none mb-1">Volunteer</h5>
                  <p className="text-xs text-slate-400 font-bold uppercase">For Medical Professionals</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-200 group-hover:text-teal-400" />
            </Card>

            <Card className="flex items-center justify-between group hover:border-teal-200 cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="bg-amber-50 p-3 rounded-2xl text-amber-600">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="font-bold text-slate-800 leading-none mb-1">Give Feedback</h5>
                  <p className="text-xs text-slate-400 font-bold uppercase">Help us improve</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-200 group-hover:text-teal-400" />
            </Card>
          </div>
        </section>

        {/* --- Legal Footer --- */}
        <footer className="pt-12 text-center border-t border-slate-100">
          <div className="flex items-center justify-center gap-2 mb-4 opacity-40">
            <div className="bg-teal-700 p-1 rounded-md">
              <Activity className="text-white w-4 h-4" />
            </div>
            <span className="font-black text-teal-800 uppercase tracking-tighter">EFAA</span>
          </div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mb-4">
            Guidance Built for Nigeria
          </p>
          <p className="text-[10px] text-slate-300 font-medium px-10 leading-relaxed uppercase italic">
            Disclaimer: EFAA provides standard first aid guidelines. Users must use their best judgment and seek professional help immediately in life-threatening situations.
          </p>
        </footer>

      </main>
    </div>
  );
}