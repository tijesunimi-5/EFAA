"use client";

import React, { useState } from 'react';
import { User as UserIcon, Heart, Phone, Plus, ShieldAlert, LogOut } from 'lucide-react';
import { useUser } from '@/components/context/User';
import Card from '@/components/UI/Card';
import AddContact from '@/components/profile/AddContact'; // The component we discussed

export default function ProfilePage() {
  const { user, setUser, logout } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSaveContact = (newContact: { name: string; relationship: string; phone: string }) => {
    // Creating a clean contact object for the list
    const contactData = {
      id: Date.now().toString(),
      name: newContact.name,
      relationship: newContact.relationship,
      phoneNumber: newContact.phone
    };

    // Updating the global user context
    if (user) {
      const updatedContacts = [...(user.contacts || []), contactData];
      setUser({ ...user, contacts: updatedContacts });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-6 space-y-10 animate-in fade-in duration-500">

      {/* 1. Header & Quick Info */}
      <section className="flex items-center gap-6 pb-6 border-b border-slate-100">
        <div className="w-20 h-20 bg-teal-700 rounded-3xl flex items-center justify-center shadow-lg shadow-teal-100">
          <UserIcon className="text-white w-8 h-8" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-900 leading-tight">{user?.fullName || "Responder"}</h1>
          <p className="text-sm font-bold text-teal-600 uppercase tracking-widest">{user?.state || "Verified Profile"}</p>
        </div>
      </section>

      {/* 2. Emergency Circle - Adding Precious here */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Emergency Circle</h3>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-teal-50 text-teal-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-teal-100 transition-all"
          >
            <Plus className="w-4 h-4" /> Add Contact
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {user?.contacts?.map((contact) => (
            <Card key={contact.id} className="p-5 border-slate-100 flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600">
                  <Heart className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <p className="font-black text-slate-800 leading-none mb-1">{contact.name}</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{contact.relationship}</p>
                </div>
              </div>
              <a href={`tel:${contact.phoneNumber}`} className="p-3 bg-slate-50 text-slate-400 group-hover:bg-teal-700 group-hover:text-white rounded-xl transition-all">
                <Phone className="w-4 h-4" />
              </a>
            </Card>
          ))}
          {(!user?.contacts || user.contacts.length === 0) && (
            <p className="text-xs text-slate-400 font-medium italic">No emergency contacts added yet.</p>
          )}
        </div>
      </section>

      {/* 3. Emergency Medical Note (Removing Genotype/Hospital terms) */}
      <section className="space-y-4">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Safety Instructions</h3>
        <Card className="bg-slate-900 border-none p-8 relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-2 text-rose-500">
              <ShieldAlert className="w-5 h-5" />
              <span className="text-[10px] font-black uppercase tracking-widest">Crucial Note</span>
            </div>
            <p className="text-lg font-bold text-gray-500 leading-relaxed">
              In any severe emergency, always ensure the area is safe for you before helping others.
              Call 112 immediately.
            </p>
          </div>
        </Card>
      </section>

      <button onClick={logout} className="w-full py-4 text-rose-600 font-black uppercase text-xs tracking-[0.2em] border border-rose-100 rounded-2xl hover:bg-rose-50 transition-all">
        Sign Out of Account
      </button>

      {/* The Popup Modal */}
      {isModalOpen && (
        <AddContact
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveContact}
        />
      )}
    </div>
  );
}