"use client";

import React from 'react';
import { Heart, MessageSquare, Users, Lightbulb } from 'lucide-react';

export default function HomeFooter() {
  const links = [
    { label: "Support EFAA", icon: Heart, color: "text-rose-500", href: "#" },
    { label: "Suggest Topic", icon: MessageSquare, color: "text-teal-500", href: "#" },
    { label: "Volunteer", icon: Users, color: "text-blue-500", href: "#" },
    { label: "Feedback", icon: Lightbulb, color: "text-amber-500", href: "#" },
  ];

  return (
    <footer className="px-6 py-12 border-t border-slate-100 mt-8 max-w-2xl mx-auto space-y-8">
      <div className="grid grid-cols-2 gap-4">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <a
              key={link.label}
              href={link.href}
              className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100 text-xs font-black text-slate-600 hover:bg-slate-50 hover:border-slate-200 transition-all shadow-sm"
            >
              <Icon className={`w-4 h-4 ${link.color}`} />
              {link.label}
            </a>
          );
        })}
      </div>

      <div className="text-center space-y-2">
        <div className="inline-block px-4 py-1 bg-slate-100 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-tighter">
          Medical Disclaimer
        </div>
        <p className="text-[10px] text-slate-400 font-medium leading-relaxed uppercase tracking-tight px-4">
          EFAA is a support tool and not a replacement for professional medical help.
          Always contact local emergency services immediately in critical situations.
        </p>
      </div>
    </footer>
  );
}