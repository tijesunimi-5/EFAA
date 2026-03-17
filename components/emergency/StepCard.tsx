"use client";

import React from 'react';
import { Info, Activity } from 'lucide-react';

interface Props {
  title: string;
  instruction: string;
  helperText: string;
  type: string;
}

export default function StepCard({ title, instruction, helperText, type }: Props) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
      <h2 className="text-3xl font-black text-slate-900 leading-tight mb-4 uppercase">
        {title}
      </h2>
      <p className="text-xl text-slate-500 font-medium mb-8 leading-relaxed">
        {instruction}
      </p>

      {/* Visual Instruction Area */}
      <div className="w-full aspect-video bg-slate-50 rounded-4xl mb-8 flex items-center justify-center border-2 border-dashed border-slate-200 relative overflow-hidden">
        <div className="text-center z-10">
          <div className="bg-white w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm">
            <Activity className="text-teal-600 w-8 h-8" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Visual Aid for {type}
          </span>
        </div>
      </div>

      <div className="bg-teal-50 p-6 rounded-3xl border border-teal-100">
        <div className="flex gap-4">
          <Info className="w-6 h-6 text-teal-600 shrink-0" />
          <p className="text-sm text-teal-800 font-medium leading-relaxed italic">
            {helperText}
          </p>
        </div>
      </div>
    </div>
  );
}