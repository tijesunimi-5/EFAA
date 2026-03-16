"use client";

import React, { useEffect, useState } from 'react';
import {
  Search,
  MapPin,
  Phone,
  Mail,
  Filter,
  MoreVertical,
  UserCheck
} from 'lucide-react';
import { useAPI } from '@/components/hook/callApi';

interface Responder {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  state: string;
  country: string;
  onboardingCompleted: boolean;
}

// FIX: Define the expected API structure to remove 'any'
interface AdminUsersResponse {
  success: boolean;
  data?: Responder[];
  users?: Responder[]; // Fallback for alternative backend structures
}

export default function RespondersList() {
  const { callApi } = useAPI();
  const [users, setUsers] = useState<Responder[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedState, setSelectedState] = useState("All");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await callApi<AdminUsersResponse>('/admin/users', 'GET');

        if (res.success) {
          // Check for data array or users array without using 'any'
          const userData = res.data || res.users;
          console.log(userData)
          if (Array.isArray(userData)) {
            setUsers(userData);
          }
        }
      } catch (err) {
        console.error("Connection failed:", err);
      }
    };
    fetchUsers();
  }, [callApi]);

  const filteredUsers = users.filter(user => {
    const nameMatch = user.fullName?.toLowerCase().includes(searchTerm.toLowerCase());
    const emailMatch = user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSearch = nameMatch || emailMatch;

    const matchesState = selectedState === "All" || user.state === selectedState;
    return matchesSearch && matchesState;
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Responders Mesh</h1>
          <p className="text-slate-500 text-sm">Monitor and manage registered first responders.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name or email..."
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 ring-teal-500/20 outline-none w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="p-2 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none cursor-pointer"
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
          >
            <option value="All">All States</option>
            <option value="Oyo">Oyo</option>
            <option value="Lagos">Lagos</option>
            <option value="Abuja">Abuja</option>
          </select>
        </div>
      </div>

      {/* FIX: Changed rounded-[2rem] to rounded-4xl */}
      <div className="bg-white rounded-4xl border border-slate-100 shadow-sm overflow-hidden text-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Responder</th>
                <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact</th>
                <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Location</th>
                <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center font-bold">
                        {user.fullName?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{user.fullName}</p>
                        <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold uppercase">
                          <UserCheck className="w-3 h-3" /> Verified
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Mail className="w-3 h-3" /> {user.email}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Phone className="w-3 h-3" /> {user.phone || 'N/A'}
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                      <MapPin className="w-4 h-4 text-rose-500" />
                      {user.state}, {user.country}
                    </div>
                  </td>
                  <td className="p-5 text-center">
                    <button className="p-2 hover:bg-slate-100 rounded-lg transition-all text-slate-400">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="p-20 text-center">
            <Filter className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400 font-medium">No responders found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}