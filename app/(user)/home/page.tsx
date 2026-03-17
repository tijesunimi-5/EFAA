"use client";

import React from 'react';
import Header from '@/components/UI/Header';
import WelcomeHeader from '@/components/home/WelcomeHeader';
import ActionCards from '@/components/home/ActionCards';
import HealthNudge from '@/components/home/HealthNudge';
import HomeFooter from '@/components/home/Footer';
import MobileNav from '@/components/home/MobileNav';

export default function HomeScreen() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-24">

      <main className="max-w-2xl mx-auto space-y-8">
        <WelcomeHeader />

        <section className="px-6 space-y-4">
          <ActionCards />
        </section>

        <HealthNudge />
      </main>

      <HomeFooter />
      <MobileNav />
    </div>
  );
}