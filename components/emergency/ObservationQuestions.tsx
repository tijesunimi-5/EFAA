"use client";
import React from 'react';
import { Check, X } from 'lucide-react';

interface Props {
  title: string;
  text: string;
  options: { label: string; next: string }[];
  onAnswer: (next: string) => void;
}

export default function ObservationQuestions({ title, text, options, onAnswer }: Props) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-slate-900 mb-2 uppercase tracking-tight">
          {title}
        </h2>
        <p className="text-slate-500 font-medium">Observe the patient and respond.</p>
      </div>

      <div className="bg-white rounded-4xl p-8 shadow-xl border border-slate-100 mb-8">
        <p className="text-2xl font-bold text-slate-800 mb-10 leading-snug">{text}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {options.map((opt, i) => (
            <button
              key={i}
              onClick={() => onAnswer(opt.next)}
              className={`h-24 rounded-3xl flex flex-col items-center justify-center gap-1 text-xl font-bold transition-all active:scale-95 border-2 ${i === 0
                  ? 'bg-teal-50 text-teal-700 border-teal-100 hover:bg-teal-100'
                  : 'bg-slate-50 text-slate-600 border-slate-100 hover:bg-slate-100'
                }`}
            >
              {i === 0 ? <Check className="w-6 h-6" /> : <X className="w-6 h-6" />}
              {opt.label.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => onAnswer('end')}
        className="w-full text-center text-slate-400 font-bold uppercase tracking-widest text-[10px] hover:text-rose-500 transition-colors"
      >
        Skip Assessment
      </button>
    </div>
  );
}