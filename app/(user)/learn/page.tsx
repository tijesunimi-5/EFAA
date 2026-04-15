"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  Activity,
  Droplets,
  Flame,
  Wind,
  Skull,
  ChevronRight,
  BookOpen,
  PlayCircle
} from 'lucide-react';
import Card from '@/components/UI/Card';

/**
 * Scalable configuration for educational content.
 * Adding a new category is as simple as adding an object here.
 */
const CONDITIONS = [
  { 
    id: 'seizure', 
    title: 'Seizure Management', 
    desc: 'How to protect someone during an active seizure.',
    icon: <Activity className="text-teal-600" />, 
    color: 'bg-teal-50', 
    duration: '3 min read' 
  },
  { 
    id: 'bleeding', 
    title: 'Severe Bleeding', 
    desc: 'Applying pressure and using tourniquets safely.',
    icon: <Droplets className="text-rose-500" />, 
    color: 'bg-rose-50', 
    disabled: true 
  },
  { 
    id: 'burns', 
    title: 'Burns & Scalds', 
    desc: 'Identifying burn depth and immediate cooling steps.',
    icon: <Flame className="text-orange-500" />, 
    color: 'bg-orange-50', 
    disabled: true 
  },
  { 
    id: 'choking', 
    title: 'Choking (Adults)', 
    desc: 'Mastering the Heimlich maneuver and back blows.',
    icon: <Wind className="text-blue-500" />, 
    color: 'bg-blue-50', 
    disabled: true 
  },
];

export default function LearnLibrary() {
  const router = useRouter();

  return (
    <div className="max-w-5xl mx-auto py-12 px-6 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 1. EDUCATIONAL HERO */}
      <header className="space-y-4">
        <div className="flex items-center gap-3 text-teal-600">
          <BookOpen className="w-6 h-6" />
          <span className="font-black uppercase tracking-widest text-xs">Knowledge Base</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
          Master First Aid.
        </h1>
        <p className="text-xl text-slate-500 font-medium max-w-2xl leading-relaxed">
          Interactive guides designed to build clinical confidence before an emergency happens.
        </p>
      </header>

      {/* 2. FEATURED PATHWAY (Optional UI addition) */}
      <Card className="bg-slate-900 border-none p-8 relative overflow-hidden group cursor-pointer">
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-teal-500/20 to-transparent" />
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-500/20 rounded-full text-teal-400 text-[10px] font-black uppercase tracking-widest">
            New Course
          </div>
          <h2 className="text-2xl font-black text-teal-300">The Essentials of First Aid</h2>
          <p className="text-slate-400 font-medium max-w-md text-sm">
            Complete our foundational 10-minute module and earn your EFAA Digital Badge.
          </p>
          <button className="flex items-center gap-2 text-teal-400 font-black uppercase tracking-widest text-xs hover:text-white transition-colors">
            <PlayCircle className="w-5 h-5" /> Start Learning Path
          </button>
        </div>
      </Card>

      {/* 3. CONDITION GRID */}
      <section className="space-y-6">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Specific Protocols</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CONDITIONS.map((c) => (
            <Card
              key={c.id}
              onClick={c.disabled ? undefined : () => router.push(`/learn/${c.id}`)}
              className={`group transition-all border-2 ${
                c.disabled 
                  ? "opacity-50 grayscale bg-slate-50/50" 
                  : "hover:border-teal-500/30 hover:shadow-xl hover:shadow-teal-500/5 cursor-pointer"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-5">
                  <div className={`${c.color} w-14 h-14 rounded-[1.25rem] flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform`}>
                    {c.icon}
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-black text-slate-800 text-xl tracking-tight">{c.title}</h3>
                    <p className="text-slate-500 text-sm font-medium leading-snug max-w-[200px]">
                      {c.desc}
                    </p>
                    {!c.disabled && (
                      <div className="flex items-center gap-2 pt-2">
                        <span className="text-[10px] font-black text-teal-600 uppercase tracking-widest">
                          {c.duration}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                {!c.disabled ? (
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-teal-600 group-hover:translate-x-1 transition-all" />
                ) : (
                  <span className="text-[9px] font-black text-slate-400 uppercase bg-slate-100 px-2 py-1 rounded-md">
                    Soon
                  </span>
                )}
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}