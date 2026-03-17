"use client";

import React from 'react';
import { Clock } from 'lucide-react';

export default function TimerDisplay({ seconds }: { seconds: number }) {
  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-slate-900 text-white p-6 rounded-3xl flex items-center justify-between shadow-xl">
      <div className="flex items-center gap-3">
        <Clock className="w-6 h-6 text-teal-400 animate-pulse" />
        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Elapsed Time</span>
      </div>
      <span className="font-mono text-4xl font-black">{formatTime(seconds)}</span>
    </div>
  );
}