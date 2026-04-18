"use client";

import React, { useState } from 'react';
import { Star, Send, MessageSquare, Bug, Layout, BookOpen } from 'lucide-react';
import Card from '@/components/UI/Card';
import SButton from '@/components/UI/SButton';
import { useAPI } from '@/components/hook/callApi';
import { useAlert } from '@/components/context/Alert';
import NavHeader from '@/components/UI/NavHeader';

export default function FeedbackPage() {
  const { callApi } = useAPI();
  const { showAlert } = useAlert();

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [formData, setFormData] = useState({ category: 'ui', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { id: 'ui', label: 'Design/UI', icon: <Layout className="w-4 h-4" /> },
    { id: 'content', label: 'Medical Content', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'bug', label: 'Report a Bug', icon: <Bug className="w-4 h-4" /> },
    { id: 'other', label: 'Other', icon: <MessageSquare className="w-4 h-4" /> },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return showAlert("Please select a rating", "error");

    setIsSubmitting(true);
    try {
      const result = await callApi('/feedback', 'POST', { ...formData, rating });
      if (result.success) {
        showAlert("Feedback sent! Thank you for helping us improve.", "success");
        setRating(0);
        setFormData({ category: 'ui', message: '' });
      }
    } catch (err) {
      showAlert("Could not send feedback. Try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 space-y-12 animate-in fade-in duration-700">
      <NavHeader />
      <header className="space-y-4 text-center">
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Improve EFAA</h1>
        <p className="text-lg text-slate-500 font-medium">Your feedback directly shapes the future of emergency response in Nigeria.</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card className="p-8 space-y-10 border-slate-100">

          {/* RATING SECTION */}
          <div className="space-y-4 text-center">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Experience Rating</label>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  className="transition-transform active:scale-90"
                >
                  <Star
                    className={`w-10 h-10 ${(hover || rating) >= star ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                      } transition-colors`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* CATEGORY SELECTOR */}
          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center block">What are you giving feedback on?</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, category: cat.id })}
                  className={`flex items-center justify-center gap-2 p-4 rounded-2xl border-2 font-bold text-xs transition-all ${formData.category === cat.id
                      ? 'border-teal-600 bg-teal-50 text-teal-700'
                      : 'border-slate-50 bg-slate-50 text-slate-400 hover:border-slate-200'
                    }`}
                >
                  {cat.icon} {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* MESSAGE */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Your Message</label>
            <textarea
              required
              rows={5}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Tell us what you liked or what needs work..."
              className="w-full p-5 bg-slate-50 border border-slate-200 rounded-3xl focus:border-teal-500 outline-none font-bold transition-all resize-none"
            />
          </div>
        </Card>

        <SButton
          disabled={isSubmitting}
          className="w-full py-5 text-lg font-black uppercase tracking-widest"
        >
          {isSubmitting ? "Sending..." : "Submit Feedback"}
          <Send className="ml-2 w-5 h-5" />
        </SButton>
      </form>
    </div>
  );
}