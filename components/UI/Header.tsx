"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Activity, Menu, Search, Users, X, HomeIcon,
  Bell, Settings, LogOut, User as UserIcon
} from 'lucide-react';
import { useUser } from '@/components/context/User';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useUser();

  // Helper to determine if a link is active
  const isActive = (path: string) => pathname === path;

  const navLinks = [
    { label: 'Home', href: '/home', icon: HomeIcon },
    { label: 'Search Topics', href: '/search', icon: Search },
    { label: 'Join Community', href: '#', icon: Users },
    { label: 'My Profile', href: '/my-profile', icon: UserIcon },
  ];

  return (
    <>
      <header className="bg-white/80 backdrop-blur-md px-6 py-3 flex items-center justify-between sticky top-0 z-50 border-b border-slate-100">
        {/* BRANDING */}
        <Link href="/home" className="flex items-center gap-2 group transition-all">
          <div className="bg-teal-700 p-2 rounded-xl shadow-lg shadow-teal-100 group-hover:scale-105 transition-transform">
            <Activity className="text-white w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-black tracking-tighter text-slate-900 text-xl leading-none">EFAA</span>
            <span className="text-[8px] font-bold text-teal-600 uppercase tracking-[0.2em]">Assistant</span>
          </div>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${isActive(link.href)
                  ? 'bg-teal-50 text-teal-700'
                  : 'text-slate-500 hover:text-teal-600 hover:bg-slate-50'
                }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* UTILITY ACTIONS (Notifications + Profile) */}
        <div className="flex items-center gap-3">
          <button className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-all relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
          </button>

          <div className="h-6 w-px bg-slate-100 mx-1 hidden sm:block" />

          {/* USER AVATAR SECTION */}
          <div className="hidden sm:flex items-center gap-3 pl-1">
            <div className="flex flex-col items-end">
              <span className="text-xs font-black text-slate-900 leading-none">
                {user?.fullName?.split(' ')[0] || 'Responder'}
              </span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                {user?.state || 'Verified'}
              </span>
            </div>
            <Link href="/my-profile" className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center border border-slate-200 hover:border-teal-500 transition-colors">
              <UserIcon className="w-5 h-5 text-slate-400" />
            </Link>
          </div>

          {/* MOBILE MENU TOGGLE */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors lg:hidden"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* MOBILE MENU OVERLAY */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-[61px] bg-white z-40 p-6 flex flex-col animate-in slide-in-from-right-full duration-300 lg:hidden">
          <div className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-4 p-4 rounded-2xl font-bold transition-all ${isActive(link.href)
                      ? 'bg-teal-50 text-teal-700'
                      : 'text-slate-600 hover:bg-slate-50'
                    }`}
                >
                  <Icon className={`w-5 h-5 ${isActive(link.href) ? 'text-teal-700' : 'text-slate-400'}`} />
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="h-px bg-slate-100 my-6" />

          <div className="space-y-1">
            <Link href="/settings" className="flex items-center gap-4 p-4 text-slate-600 font-bold hover:bg-slate-50 rounded-2xl transition-all">
              <Settings className="w-5 h-5 text-slate-400" /> Settings
            </Link>
            <button
              onClick={logout}
              className="w-full flex items-center gap-4 p-4 text-rose-600 font-bold hover:bg-rose-50 rounded-2xl transition-all"
            >
              <LogOut className="w-5 h-5 text-rose-400" /> Sign Out
            </button>
          </div>

          <div className="mt-auto p-6 bg-slate-50 rounded-[2rem] text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Emergency Line</p>
            <a href="tel:112" className="text-2xl font-black text-teal-800 tracking-tighter">112</a>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;