"use client";

import React, { useState } from 'react';
import {
  Activity,
  ArrowLeft,
  Flame,
  Droplets,
  Zap,
  Wind,
  Skull,
  ChevronRight,
  Info
} from 'lucide-react';
import Card from '@/components/UI/Card';
import SButton from '@/components/UI/SButton';
import { useRouter } from 'next/navigation';



/**
 * EMERGENCY SELECTION SCREEN
 */
export default function EmergencySelection() {
  const [currentPath, setCurrentPath] = useState('selection');
  const router = useRouter()

  const emergencies = [
    {
      id: 'seizure',
      title: 'Seizure',
      subtext: 'Tap to begin',
      icon: <Zap className="w-6 h-6 text-amber-500" />,
      color: 'bg-amber-50',
      route: '/emergency/seizure'
    },
    {
      id: 'bleeding',
      title: 'Severe Bleeding',
      subtext: 'Tap to begin',
      icon: <Droplets className="w-6 h-6 text-rose-500" />,
      color: 'bg-rose-50',
      route: '/emergency/bleeding'
    },
    {
      id: 'burns',
      title: 'Burns',
      subtext: 'Tap to begin',
      icon: <Flame className="w-6 h-6 text-orange-500" />,
      color: 'bg-orange-50',
      route: '/emergency/burns'
    },
    {
      id: 'choking',
      title: 'Choking',
      subtext: 'Tap to begin',
      icon: <Wind className="w-6 h-6 text-blue-500" />,
      color: 'bg-blue-50',
      route: '/emergency/choking'
    },
    {
      id: 'snakebite',
      title: 'Snake Bite',
      subtext: 'Coming soon',
      icon: <Skull className="w-6 h-6 text-slate-400" />,
      color: 'bg-slate-50',
      disabled: true,
      route: '/emergency/snakebite'
    }
  ];

  const handleSelection = (id: string) => {
    console.log(`Routing to emergency flow: ${id}`);
    // In a real app, use: router.push(`/emergency/${id}`)
    setCurrentPath(id);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-12">

      {/* --- Header --- */}
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

      {/* --- Title Section --- */}
      <section className="px-6 pt-8 pb-6 max-w-2xl mx-auto">
        <h1 className="text-3xl font-black text-slate-900 leading-tight mb-2">
          What is happening right now?
        </h1>
        <p className="text-slate-500 font-medium leading-relaxed">
          Choose the closest match. You can&apos;t make it worse by choosing.
        </p>
      </section>

      {/* --- Emergency Grid --- */}
      <section className="px-6 grid grid-cols-2 gap-4 max-w-2xl mx-auto">
        {emergencies.map((item) => (
          <Card
            key={item.id}
            disabled={item.disabled}
            onClick={() => {handleSelection(item.id); router.push(item.route)}}
            className="flex flex-col gap-4 h-full"
          >
            <div className={`${item.color} w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm`}>
              {item.icon}
            </div>
            <div>
              <h2 className="font-bold text-slate-800 text-lg leading-tight mb-1">
                {item.title}
              </h2>
              <p className={`text-xs font-bold uppercase tracking-wider ${item.disabled ? 'text-slate-400' : 'text-teal-600'}`}>
                {item.subtext}
              </p>
            </div>
            {!item.disabled && (
              <div className="mt-auto flex justify-end">
                <ChevronRight className="w-5 h-5 text-slate-300" />
              </div>
            )}
          </Card>
        ))}
      </section>

      {/* --- Guidance Footer --- */}
      <section className="px-6 mt-12 max-w-2xl mx-auto">
        <div className="bg-teal-900 rounded-[2.5rem] p-6 text-white relative overflow-hidden shadow-xl">
          <div className="relative z-10 flex gap-4">
            <div className="bg-teal-400/20 p-2 rounded-xl h-fit">
              <Info className="w-6 h-6 text-teal-200" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1">Not sure what to pick?</h3>
              <p className="text-teal-100/80 text-sm leading-relaxed mb-4">
                If the person is unconscious and not breathing, start with basic CPR or pick the closest symptom.
              </p>
              <SButton variant="secondary" className="py-2 text-sm border-teal-400 text-teal-100 hover:bg-teal-800">
                General Life Support
              </SButton>
            </div>
          </div>
          {/* Decorative background circle */}
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-teal-800 rounded-full blur-2xl opacity-50" />
        </div>
      </section>

      {/* --- Disclaimer --- */}
      <footer className="px-10 mt-12 text-center max-w-2xl mx-auto">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-loose">
          EFAA provides guidance but does not replace professional medical intervention.
          Call your local emergency number if possible.
        </p>
      </footer>
    </div>
  );
}