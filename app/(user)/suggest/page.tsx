"use client";

import React, { useState } from 'react';
import { Lightbulb, Send, MessageSquare, AlertCircle, CheckCircle2 } from 'lucide-react';
import Card from '@/components/UI/Card';
import SButton from '@/components/UI/SButton';
import { useAPI } from '@/components/hook/callApi'; // Using your secure API hook
import { useAlert } from '@/components/context/Alert';
import NavHeader from '@/components/UI/NavHeader';

export default function SuggestTopicPage() {
  const { callApi } = useAPI();
  const { showAlert } = useAlert();

  const [formData, setFormData] = useState({ title: '', description: '', urgency: 'medium' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await callApi('/topics/suggest', 'POST', formData);
      if (result.success) {
        showAlert("Topic suggested successfully! Our clinical team will review it.", "success");
        setFormData({ title: '', description: '', urgency: 'medium' });
      }
    } catch (err) {
      showAlert("Failed to send suggestion. Please check your connection.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 space-y-12 animate-in fade-in duration-700">
      <NavHeader />
      <header className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-[10px] font-black uppercase tracking-widest">
          <Lightbulb className="w-4 h-4" /> Expand the Textbook
        </div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Suggest a Topic</h1>
        <p className="text-lg text-slate-500 font-medium leading-relaxed">
          Is there an emergency scenario we haven&apos;t covered? Tell us what guidelines
          your community needs.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card className="p-8 space-y-6 border-slate-100 shadow-xl shadow-slate-100/50">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Emergency Scenario Title</label>
            <input
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Electric Shock or Chemical Burns"
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-teal-500 outline-none font-bold transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Why is this needed?</label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Briefly describe the situation and why a guideline is important..."
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-teal-500 outline-none font-bold transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['low', 'medium', 'high'].map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setFormData({ ...formData, urgency: level })}
                className={`p-4 rounded-2xl border-2 font-black uppercase text-xs tracking-widest transition-all ${formData.urgency === level
                    ? 'border-teal-600 bg-teal-50 text-teal-700'
                    : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200'
                  }`}
              >
                {level} Urgency
              </button>
            ))}
          </div>
        </Card>

        <SButton
          disabled={isSubmitting}
          className="w-full py-5 text-lg font-black uppercase tracking-widest"
        >
          {isSubmitting ? "Sending to Medics..." : "Submit Suggestion"}
          <Send className="ml-2 w-5 h-5" />
        </SButton>
      </form>
    </div>
  );
}