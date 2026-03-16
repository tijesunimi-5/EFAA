"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Activity, Mail, Lock, User as UserIcon, ArrowRight, AlertCircle } from 'lucide-react';
import { useAPI } from '@/components/hook/callApi';
import { useUser } from '@/components/context/User';

type AdminUser = {
  id: string;
  fullName?: string;
  full_name?: string;
  email: string;
  role: string;
  state?: string;
};

type AuthResponse = {
  success: boolean;
  token?: string;
  message?: string;
  user?: AdminUser;
};

/**
 * ADMIN AUTH TOGGLE
 * Set this to 'true' to allow new medical students to register.
 * Set to 'false' for standard login only.
 */
const ALLOW_REGISTRATION = true;

export default function AdminAuth() {
  const router = useRouter();
  const { callApi } = useAPI();
  const { setUser } = useUser();

  const [isLogin, setIsLogin] = useState(!ALLOW_REGISTRATION);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const endpoint = isLogin ? '/admin/login' : '/admin/register';

    try {
      // Cast callApi to a specific function signature to avoid 'any' while handling generics
      const result = await (callApi as <T>(...args: [string, string, object]) => Promise<T>)(
        endpoint,
        'POST',
        formData
      ) as AuthResponse;

      if (result.success && result.user) {
        if (typeof window !== 'undefined' && result.token) {
          localStorage.setItem('efaa_token', String(result.token));
        }

        // Mapping backend keys to the User Context interface requirements
        setUser({
          fullName: result.user.fullName || result.user.full_name || 'Admin User',
          email: result.user.email,
          state: result.user.state || 'Federal'
        });

        router.push('/admin/dashboard');
      } else {
        setError(result.message || "Authentication failed.");
      }
    } catch (err) {
      console.error("Auth error:", err);
      setError("Connection error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-slate-900">
      <div className="mb-10 text-center">
        <div className="bg-teal-900 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
          <Activity className="text-white w-9 h-9" />
        </div>
        <h1 className="text-3xl font-black text-teal-900 tracking-tight uppercase">EFAA Admin</h1>
        <p className="text-slate-500 font-bold mt-1 text-[10px] uppercase tracking-[0.2em]">Clinical Control Center</p>
      </div>

      <div className="w-full max-w-md">
        <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-2xl border border-slate-100">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-slate-800">
              {isLogin ? "Medic Login" : "Medic Registration"}
            </h2>
            <p className="text-slate-400 text-sm">Authorized personnel only.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p className="text-xs font-bold uppercase">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    required
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-teal-500 transition-all font-bold"
                    placeholder="Dr. Jane Doe"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Institutional Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="email"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-teal-500 transition-all font-bold"
                  placeholder="medic@efaa.org"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="password"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-teal-500 transition-all font-bold"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-teal-900 text-white py-4 rounded-2xl font-black text-lg shadow-lg hover:bg-black transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isLoading ? "Processing..." : (isLogin ? "Sign In" : "Create Account")}
              {!isLoading && <ArrowRight className="w-5 h-5" />}
            </button>

            {ALLOW_REGISTRATION && (
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="w-full mt-4 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-teal-700"
              >
                {isLogin ? "Need a Medic Account? Register" : "Already have an account? Login"}
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}