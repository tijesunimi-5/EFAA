"use client";

import React, { useState } from 'react';
import {
  Activity,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { useAPI } from '@/components/hook/callApi';
import { useRouter } from 'next/navigation'; // Use the real router

/**
 * USER LOGIN PAGE
 * A clean, focused login experience for EFAA responders.
 */

export default function App() {
  const router = useRouter();
  const { callApi } = useAPI();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Inside handleLogin function
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await callApi('/login', 'POST', { email, password });

      if (result.success && result.token) {
        // 1. First, update localStorage explicitly
        localStorage.setItem('efaa_token', result.token);
        localStorage.setItem('efaa_user', JSON.stringify(result.user));
        localStorage.setItem('efaa_has_account', 'true');

        // 2. Brief delay to ensure storage is committed before navigation
        setTimeout(() => {
          router.push('/home');
        }, 100);

      } else {
        setError(result.message || "Invalid email or password.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Connection failed. Please check your internet.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans text-slate-900">

      {/* Brand Header */}
      <div className="mb-10 text-center animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="bg-teal-700 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-teal-100">
          <Activity className="text-white w-9 h-9" />
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">EFAA</h1>
        <p className="text-slate-500 font-medium mt-1 uppercase text-[10px] tracking-[0.2em]">Africa&apos;s First Aid Companion</p>
      </div>

      <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-500">
        <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-2xl shadow-slate-200/60 border border-slate-100">

          <div className="mb-8 text-center sm:text-left">
            <h2 className="text-2xl font-bold text-slate-800">Welcome Back</h2>
            <p className="text-slate-400 text-sm font-medium">Please sign in to access your dashboard.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 animate-in shake duration-300">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p className="text-xs font-bold uppercase tracking-tight">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-600 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/5 transition-all font-bold text-slate-700 placeholder:text-slate-300 placeholder:font-normal"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-1">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Password</label>
                <button type="button" className="text-[10px] font-black text-teal-700 uppercase hover:underline">Forgot?</button>
              </div>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-600 transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/5 transition-all font-bold text-slate-700 placeholder:text-slate-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-teal-700 text-white py-4 rounded-2xl font-black text-lg shadow-lg shadow-teal-100 hover:bg-teal-800 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Sign In <ArrowRight className="w-5 h-5" /></>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-50 text-center">
            <p className="text-slate-500 font-medium text-sm">
              Don&apos;t have an account? <br className="sm:hidden" />
              <button
                onClick={() => router.push('/onboarding?step=1')}
                className="text-teal-700 font-black uppercase tracking-tight ml-1 hover:underline"
              >
                Join Community
              </button>
            </p>
          </div>
        </div>

        {/* Trust Badge */}
        <div className="mt-8 flex items-center justify-center gap-2 text-slate-300 font-bold text-[10px] uppercase tracking-[0.2em]">
          <ShieldCheck className="w-4 h-4" /> Secure Responder Access
        </div>
      </div>
    </div>
  );
}