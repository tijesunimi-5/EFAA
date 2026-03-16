"use client";

import React, { useEffect, useState, useCallback } from 'react';
import {
  Users,
  Activity,
  BookOpen,
  TrendingUp,
  AlertTriangle,
  Clock,
  ShieldCheck,
  ChevronRight,
  LucideIcon
} from 'lucide-react';
import { useAPI } from '@/components/hook/callApi';
import Link from 'next/link';

interface DashboardStats {
  totalResponders: number;
  activeEmergencies: number;
  totalProtocols: number;
  pendingReviews: number;
}

interface MetricCard {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
}

export default function AdminDashboard() {
  const { callApi } = useAPI();
  const [stats, setStats] = useState<DashboardStats>({
    totalResponders: 1284, // Default mock values for now
    activeEmergencies: 42,
    totalProtocols: 15,
    pendingReviews: 3
  });

  const fetchStats = useCallback(async () => {
    try {
      const res = await callApi<{ data: DashboardStats }>('/admin/stats', 'GET');
      if (res.success && res.data) {
        setStats(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch dashboard stats", err);
    }
  }, [callApi]);

  useEffect(() => {
    // fetchStats(); // Uncomment once backend route is ready
    console.log("Stats loaded:", stats);
  }, [fetchStats, stats]);

  const metricCards: MetricCard[] = [
    { label: "Total Responders", value: stats.totalResponders.toLocaleString(), icon: Users, color: "bg-blue-50 text-blue-600" },
    { label: "Active Sessions", value: stats.activeEmergencies, icon: Activity, color: "bg-rose-50 text-rose-600" },
    { label: "Live Protocols", value: stats.totalProtocols, icon: BookOpen, color: "bg-teal-50 text-teal-600" },
    { label: "System Health", value: "99.9%", icon: ShieldCheck, color: "bg-amber-50 text-amber-600" },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Metric Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="bg-white p-6 rounded-4xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${card.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-1">{card.label}</p>
              <h3 className="text-3xl font-bold text-slate-900">{card.value}</h3>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions & Recent Protocols */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold text-slate-800">Recent Clinical Protocols</h2>
              <Link href="/admin/protocols" className="text-teal-700 text-sm font-bold hover:underline">View All</Link>
            </div>

            <div className="space-y-4">
              {["Adult Choking", "Severe Bleeding", "Heat Stroke"].map((protocol, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl group hover:bg-teal-50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-100 font-bold text-slate-400">
                      {i + 1}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">{protocol}</h4>
                      <p className="text-xs text-slate-400 font-medium">Updated 2 days ago</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-teal-600 transition-colors" />
                </div>
              ))}
            </div>

            <Link href="/admin/protocols/new">
              <button className="w-full mt-8 py-4 bg-teal-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-teal-800 transition-all shadow-lg shadow-teal-100">
                Create New Protocol
              </button>
            </Link>
          </div>
        </div>

        {/* System Activity Feed */}
        <div className="space-y-6">
          <div className="bg-teal-900 rounded-[2.5rem] p-8 text-white shadow-xl">
            <h2 className="text-xl font-bold mb-6">Medic Alert</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0" />
                <p className="text-sm leading-relaxed text-teal-100">
                  <span className="font-bold text-white">Critical Review Required:</span> The &quot;Cardiac Arrest&quot; protocol hasn&apos;t been updated in 6 months.
                </p>
              </div>
              <div className="flex gap-4">
                <TrendingUp className="w-6 h-6 text-emerald-400 shrink-0" />
                <p className="text-sm leading-relaxed text-teal-100">
                  Responders in <span className="font-bold text-white">Ibadan</span> have increased activity by 15% this week.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Your Session</h2>
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
              <Clock className="w-5 h-5 text-slate-400" />
              <span className="text-xs font-bold text-slate-500">Token expires in 7h 42m</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}