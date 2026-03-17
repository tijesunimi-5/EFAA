"use client";
import React from 'react';
import { ChevronRight } from 'lucide-react';

interface Props {
  onNext: () => void;
  isLast: boolean;
  isFinished?: boolean;       // Added optional prop
  onCantContinue?: () => void; // Added optional prop
}

export default function ActionControls({ onNext, isLast, isFinished, onCantContinue }: Props) {
  return (
    <div className="fixed bottom-8 left-6 right-6 max-w-4xl mx-auto space-y-4">
      <button
        onClick={onNext}
        className="w-full py-6 bg-teal-700 text-white rounded-3xl font-black text-xl shadow-2xl hover:bg-teal-800 active:scale-95 transition-all flex items-center justify-center gap-3"
      >
        {isFinished ? "FINISH" : isLast ? "COMPLETE GUIDE" : "NEXT STEP"}
        <ChevronRight className="w-6 h-6" />
      </button>

      {onCantContinue && !isFinished && (
        <button
          onClick={onCantContinue}
          className="w-full text-center text-slate-400 font-bold uppercase tracking-widest text-[10px] py-2"
        >
          I can&apos;t perform this action
        </button>
      )}
    </div>
  );
}