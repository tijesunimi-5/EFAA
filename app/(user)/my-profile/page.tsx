"use client";

import React, { useState, useEffect } from 'react';
import { User as UserIcon, Phone, Plus, ShieldAlert, Edit3, Check, X as CloseIcon } from 'lucide-react';
import { useUser } from '@/components/context/User';
import { useAPI } from '@/components/hook/callApi';
import { useAlert } from '@/components/context/Alert';
import Card from '@/components/UI/Card';
import AddContact from '@/components/profile/AddContact';

interface Contact {
  id: string;
  name: string;
  relationship: string;
  phoneNumber: string;
}

interface ProfileUser {
  fullName: string;
  phone?: string;
  state: string;
  email: string;
  contacts?: Contact[];
}

interface UpdateProfileResponse {
  success: boolean;
  message?: string;
  user?: {
    fullName: string;
    phone: string;
    state: string;
    email: string;
  };
}

export default function ProfilePage() {
  const { user, setUser, logout } = useUser();
  const { callApi } = useAPI();
  const { showAlert } = useAlert();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    state: ''
  });

  // Sync form data when user context loads
  useEffect(() => {
    if (user) {
      const profileUser = user as ProfileUser;
      setFormData({
        fullName: profileUser.fullName || '',
        phone: profileUser.phone || '',
        state: profileUser.state || ''
      });
    }
  }, [user]);

  const handleUpdateProfile = async () => {
    setIsLoading(true);
    try {
      const result = await callApi<UpdateProfileResponse>('/authentication/users/update', 'PUT', formData);
      if (result.success && result.user) {
        setUser({
          ...user,
          ...result.user
        } as typeof user);
        showAlert("Profile updated successfully", "success");
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Update error:", error);
      showAlert("Failed to update profile", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveContact = (newContact: { name: string; relationship: string; phone: string }) => {
    const contactData = {
      id: Date.now().toString(),
      name: newContact.name,
      relationship: newContact.relationship,
      phoneNumber: newContact.phone
    };

    if (user) {
      const updatedContacts = [...(user.contacts || []), contactData];
      setUser({ ...user, contacts: updatedContacts });
    }
    setIsModalOpen(false);
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto py-10 px-6 space-y-10 animate-in fade-in duration-500">

      {/* 1. Header & Edit Toggle */}
      <section className="flex items-center justify-between pb-6 border-b border-slate-100">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-teal-900 rounded-4xl flex items-center justify-center text-white shadow-xl shadow-teal-900/20">
            <UserIcon size={36} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
              {isEditing ? "Editing Profile" : user.fullName}
            </h1>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">{user.email}</p>
          </div>
        </div>

        <button
          onClick={() => isEditing ? handleUpdateProfile() : setIsEditing(true)}
          disabled={isLoading}
          className={`p-3 rounded-2xl transition-all ${isEditing ? 'bg-teal-600 text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
        >
          {isEditing ? <Check size={20} /> : <Edit3 size={20} />}
        </button>
      </section>

      {/* 2. Personal Details Form */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Personal Details</h3>
          {isEditing && (
            <button onClick={() => setIsEditing(false)} className="text-[10px] font-black text-rose-500 uppercase">Cancel</button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DetailBox
            label="Full Name"
            value={formData.fullName}
            isEditing={isEditing}
            onChange={(val) => setFormData({ ...formData, fullName: val })}
          />
          <DetailBox
            label="Phone Number"
            value={formData.phone}
            isEditing={isEditing}
            onChange={(val) => setFormData({ ...formData, phone: val })}
          />
          <DetailBox
            label="State of Residence"
            value={formData.state}
            isEditing={isEditing}
            onChange={(val) => setFormData({ ...formData, state: val })}
          />
          <div className="p-6 bg-slate-50 rounded-4xl border border-transparent">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Email Address</p>
            <p className="font-bold text-slate-400 italic">{user.email} (Locked)</p>
          </div>
        </div>
      </section>

      {/* 3. Emergency Contacts */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Emergency Contacts</h3>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 text-teal-700 font-black text-[10px] uppercase tracking-widest bg-teal-50 px-4 py-2 rounded-full hover:bg-teal-100 transition-colors"
          >
            <Plus size={14} /> Add New
          </button>
        </div>

        <div className="space-y-3">
          {user.contacts?.map((contact) => (
            <Card key={contact.id} className="p-5 flex items-center justify-between border-slate-100 group hover:border-teal-200 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors">
                  <Phone size={18} />
                </div>
                <div>
                  <h4 className="font-black text-slate-900 text-sm uppercase tracking-tight">{contact.name}</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{contact.relationship}</p>
                </div>
              </div>
              <a href={`tel:${contact.phoneNumber}`} className="text-slate-900 font-black text-sm hover:text-teal-700">{contact.phoneNumber}</a>
            </Card>
          ))}
          {(!user.contacts || user.contacts.length === 0) && (
            <p className="text-xs text-slate-400 font-medium italic">No emergency contacts added yet.</p>
          )}
        </div>
      </section>

      {/* 4. Safety Instructions */}
      <section className="space-y-4">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Safety Instructions</h3>
        <Card className="bg-slate-900 border-none p-8 relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-2 text-rose-500">
              <ShieldAlert className="w-5 h-5" />
              <span className="text-[10px] font-black uppercase tracking-widest">Crucial Note</span>
            </div>
            <p className="text-lg font-bold text-slate-300 leading-relaxed">
              In any severe emergency, always ensure the area is safe for you before helping others.
              Call 112 immediately.
            </p>
          </div>
        </Card>
      </section>

      <button onClick={logout} className="w-full py-4 text-rose-600 font-black uppercase text-xs tracking-[0.2em] border border-rose-100 rounded-2xl hover:bg-rose-50 transition-all">
        Sign Out of Account
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-4xl p-8 shadow-2xl relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute right-6 top-6 text-slate-300 hover:text-slate-900">
              <CloseIcon size={24} />
            </button>
            <AddContact onSave={handleSaveContact} onClose={() => setIsModalOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * HELPER COMPONENT FOR DETAIL BOX
 */
function DetailBox({ label, value, isEditing, onChange }: {
  label: string;
  value: string;
  isEditing: boolean;
  onChange: (val: string) => void;
}) {
  return (
    <div className={`p-6 rounded-4xl border transition-all ${isEditing ? 'bg-white border-teal-500 ring-4 ring-teal-500/5' : 'bg-slate-50 border-transparent'}`}>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      {isEditing ? (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent font-bold text-slate-900 outline-none border-b-2 border-teal-100 focus:border-teal-500"
        />
      ) : (
        <p className="font-bold text-slate-900">{value || 'Not provided'}</p>
      )}
    </div>
  );
}