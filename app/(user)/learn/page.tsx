"use client";
import React, { useState } from 'react';
import {
  ChevronRight,
  Activity,
  Droplets,
  Flame,
  Wind,
  Skull,
  ArrowLeft
} from 'lucide-react';
import Card from '@/components/UI/Card';
import LearnCondition from '@/components/learning/LearnCondition';


const CONDITIONS = [
  { id: 'seizure', title: 'Seizure', icon: <Activity className="text-teal-600" />, color: 'bg-teal-50' },
  { id: 'bleeding', title: 'Severe Bleeding', icon: <Droplets className="text-rose-500" />, color: 'bg-rose-50', disabled: true },
  { id: 'burns', title: 'Burns', icon: <Flame className="text-orange-500" />, color: 'bg-orange-50', disabled: true },
  { id: 'choking', title: 'Choking', icon: <Wind className="text-blue-500" />, color: 'bg-blue-50', disabled: true },
  { id: 'snakebite', title: 'Snake Bite', icon: <Skull className="text-slate-400" />, color: 'bg-slate-50', disabled: true },
];





/**
 * SUB-PAGE COMPONENTS
 */

const LearningHome = ({ onSelect }: { onSelect: (id: string) => void }) => (
  <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
    <header className="mb-10">
      <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">
        Learn First Aid
      </h1>
      <p className="text-lg text-slate-500 font-medium leading-relaxed">
        One skill at a time — built for clarity and confidence.
      </p>
    </header>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {CONDITIONS.map((c) => (
        <Card
          key={c.id}
          onClick={c.disabled ? undefined : () => onSelect(c.id)}
          className={c.disabled ? "opacity-60 grayscale" : ""}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`${c.color} w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner`}>
                {c.icon}
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg">{c.title}</h3>
                <p className="text-xs font-bold text-teal-600 uppercase tracking-widest mt-0.5">
                  {c.disabled ? "Coming Soon" : "Tap to learn"}
                </p>
              </div>
            </div>
            {!c.disabled && <ChevronRight className="w-5 h-5 text-slate-300" />}
          </div>
        </Card>
      ))}
    </div>
  </div>
);



/**
 * MAIN APP CONTAINER (ROUTING SIMULATION)
 */
export default function App() {
  const [view, setView] = useState<'home' | 'condition'>('home');
  const [selectedId, setSelectedId] = useState<string>('');

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setView('condition');
  };

  const handleBack = () => {
    setView('home');
    setSelectedId('');
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden selection:bg-teal-100">
      <header className="bg-white px-6 py-4 flex items-center gap-4 sticky top-0 z-50 border-b border-slate-100">
        <button
          onClick={() => window.history.back()}
          className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-2">
          <div className="bg-teal-700 p-1.5 rounded-lg">
            <Activity className="text-white w-5 h-5" />
          </div>
          <span className="font-black tracking-tighter text-teal-800 text-lg uppercase">EFAA</span>
        </div>
      </header>
      <div className="max-w-4xl mx-auto px-6 pt-12 pb-24 min-h-screen flex flex-col">
        {view === 'home' ? (
          <LearningHome onSelect={handleSelect} />
        ) : (
          <LearnCondition conditionId={selectedId} onBack={handleBack} />
        )}
      </div>

      {/* Footer Branding */}
      {view === 'home' && (
        <footer className="mt-auto py-12 px-6 border-t border-slate-50 text-center">
          <div className="flex items-center justify-center gap-2 mb-4 opacity-40">
            <div className="bg-teal-700 p-1 rounded-md">
              <Activity className="text-white w-4 h-4" />
            </div>
            <span className="font-black text-teal-800 uppercase tracking-tighter">EFAA</span>
          </div>
          <p className="text-[10px] text-slate-300 font-bold uppercase tracking-[0.2em]">
            First Aid Education for Nigeria
          </p>
        </footer>
      )}
    </div>
  );
}