"use client";

import React, { useState } from 'react';
import { X, Heart, Phone, User as UserIcon } from 'lucide-react';
import SButton from '@/components/UI/SButton';

interface Props {
  onClose: () => void;
  onSave: (contact: { name: string; relationship: string; phone: string }) => void;
}

export default function AddContact({ onClose, onSave }: Props) {
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [phone, setPhone] = useState('');

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-in slide-in-from-bottom-8 duration-500">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">ADD CONTACT</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        <form className="space-y-6" onSubmit={(e) => {
          e.preventDefault();
          onSave({ name, relationship, phone });
        }}>
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contact Name</label>
            <div className="relative group">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-teal-600 transition-colors" />
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Precious"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-teal-500 transition-all font-bold"
              />
            </div>
          </div>

          {/* Relationship */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Relationship</label>
            <div className="relative group">
              <Heart className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-rose-500 transition-colors" />
              <input
                required
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                placeholder="e.g. Partner / Sibling"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-teal-500 transition-all font-bold"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
            <div className="relative group">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                required
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+234..."
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-teal-500 transition-all font-bold"
              />
            </div>
          </div>

          <SButton variant="secondary" className="w-full py-4 text-lg font-black uppercase tracking-widest">
            Save to Circle
          </SButton>
        </form>
      </div>
    </div>
  );
}