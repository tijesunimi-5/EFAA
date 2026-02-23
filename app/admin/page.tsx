"use client";

import React, { useState, useEffect, ReactNode } from 'react';
import {
  LayoutDashboard,
  Users,
  Activity,
  MessageSquare,
  Settings,
  LogOut,
  ChevronRight,
  Bell,
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
  ShieldCheck,
  Mail,
  Lock,
  User as UserIcon,
  Trash2,
  Edit2,
  X,
  Lightbulb
} from 'lucide-react';

/**
 * TYPES & INTERFACES
 */
interface EmergencyStep {
  title: string;
  instruction: string;
  helperText: string;
  hasTimer: boolean;
  threshold?: number;
}

interface EmergencyCondition {
  id: number;
  name: string;
  subtitle: string;
  sessions: number;
  status: 'Live' | 'Draft' | 'Under Review';
  updated: string;
  steps: EmergencyStep[];
}

interface DailyNudge {
  id: number;
  tip: string;
  context: string;
}

interface FeedbackItem {
  id: number;
  name: string;
  message: string;
  date: string;
  status: string;
}

interface UserItem {
  id: number;
  name: string;
  email: string;
  date?: string;
  status: string;
}

/**
 * MOCK DATA
 */
const MOCK_CONDITIONS: EmergencyCondition[] = [
  { id: 1, name: "Seizure", subtitle: "Stay calm and ensure safety", sessions: 450, status: "Live", updated: "Jan 31", steps: [] },
  { id: 2, name: "Bleeding", subtitle: "Apply direct pressure", sessions: 210, status: "Under Review", updated: "Jan 30", steps: [] },
  { id: 3, name: "Snake Bite", subtitle: "Keep the limb still", sessions: 0, status: "Draft", updated: "Jan 28", steps: [] },
];

const MOCK_FEEDBACK: FeedbackItem[] = [
  { id: 1, name: "Oluwaseun", message: "Amazing concept! Very helpful.", date: "Jan 31", status: "Read" },
  { id: 2, name: "Ada", message: "Add CPR steps please.", date: "Jan 30", status: "Unread" },
];

const MOCK_USERS: UserItem[] = [
  { id: 1, name: "Bisi Akande", email: "bisi@example.com", status: "Active" },
  { id: 2, name: "Emeka John", email: "emeka@example.com", status: "Inactive" },
];

/**
 * REUSABLE UI COMPONENTS
 */
const Card = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div className={`bg-white rounded-4xl p-6 border border-slate-100 shadow-sm ${className}`}>
    {children}
  </div>
);

const Badge = ({ children, variant = 'slate' }: { children: string; variant?: 'teal' | 'rose' | 'slate' | 'amber' }) => {
  const variants = {
    teal: "bg-teal-50 text-teal-700 border-teal-100",
    rose: "bg-rose-50 text-rose-700 border-rose-100",
    amber: "bg-amber-50 text-amber-700 border-amber-100",
    slate: "bg-slate-50 text-slate-600 border-slate-200"
  };
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${variants[variant]}`}>
      {children}
    </span>
  );
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
}

const Button = ({ children, variant = 'primary', className = "", ...props }: ButtonProps) => {
  const variants = {
    primary: "bg-teal-700 text-white hover:bg-teal-800 shadow-md",
    secondary: "bg-slate-800 text-white hover:bg-slate-900 shadow-md",
    outline: "border-2 border-teal-700 text-teal-700 hover:bg-teal-50",
    ghost: "text-slate-500 hover:bg-slate-100",
    danger: "bg-rose-500 text-white hover:bg-rose-600 shadow-md"
  };
  return (
    <button className={`px-6 py-3 rounded-2xl font-bold transition-all active:scale-95 flex items-center justify-center gap-2 ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: ReactNode }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-white sticky top-0 z-10">
          <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-8 overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </div>
  );
};

/**
 * AUTH PAGES
 */
const LoginPage = ({ onLogin, onSwitch }: { onLogin: () => void; onSwitch: () => void }) => (
  <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
    <Card className="w-full max-w-md p-10 animate-in fade-in zoom-in-95 duration-500">
      <div className="text-center mb-10">
        <div className="bg-teal-700 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
          <Activity className="text-white w-7 h-7" />
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">EFAA Admin</h1>
        <p className="text-slate-500 font-medium mt-1">Empowering emergency response.</p>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
            <input type="email" placeholder="admin@efaa.ng" className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-teal-500 transition-colors" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
            <input type="password" placeholder="••••••••" className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-teal-500 transition-colors" />
          </div>
        </div>
        <Button onClick={onLogin} className="w-full py-5 text-lg mt-4">Login to Dashboard</Button>
      </div>
      <p className="text-center mt-8 text-slate-500 font-medium">
        Don&apos;t have an account? <button onClick={onSwitch} className="text-teal-700 font-bold hover:underline">Register</button>
      </p>
    </Card>
  </div>
);

const RegisterPage = ({ onRegister, onSwitch }: { onRegister: () => void; onSwitch: () => void }) => (
  <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
    <Card className="w-full max-w-md p-10 animate-in fade-in zoom-in-95 duration-500">
      <div className="text-center mb-10">
        <div className="bg-teal-700 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
          <ShieldCheck className="text-white w-7 h-7" />
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Create Admin</h1>
        <p className="text-slate-500 font-medium mt-1">Knowledge is power in a crisis.</p>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Full Name</label>
          <div className="relative">
            <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
            <input type="text" placeholder="Dr. John Doe" className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-teal-500 transition-colors" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
            <input type="email" placeholder="admin@efaa.ng" className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-teal-500 transition-colors" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
            <input type="password" placeholder="••••••••" className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-teal-500 transition-colors" />
          </div>
        </div>
        <Button onClick={onRegister} className="w-full py-5 text-lg mt-4">Create Admin Account</Button>
      </div>
      <p className="text-center mt-8 text-slate-500 font-medium">
        Already have an account? <button onClick={onSwitch} className="text-teal-700 font-bold hover:underline">Login</button>
      </p>
    </Card>
  </div>
);

/**
 * DASHBOARD VIEWS
 */
const DashboardView = ({ conditions, feedback }: { conditions: EmergencyCondition[], feedback: FeedbackItem[] }) => {
  const metrics = [
    { label: "Total Users", value: "1,246", trend: "+12%", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Active (7d)", value: "312", trend: "+5%", icon: Activity, color: "text-teal-600", bg: "bg-teal-50" },
    { label: "Emergencies", value: conditions.length.toString(), trend: "+2", icon: AlertCircle, color: "text-rose-600", bg: "bg-rose-50" },
    { label: "Feedback", value: feedback.length.toString(), trend: "-2%", icon: MessageSquare, color: "text-amber-600", bg: "bg-amber-50" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <Card key={i} className="flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className={`${m.bg} ${m.color} p-3 rounded-2xl`}>
                <m.icon className="w-6 h-6" />
              </div>
              <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${m.trend.startsWith('+') ? 'bg-green-50 text-green-600' : 'bg-rose-50 text-rose-600'}`}>
                {m.trend}
              </span>
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{m.label}</p>
            <h4 className="text-3xl font-black text-slate-900 mt-1 tracking-tight">{m.value}</h4>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Recent Feedback</h3>
            <button className="text-teal-700 text-xs font-bold hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {feedback.slice(0, 3).map(f => (
              <div key={f.id} className="flex items-start gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-colors border border-transparent hover:border-slate-100">
                <div className="bg-slate-100 w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                  <UserIcon className="w-5 h-5 text-slate-400" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <h5 className="font-bold text-slate-800">{f.name}</h5>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">{f.date}</span>
                  </div>
                  <p className="text-sm text-slate-500 line-clamp-1 italic">&quot;{f.message}&quot;</p>
                </div>
                <Badge variant={f.status === 'Read' ? 'teal' : 'amber'}>{f.status}</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Active Conditions</h3>
            <button className="text-teal-700 text-xs font-bold hover:underline">Manage</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-slate-50">
                  <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Condition</th>
                  <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                  <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Last Sync</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {conditions.slice(0, 3).map(c => (
                  <tr key={c.id} className="group">
                    <td className="py-4 font-bold text-slate-800">{c.name}</td>
                    <td className="py-4 text-center">
                      <Badge variant={c.status === 'Live' ? 'teal' : c.status === 'Draft' ? 'slate' : 'amber'}>{c.status}</Badge>
                    </td>
                    <td className="py-4 text-right text-xs font-bold text-slate-400">{c.updated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6 bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500">Most triggered: <span className="text-teal-700 uppercase tracking-wider ml-1">Seizure</span></p>
            <Activity className="w-4 h-4 text-teal-600 animate-pulse" />
          </div>
        </Card>
      </div>
    </div>
  );
};

const EmergenciesView = ({ conditions, onSave, onDelete }: { conditions: EmergencyCondition[]; onSave: (c: EmergencyCondition) => void; onDelete: (id: number) => void; }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCondition, setEditingCondition] = useState<Partial<EmergencyCondition> | null>(null);

  const openForm = (condition?: EmergencyCondition) => {
    setEditingCondition(condition || {
      name: '',
      subtitle: '',
      status: 'Draft',
      steps: [{ title: '', instruction: '', helperText: '', hasTimer: false, threshold: 300 }]
    });
    setIsModalOpen(true);
  };

  const addStep = () => {
    if (editingCondition) {
      setEditingCondition({
        ...editingCondition,
        steps: [...(editingCondition.steps || []), { title: '', instruction: '', helperText: '', hasTimer: false, threshold: 300 }]
      });
    }
  };

  const removeStep = (index: number) => {
    if (editingCondition && editingCondition.steps) {
      setEditingCondition({
        ...editingCondition,
        steps: editingCondition.steps.filter((_, i) => i !== index)
      });
    }
  };

  const updateStep = (index: number, field: keyof EmergencyStep, value: string | boolean | number) => {
    if (editingCondition && editingCondition.steps) {
      const newSteps = [...editingCondition.steps];
      newSteps[index] = { ...newSteps[index], [field]: value } as EmergencyStep;
      setEditingCondition({ ...editingCondition, steps: newSteps });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCondition) {
      onSave(editingCondition as EmergencyCondition);
      setIsModalOpen(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Medical Scenarios</h2>
          <p className="text-slate-500 font-medium">Create and refine step-by-step guidance.</p>
        </div>
        <Button onClick={() => openForm()} className="gap-2">
          <Plus className="w-5 h-5" /> Add New Condition
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {conditions.map(c => (
          <Card key={c.id} className="relative group overflow-hidden">
            <div className="flex justify-between items-start mb-6">
              <Badge variant={c.status === 'Live' ? 'teal' : c.status === 'Draft' ? 'slate' : 'amber'}>{c.status}</Badge>
              <div className="flex gap-1">
                <button onClick={() => openForm(c)} className="p-2 text-slate-300 hover:text-teal-600 transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => onDelete(c.id)} className="p-2 text-slate-300 hover:text-rose-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <h4 className="text-xl font-black text-slate-900 mb-1">{c.name}</h4>
            <p className="text-sm text-slate-500 line-clamp-2 mb-4 font-medium italic">&quot;{c.subtitle}&quot;</p>
            <div className="flex items-center gap-4 text-xs font-bold text-slate-400 border-t border-slate-50 pt-4 mt-auto uppercase tracking-widest">
              <div className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {c.updated}</div>
              <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3" /> {c.steps.length} Steps</div>
            </div>
          </Card>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingCondition?.id ? "Edit Condition" : "New Condition"}>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              required
              value={editingCondition?.name || ''}
              onChange={e => setEditingCondition({ ...editingCondition!, name: e.target.value })}
              placeholder="Condition Name"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-teal-500"
            />
            <select
              value={editingCondition?.status || 'Draft'}
              onChange={e => setEditingCondition({ ...editingCondition!, status: e.target.value as 'Live' | 'Draft' | 'Under Review' })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-teal-500 appearance-none"
            >
              <option value="Draft">Draft</option>
              <option value="Live">Live</option>
              <option value="Under Review">Under Review</option>
            </select>
          </div>
          <div className="space-y-4">
            <h5 className="font-bold">Steps</h5>
            {editingCondition?.steps?.map((step, index) => (
              <div key={index} className="p-4 bg-slate-50 rounded-2xl relative">
                <button type="button" onClick={() => removeStep(index)} className="absolute top-2 right-2 text-rose-500">
                  <Trash2 className="w-4 h-4" />
                </button>
                <input
                  value={step.title}
                  onChange={e => updateStep(index, 'title', e.target.value)}
                  placeholder="Step Title"
                  className="w-full mb-2 p-2 border rounded"
                />
                <textarea
                  value={step.instruction}
                  onChange={e => updateStep(index, 'instruction', e.target.value)}
                  placeholder="Step Instruction"
                  className="w-full p-2 border rounded h-20"
                />
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addStep} className="w-full">Add Step</Button>
          </div>
          <div className="flex gap-4">
            <Button type="submit" className="flex-1">Save</Button>
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1">Cancel</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

const NudgesView = ({ nudges, onSave, onDelete }: { nudges: DailyNudge[]; onSave: (n: DailyNudge) => void; onDelete: (id: number) => void; }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNudge, setEditingNudge] = useState<Partial<DailyNudge> | null>(null);

  const openForm = (nudge?: DailyNudge) => {
    setEditingNudge(nudge || { tip: '', context: '' });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingNudge) {
      onSave(editingNudge as DailyNudge);
      setIsModalOpen(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex justify-between items-end">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Daily Nudges</h2>
        <Button onClick={() => openForm()}><Plus className="w-5 h-5" /> Add Nudge</Button>
      </div>
      <div className="grid gap-4">
        {nudges.map(n => (
          <Card key={n.id} className="flex justify-between items-start">
            <div>
              <h4 className="font-bold text-lg text-slate-900 uppercase tracking-tight">{n.tip}</h4>
              <p className="text-slate-500 italic">&quot;{n.context}&quot;</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => openForm(n)} className="text-teal-600 hover:text-teal-700"><Edit2 className="w-4 h-4" /></button>
              <button onClick={() => onDelete(n.id)} className="text-rose-500 hover:text-rose-600"><Trash2 className="w-4 h-4" /></button>
            </div>
          </Card>
        ))}
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Manage Nudge">
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            required
            value={editingNudge?.tip || ''}
            onChange={e => setEditingNudge({ ...editingNudge!, tip: e.target.value })}
            placeholder="Tip"
            className="w-full p-3 border rounded-xl"
          />
          <textarea
            required
            value={editingNudge?.context || ''}
            onChange={e => setEditingNudge({ ...editingNudge!, context: e.target.value })}
            placeholder="Context"
            className="w-full p-3 border rounded-xl h-32"
          />
          <Button type="submit" className="w-full">Save</Button>
        </form>
      </Modal>
    </div>
  );
};

const UsersView = () => (
  <div className="space-y-6 animate-in fade-in duration-700">
    <div className="flex justify-between items-end">
      <h2 className="text-3xl font-black text-slate-900 tracking-tight">Users</h2>
      <Card className="py-2 px-4 bg-teal-50 border-teal-100 text-teal-700 font-bold">1,246 Total</Card>
    </div>
    <Card className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="border-b">
          <tr>
            <th className="pb-4 text-slate-400 uppercase text-xs font-black tracking-widest">Name</th>
            <th className="pb-4 text-slate-400 uppercase text-xs font-black tracking-widest">Email</th>
            <th className="pb-4 text-slate-400 uppercase text-xs font-black tracking-widest">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {MOCK_USERS.map(u => (
            <tr key={u.id} className="hover:bg-slate-50 transition-colors">
              <td className="py-4 font-bold text-slate-800">{u.name}</td>
              <td className="py-4 text-slate-500">{u.email}</td>
              <td className="py-4">
                <Badge variant={u.status === 'Active' ? 'teal' : 'slate'}>{u.status}</Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  </div>
);

const SettingsView = () => (
  <div className="max-w-2xl space-y-8 animate-in fade-in duration-700">
    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Settings</h2>
    <Card className="space-y-6">
      <input placeholder="Admin Name" defaultValue="Head Admin" className="w-full p-4 bg-slate-50 border rounded-2xl" />
      <input placeholder="Admin Email" defaultValue="admin@efaa.ng" className="w-full p-4 bg-slate-50 border rounded-2xl" />
      <Button className="w-full">Save Profile</Button>
    </Card>
  </div>
);

interface NavItemProps {
  id: string;
  icon: React.ElementType;
  label: string;
  activeView: string;
  onClick: (id: string) => void;
}

const NavItem = ({ icon: Icon, label, id, activeView, onClick }: NavItemProps) => {
  const isActive = activeView === id;
  return (
    <button
      onClick={() => onClick(id)}
      className={`w-full flex items-center gap-3 px-6 py-4 transition-all group relative ${isActive ? 'text-teal-700 bg-teal-50 font-black' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50 font-bold'}`}
    >
      {isActive && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-teal-700 rounded-r-full" />}
      <Icon className={`w-5 h-5 ${isActive ? 'text-teal-700' : 'text-slate-300'}`} />
      <span className="text-sm uppercase tracking-widest">{label}</span>
      {isActive && <ChevronRight className="ml-auto w-4 h-4 opacity-50" />}
    </button>
  );
};

/**
 * MAIN ADMIN SYSTEM
 */
export default function AdminSystem() {
  const [authState, setAuthState] = useState<'login' | 'register' | 'authenticated'>('login');
  const [activeView, setActiveView] = useState('dashboard');
  const [isMounted, setIsMounted] = useState(false);

  const [conditions, setConditions] = useState<EmergencyCondition[]>(MOCK_CONDITIONS);
  const [nudges, setNudges] = useState<DailyNudge[]>([
    { id: 1, tip: "Seizure Restraint", context: "Never restrain someone having a seizure." },
    { id: 2, tip: "Burn Care", context: "Use cool running water for 20 minutes." }
  ]);
  const [feedback] = useState<FeedbackItem[]>(MOCK_FEEDBACK);

  useEffect(() => {
    setIsMounted(true);

    // Safe localStorage access – only runs in browser
    const loggedIn = localStorage.getItem('efaa_admin_logged_in');
    if (loggedIn === 'true') {
      setAuthState('authenticated');
    }
  }, []);

  const handleLogin = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('efaa_admin_logged_in', 'true');
    }
    setAuthState('authenticated');
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('efaa_admin_logged_in');
    }
    setAuthState('login');
  };

  const saveCondition = (condition: EmergencyCondition) => {
    if (condition.id) {
      setConditions(conditions.map(c =>
        c.id === condition.id ? { ...condition, updated: 'Just now' } : c
      ));
    } else {
      setConditions([
        ...conditions,
        { ...condition, id: Date.now(), sessions: 0, updated: 'Today' }
      ]);
    }
  };

  const deleteCondition = (id: number) => {
    if (confirm("Delete this medical protocol?")) {
      setConditions(conditions.filter(c => c.id !== id));
    }
  };

  const saveNudge = (nudge: DailyNudge) => {
    if (nudge.id) {
      setNudges(nudges.map(n => n.id === nudge.id ? nudge : n));
    } else {
      setNudges([...nudges, { ...nudge, id: Date.now() }]);
    }
  };

  const deleteNudge = (id: number) => {
    if (confirm("Delete this nudge?")) {
      setNudges(nudges.filter(n => n.id !== id));
    }
  };

  // Prevent rendering authenticated content before mount (avoids hydration mismatch)
  if (!isMounted) {
    return null; // or <div className="min-h-screen bg-slate-50" /> if you want to reduce layout shift
  }

  if (authState === 'login') {
    return <LoginPage onLogin={handleLogin} onSwitch={() => setAuthState('register')} />;
  }

  if (authState === 'register') {
    return <RegisterPage onRegister={() => setAuthState('login')} onSwitch={() => setAuthState('login')} />;
  }

  // Authenticated layout
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col md:flex-row overflow-x-hidden">
      <aside className="hidden md:flex w-72 bg-white border-r border-slate-100 flex-col sticky top-0 h-screen z-50">
        <div className="p-8 mb-4 flex items-center gap-3">
          <div className="bg-teal-700 p-2 rounded-xl">
            <Activity className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-teal-800 uppercase">EFAA Admin</span>
        </div>
        <nav className="flex-1 space-y-1">
          <NavItem id="dashboard" icon={LayoutDashboard} label="Dashboard" activeView={activeView} onClick={setActiveView} />
          <NavItem id="users" icon={Users} label="Users" activeView={activeView} onClick={setActiveView} />
          <NavItem id="emergencies" icon={Activity} label="Emergencies" activeView={activeView} onClick={setActiveView} />
          <NavItem id="nudges" icon={Lightbulb} label="Daily Nudges" activeView={activeView} onClick={setActiveView} />
          <NavItem id="settings" icon={Settings} label="Settings" activeView={activeView} onClick={setActiveView} />
        </nav>
        <div className="p-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-6 py-4 text-rose-500 font-black uppercase tracking-widest hover:bg-rose-50 rounded-2xl transition-all"
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b px-8 py-5 flex items-center justify-between">
          <h2 className="text-lg font-black uppercase tracking-tighter">
            {activeView === 'dashboard' && "Overview"}
            {activeView === 'users' && "User Management"}
            {activeView === 'emergencies' && "Medical Scenarios"}
            {activeView === 'nudges' && "Daily Health Nudges"}
            {activeView === 'settings' && "Configuration"}
          </h2>
          <div className="flex items-center gap-4">
            <button className="relative p-2 bg-slate-50 text-slate-400 hover:text-teal-600 rounded-xl">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
            </button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-teal-800 flex items-center justify-center text-white font-black text-xs">
              HA
            </div>
          </div>
        </header>

        <div className="p-8 flex-1 max-w-7xl mx-auto w-full">
          {activeView === 'dashboard' && <DashboardView conditions={conditions} feedback={feedback} />}
          {activeView === 'emergencies' && <EmergenciesView conditions={conditions} onSave={saveCondition} onDelete={deleteCondition} />}
          {activeView === 'nudges' && <NudgesView nudges={nudges} onSave={saveNudge} onDelete={deleteNudge} />}
          {activeView === 'users' && <UsersView />}
          {activeView === 'settings' && <SettingsView />}
        </div>
      </main>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t px-6 py-4 flex justify-between z-50">
        <button onClick={() => setActiveView('dashboard')} className={activeView === 'dashboard' ? 'text-teal-700' : 'text-slate-300'}>
          <LayoutDashboard />
        </button>
        <button onClick={() => setActiveView('users')} className={activeView === 'users' ? 'text-teal-700' : 'text-slate-300'}>
          <Users />
        </button>
        <button onClick={() => setActiveView('emergencies')} className={activeView === 'emergencies' ? 'text-teal-700' : 'text-slate-300'}>
          <Activity />
        </button>
        <button onClick={() => setActiveView('settings')} className={activeView === 'settings' ? 'text-teal-700' : 'text-slate-300'}>
          <Settings />
        </button>
      </nav>
    </div>
  );
}