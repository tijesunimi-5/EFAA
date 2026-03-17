"use client";
import { Phone, AlertCircle } from 'lucide-react';

export default function EmergencyEscalationCard() {
  return (
    <div className="bg-rose-600 rounded-4xl p-6 text-white shadow-xl w-full">
      <div className="flex items-center gap-4 mb-6">
        <AlertCircle className="w-8 h-8" />
        <h3 className="font-black text-lg uppercase">Emergency Contact</h3>
      </div>
      <a
        href="tel:112"
        className="w-full bg-white text-rose-600 py-4 rounded-2xl font-black text-xl flex items-center justify-center gap-3 active:scale-95 transition-all"
      >
        <Phone className="w-6 h-6 fill-current" /> CALL 112
      </a>
    </div>
  );
}