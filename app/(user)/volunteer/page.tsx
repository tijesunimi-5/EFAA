"use client";

import React, { useState } from 'react';
import { Users, Code, Stethoscope, Megaphone, Send, CheckCircle2 } from 'lucide-react';
import Card from '@/components/UI/Card';
import SButton from '@/components/UI/SButton';
import { useAPI } from '@/components/hook/callApi';
import { useAlert } from '@/components/context/Alert';
import NavHeader from '@/components/UI/NavHeader';

export default function VolunteerPage() {
  const { callApi } = useAPI();
  const { showAlert } = useAlert();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRole, setSelectedRole] = useState('clinical');
  const [formData, setFormData] = useState({ bio: '', availability: 'weekends' });

  const roles = [
    { id: 'clinical', title: 'Clinical Squad', icon: <Stethoscope />, desc: 'Review guidelines for medical accuracy.' },
    { id: 'tech', title: 'Technical Squad', icon: <Code />, desc: 'Build the engine and maintain the PWA.' },
    { id: 'outreach', title: 'Outreach Squad', icon: <Megaphone />, desc: 'Translate and promote EFAA in communities.' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await callApi('/volunteer/apply', 'POST', {
        role: selectedRole,
        ...formData
      });
      if (result.success) {
        showAlert("Application received! We will contact you soon.", "success");
        setFormData({ bio: '', availability: 'weekends' });
      }
    } catch (err) {
      showAlert("Error sending application. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-6 space-y-16 animate-in fade-in duration-700">
      <NavHeader />

      {/* 1. HERO */}
      <header className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-[10px] font-black uppercase tracking-widest">
          <Users className="w-4 h-4" /> Join the Mission
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase leading-none">
          Become a <br /> <span className="text-teal-700">Lifesaver.</span>
        </h1>
        <p className="text-xl text-slate-500 font-medium leading-relaxed">
          EFAA is built by volunteers. Use your skills to help us provide
          clinical guidance to millions of Nigerians.
        </p>
      </header>

      {/* 2. ROLE SELECTION */}
      <section className="space-y-6">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Select Your Squad</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => setSelectedRole(role.id)}
              className={`text-left p-8 rounded-[2rem] border-2 transition-all group ${selectedRole === role.id
                  ? 'border-teal-600 bg-teal-50/50 shadow-xl shadow-teal-500/5'
                  : 'border-slate-100 hover:border-slate-200 bg-white'
                }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-colors ${selectedRole === role.id ? 'bg-teal-700 text-white' : 'bg-slate-50 text-slate-400'
                }`}>
                {role.icon}
              </div>
              <h4 className="font-black text-slate-900 uppercase tracking-tight mb-2">{role.title}</h4>
              <p className="text-sm text-slate-500 font-medium leading-snug">{role.desc}</p>
            </button>
          ))}
        </div>
      </section>

      {/* 3. APPLICATION FORM */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        <div className="space-y-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Why do you want to join?</label>
            <textarea
              required
              rows={4}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Tell us about your background and how you can help..."
              className="w-full p-5 bg-slate-50 border border-slate-200 rounded-3xl focus:border-teal-500 outline-none font-bold transition-all resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Primary Availability</label>
            <select
              value={formData.availability}
              onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
              className="w-full p-5 bg-slate-50 border border-slate-200 rounded-3xl focus:border-teal-500 outline-none font-bold transition-all appearance-none"
            >
              <option value="weekends">Weekends Only</option>
              <option value="part-time">Part-time (Few hours/week)</option>
              <option value="full-time">Full-time Support</option>
            </select>
          </div>

          <SButton
            disabled={isSubmitting}
            className="w-full py-5 text-lg font-black uppercase tracking-widest group"
          >
            {isSubmitting ? "Sending Application..." : "Submit Application"}
            <Send className="ml-2 w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </SButton>
        </div>

        <aside className="space-y-8 bg-slate-900 p-10 rounded-[3rem] text-white">
          <h3 className="text-xl font-black uppercase tracking-tight">The Volunteer Pact</h3>
          <div className="space-y-6">
            <PactItem text="I will uphold clinical accuracy above all else." />
            <PactItem text="I will respect user privacy and data security." />
            <PactItem text="I am committed to the mission of saving lives." />
          </div>
        </aside>
      </form>
    </div>
  );
}

function PactItem({ text }: { text: string }) {
  return (
    <div className="flex gap-4">
      <CheckCircle2 className="text-teal-400 w-6 h-6 shrink-0" />
      <p className="text-slate-300 font-medium">{text}</p>
    </div>
  );
}