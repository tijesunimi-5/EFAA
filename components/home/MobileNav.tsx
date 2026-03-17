"use client";
import { Activity, Search, BookOpen } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

export default function MobileNav() {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { label: 'HOME', icon: Activity, path: '/home' },
    { label: 'SEARCH', icon: Search, path: '/search' },
    { label: 'HELP', icon: BookOpen, path: '/help' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-slate-100 px-8 py-3 flex justify-around items-center md:hidden z-50">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.path;
        return (
          <button
            key={item.label}
            className={`flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-teal-700' : 'text-slate-400'}`}
            onClick={() => router.push(item.path)}
          >
            <Icon className="w-6 h-6" />
            <span className="text-[10px] font-black">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}