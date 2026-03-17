"use client";

import React, { useEffect, useState } from 'react';
import {
   Droplets,  Wind, 
  ChevronRight, Info, ArrowLeft, Activity,
  HeartPulse, Thermometer, ShieldAlert, LucideIcon
} from 'lucide-react';
import Card from '@/components/UI/Card';
import SButton from '@/components/UI/SButton';
import { useRouter } from 'next/navigation';
import { useAPI } from '@/components/hook/callApi';

interface Protocol {
  id: string;
  slug: string;
  title: string;
  category: string;
}

// Map database categories to UI styles
const categoryStyles: Record<string, { icon: LucideIcon; color: string; bgColor: string }> = {
  Trauma: { icon: Droplets, color: 'text-rose-500', bgColor: 'bg-rose-50' },
  Respiratory: { icon: Wind, color: 'text-blue-500', bgColor: 'bg-blue-50' },
  Cardiac: { icon: HeartPulse, color: 'text-red-600', bgColor: 'bg-red-50' },
  Environmental: { icon: Thermometer, color: 'text-orange-500', bgColor: 'bg-orange-50' },
  General: { icon: Activity, color: 'text-teal-600', bgColor: 'bg-teal-50' },
};

export default function EmergencySelection() {
  const router = useRouter();
  const { callApi } = useAPI();
  const [protocols, setProtocols] = useState<Protocol[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProtocols = async () => {
      try {
        const res = await callApi<{ data: Protocol[] }>('/protocols', 'GET');
        if (res.success && res.data) {
          setProtocols(res.data);
        }
      } catch (err) {
        console.error("Failed to load protocols", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProtocols();
  }, [callApi]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <section className="px-6 pt-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-400 hover:text-teal-700 transition-colors font-bold text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>
      </section>

      <section className="px-6 pt-8 pb-6">
        <h1 className="text-3xl font-black text-slate-900 leading-tight mb-2">
          What is happening?
        </h1>
        <p className="text-slate-500 font-medium leading-relaxed">
          Select a guide to begin immediate assistance.
        </p>
      </section>

      <section className="px-6 grid grid-cols-2 gap-4">
        {loading ? (
          // Skeleton Loader
          [1, 2, 3, 4].map((n) => (
            <div key={n} className="h-40 bg-white border border-slate-100 rounded-4xl animate-pulse" />
          ))
        ) : (
          protocols.map((item) => {
            const style = categoryStyles[item.category] || categoryStyles.General;
            const Icon = style.icon;

            return (
              <Card
                key={item.id}
                onClick={() => router.push(`/emergency/${item.slug}`)}
                className="flex flex-col gap-4 h-full group active:scale-95 transition-all"
              >
                <div className={`${style.bgColor} w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-6 h-6 ${style.color}`} />
                </div>
                <div>
                  <h2 className="font-bold text-slate-800 text-lg leading-tight mb-1">
                    {item.title}
                  </h2>
                  <p className="text-[10px] font-black uppercase tracking-wider text-teal-600">
                    Tap to begin
                  </p>
                </div>
                <div className="mt-auto flex justify-end">
                  <ChevronRight className="w-5 h-5 text-slate-200 group-hover:text-teal-500 transition-colors" />
                </div>
              </Card>
            );
          })
        )}

        {/* Static "Coming Soon" or Other types if needed */}
        {!loading && protocols.length === 0 && (
          <div className="col-span-2 py-10 text-center">
            <ShieldAlert className="w-12 h-12 text-slate-200 mx-auto mb-2" />
            <p className="text-slate-400 font-bold uppercase text-xs">No guides published yet</p>
          </div>
        )}
      </section>

      <section className="px-6 mt-12 pb-10">
        <div className="bg-teal-900 rounded-4xl p-8 text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10 flex flex-col gap-4">
            <div className="bg-teal-400/20 p-3 rounded-2xl h-fit w-fit">
              <Info className="w-6 h-6 text-teal-200" />
            </div>
            <div>
              <h3 className="font-bold text-xl mb-2 text-white">Not sure what to pick?</h3>
              <p className="text-teal-100/70 text-sm leading-relaxed mb-6">
                If the person is unconscious and not breathing, start with <strong>Basic Life Support</strong>.
              </p>
              <SButton
                variant="secondary"
                className="w-full py-4 text-sm border-teal-700 text-teal-100 hover:bg-teal-800"
                onClick={() => router.push('/emergency/general-life-support')}
              >
                General Life Support
              </SButton>
            </div>
          </div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-teal-800 rounded-full blur-3xl opacity-50" />
        </div>
      </section>
    </div>
  );
}