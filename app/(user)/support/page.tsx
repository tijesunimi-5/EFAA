"use client";

import React, { useEffect } from 'react';
import {
  Heart, Share2, ShieldCheck, Zap, Globe,
  Users, ExternalLink, MessageSquare, Copy
} from 'lucide-react';
import Card from '@/components/UI/Card';
import SButton from '@/components/UI/SButton';
import { useAlert } from '@/components/context/Alert';
import { useSearchParams } from 'next/navigation';
import NavHeader from '@/components/UI/NavHeader';

export default function SupportPage() {
  const { showAlert } = useAlert();

  // REPLACE THESE WITH YOUR ACTUAL LINKS
  // Inside SupportPage component
  const PAYSTACK_LINK = process.env.NEXT_PUBLIC_PAYSTACK_SUPPORT_URL || "#";
  const WHATSAPP_SHARE = "https://api.whatsapp.com/send?text=I%20just%20supported%20EFAA%2C%20Africa%27s%20first-aid%20companion.%20Check%20it%20out%3A%20https%3A%2F%2Fefaa-two.vercel.app";
  const GITHUB_LINK = "https://github.com/tijesunimi-5/EFAA";

  const handleCopyLink = () => {
    navigator.clipboard.writeText("https://efaa-two.vercel.app");
    showAlert("Link copied to clipboard!", "success");
  };

  const fundingUsage = [
    {
      label: "Cloud & Infrastructure",
      percentage: 60,
      detail: "Keeping our servers active 24/7 so the PWA textbook is available even in remote areas."
    },
    {
      label: "Medical Verification",
      percentage: 30,
      detail: "Hiring certified medical professionals to vet and approve every interactive guideline."
    },
    {
      label: "Local Expansion",
      percentage: 10,
      detail: "Translating content into Yoruba, Igbo, and Hausa for maximum accessibility."
    },
  ];

  // Inside your SupportPage component
  const searchParams = useSearchParams();
  const status = searchParams.get('status');

  useEffect(() => {
    if (status === 'success') {
      showAlert("Transaction Successful! Thank you for supporting EFAA.", "success");
      // Clear the URL so the alert doesn't show again on refresh
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [status, showAlert]);

  return (
    <div className="max-w-5xl mx-auto py-12 px-6 space-y-16 animate-in fade-in duration-700">
      <NavHeader />

      {/* 1. HERO: MISSION STATEMENT */}
      <header className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 rounded-full text-xs font-black uppercase tracking-widest">
          <Heart className="w-4 h-4 fill-current" /> Support the Mission
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter">
          Help us save <span className="text-teal-700">lives</span> across Africa.
        </h1>
        <p className="text-xl text-slate-500 font-medium leading-relaxed">
          EFAA is a non-profit initiative. Every naira or share helps us provide free,
          clinical-grade first aid guidelines to those who need them most.
        </p>
      </header>

      {/* 2. THE PATHS OF SUPPORT (The "How") */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Financial Support */}
        <Card className="p-8 space-y-6 border-2 border-slate-100 hover:border-teal-500/20 transition-all">
          <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center">
            <Zap className="text-amber-500 w-7 h-7" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">Send Funds</h3>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">
              Directly fuel our development and medical research through Paystack.
            </p>
          </div>
          <a href={PAYSTACK_LINK} target="_blank" rel="noopener noreferrer">
            <SButton variant="primary" className="w-full justify-between py-4">
              Paystack <ExternalLink className="w-4 h-4" />
            </SButton>
          </a>
        </Card>

        {/* Community Share */}
        <Card className="p-8 space-y-6 border-2 border-slate-100 hover:border-teal-500/20 transition-all">
          <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center">
            <Share2 className="text-blue-500 w-7 h-7" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">Spread EFAA</h3>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">
              Awareness is protection. Share the EFAA textbook with your community.
            </p>
          </div>
          <div className="flex gap-2">
            <a href={WHATSAPP_SHARE} target="_blank" className="flex-1">
              <SButton variant="secondary" className="w-full py-4 text-xs font-black">WhatsApp</SButton>
            </a>
            <button onClick={handleCopyLink} className="p-4 bg-slate-100 rounded-2xl hover:bg-slate-200 transition-colors">
              <Copy className="w-4 h-4 text-slate-600" />
            </button>
          </div>
        </Card>

        {/* Technical Help */}
        <Card className="p-8 space-y-6 border-2 border-slate-100 hover:border-teal-500/20 transition-all">
          <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center">
            <Globe className="text-teal-500 w-7 h-7" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">Open Source</h3>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">
              Help us refine the decision trees or contribute to the code on GitHub.
            </p>
          </div>
          <a href={GITHUB_LINK} target="_blank" className="block">
            <SButton variant="secondary" className="w-full justify-between py-4">
              GitHub Repo <ExternalLink className="w-4 h-4" />
            </SButton>
          </a>
        </Card>
      </section>

      {/* 3. TRANSPARENCY: WHERE THE MONEY GOES */}
      <section className="bg-slate-50 rounded-[3rem] p-8 md:p-12 space-y-10">
        <div className="space-y-2">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Operational Transparency</h3>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">How we utilize your support.</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {fundingUsage.map((item) => (
            <div key={item.label} className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="font-black text-slate-800 uppercase tracking-widest text-[10px]">{item.label}</span>
                <span className="text-4xl font-black text-teal-700">{item.percentage}%</span>
              </div>
              <div className="h-3 w-full bg-white rounded-full overflow-hidden shadow-inner">
                <div className="h-full bg-teal-700 rounded-full" style={{ width: `${item.percentage}%` }} />
              </div>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">{item.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. CALL TO ACTION: FEEDBACK */}
      <Card className="bg-slate-900 border-none p-10 md:p-16 text-center space-y-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 blur-[100px] rounded-full -mr-32 -mt-32" />
        <MessageSquare className="w-12 h-12 text-teal-500 mx-auto" />
        <div className="space-y-4 relative z-10">
          <h2 className="text-3xl font-black text-white tracking-tight">Have a specific way to help?</h2>
          <p className="text-slate-400 max-w-xl mx-auto font-medium text-lg">
            We are always looking for hospital partnerships, data sponsorships, and clinical reviewers.
          </p>
        </div>
        <a
          href="mailto:tijesunimiidowu16@gmail.com?subject=EFAA%20Partnership%20Inquiry&body=Hello%20EFAA%20Team%2C%0A%0AI%20am%20interested%20in%20supporting%20the%20project%20via..."
          className="inline-block relative z-10"
        >
          <SButton variant="secondary" className="px-12 py-5 text-lg font-black uppercase tracking-widest">
            Email the Team
          </SButton>
        </a>
      </Card>
    </div>
  );
}

