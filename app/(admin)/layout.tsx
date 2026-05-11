"use client";

import React from 'react';
import { LayoutDashboard, BookOpen, Users, LogOut, LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useUser } from '@/components/context/User';

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { setUser } = useUser();

  const navItems: NavItem[] = [
    // { label: "Home", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Emergency Protocol", href: "/admin/protocols/new", icon: BookOpen },
    { label: "Responders", href: "/admin/users", icon: Users },
  ];

  const handleLogout = () => {
    // 1. Clear the session token
    localStorage.removeItem('efaa_token');

    // 2. Reset the user context
    setUser(null);

    // 3. Redirect to the admin auth page
    router.push('/admin/auth');
  };

  return (
    <div className="flex min-h-screen bg-slate-50 pb-20 md:pb-0">
      {/* Desktop Sidebar */}
      <aside className="w-64  bg-teal-900 text-white p-6 hidden md:flex flex-col">
        <div className="mb-10 font-black text-2xl tracking-tight">EFAA ADMIN</div>

        <nav className="space-y-2 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${pathname === item.href ? 'bg-teal-800' : 'hover:bg-teal-800'
                  }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-bold text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 p-3 text-teal-300 hover:text-white transition-colors mt-auto outline-none"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-bold text-sm">Logout</span>
        </button>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 py-3 flex justify-between items-center z-50">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-teal-700' : 'text-slate-400'
                }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-[10px] font-black uppercase tracking-tighter">
                {item.label}
              </span>
            </Link>
          );
        })}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center gap-1 text-slate-400 outline-none"
        >
          <LogOut className="w-6 h-6" />
          <span className="text-[10px] font-black uppercase tracking-tighter">Exit</span>
        </button>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}