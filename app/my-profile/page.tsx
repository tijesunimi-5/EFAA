"use client";

import React, { useState, useEffect, ReactNode, useRef } from 'react';
import {
  LayoutDashboard,
  Activity,
  MessageSquare,
  Settings,
  LogOut,
  ChevronRight,
  Bell,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Mail,
  User as UserIcon,
  Edit2,
  X,
  Lightbulb,
  MapPin,
  RefreshCw,
  MessageCircle,
  AlertTriangle,
  Send,
  HeartPulse,
  ArrowLeft,
  Phone,
  UserCheck,
} from 'lucide-react';

/**
 * TYPES & INTERFACES
 */
interface Message {
  id: number;
  senderId: string;
  text: string;
  timestamp: string;
  isMe: boolean;
}

interface ChatThread {
  id: string;
  userName: string;
  lastMessage: string;
  time: string;
  unread: number;
  status: 'Active' | 'Inactive';
}

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  location: string;
}


interface NearbyUser {
  id: number;
  name: string;
  distance: string;
  phone: string;
  status: 'Active' | 'Inactive';
}

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

interface FeedbackItem {
  id: number;
  name: string;
  message: string;
  date: string;
  status: string;
}

/**
 * MOCK DATA CONSTANTS
 */
const MOCK_CHAT_THREADS: ChatThread[] = [
  { id: '1', userName: "Amaka Johnson", lastMessage: "I'm arriving with a first aid kit.", time: "2m ago", unread: 1, status: 'Active' },
  { id: '2', userName: "Segun Olumide", lastMessage: "Is the patient stable now?", time: "1h ago", unread: 0, status: 'Active' },
  { id: '3', userName: "Fatima Bello", lastMessage: "Understood, calling 112.", time: "Yesterday", unread: 0, status: 'Inactive' },
];

const MOCK_MESSAGES: Record<string, Message[]> = {
  '1': [
    { id: 1, senderId: '1', text: "Hello! I saw your panic signal.", timestamp: "10:30 AM", isMe: false },
    { id: 2, senderId: 'me', text: "Yes, we have an emergency near the gate.", timestamp: "10:31 AM", isMe: true },
    { id: 3, senderId: '1', text: "I'm arriving with a first aid kit.", timestamp: "10:32 AM", isMe: false },
  ],
};



const MOCK_NEARBY_USERS: NearbyUser[] = [
  { id: 1, name: "Amaka Johnson", distance: "0.4 km", phone: "+234 803 111 2222", status: 'Active' },
  { id: 2, name: "Segun Olumide", distance: "1.2 km", phone: "+234 812 333 4444", status: 'Active' },
  { id: 3, name: "Fatima Bello", distance: "2.5 km", phone: "+234 905 555 6666", status: 'Inactive' },
];

const MOCK_CONDITIONS: EmergencyCondition[] = [
  { id: 1, name: "Seizure", subtitle: "Stay calm", sessions: 450, status: "Live", updated: "Jan 31", steps: [] },
  { id: 2, name: "Bleeding", subtitle: "Apply pressure", sessions: 210, status: "Under Review", updated: "Jan 30", steps: [] },
];

const MOCK_FEEDBACK: FeedbackItem[] = [
  { id: 1, name: "Oluwaseun", message: "Amazing concept!", date: "Jan 31", status: "Read" },
];

/**
 * SHARED UI COMPONENTS
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
    ghost: "text-slate-500 hover:text-slate-800 hover:bg-slate-100",
    danger: "bg-rose-600 text-white hover:bg-rose-700 shadow-lg shadow-rose-100"
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

const EditableField = ({
  label,
  icon: Icon,
  value,
  onSave,
  type = "text"
}: {
  label: string;
  icon: React.ElementType;
  value: string;
  onSave: (val: string) => void;
  type?: string;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  const handleSave = () => {
    onSave(tempValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempValue(value);
    setIsEditing(false);
  };

  return (
    <div className="space-y-1.5 w-full">
      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
      <div className={`relative group p-4 bg-slate-50 border rounded-3xl transition-all ${isEditing ? 'border-teal-500 ring-4 ring-teal-500/5' : 'border-slate-100 hover:border-slate-200'}`}>
        <div className="flex items-center gap-4">
          <Icon className={`w-5 h-5 ${isEditing ? 'text-teal-600' : 'text-slate-300'}`} />
          {isEditing ? (
            <input autoFocus type={type} value={tempValue} onChange={(e) => setTempValue(e.target.value)} className="flex-1 bg-transparent border-none focus:ring-0 font-bold text-slate-700 p-0 text-lg outline-none" />
          ) : (
            <div className="flex-1 font-bold text-slate-700 text-lg truncate">{value}</div>
          )}
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <button onClick={handleSave} className="p-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 shadow-sm transition-colors">
                  <CheckCircle2 className="w-4 h-4" />
                </button>
                <button onClick={handleCancel} className="p-2 bg-slate-200 text-slate-600 rounded-xl hover:bg-slate-300 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </>
            ) : (
              <button onClick={() => setIsEditing(true)} className="p-2 text-slate-300 hover:text-teal-600 transition-colors">
                <Edit2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * FEATURE VIEWS
 */
const InboxView = ({ onSelectChat }: { onSelectChat: (thread: ChatThread) => void }) => (
  <div className="space-y-6 animate-in fade-in duration-700">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="bg-teal-100 p-2 rounded-xl text-teal-700"><MessageSquare className="w-5 h-5" /></div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Emergency Inbox</h2>
      </div>
      <Badge variant="teal">2 Unread</Badge>
    </div>
    <Card className="p-0 overflow-hidden">
      <div className="divide-y divide-slate-50">
        {MOCK_CHAT_THREADS.map(thread => (
          <div key={thread.id} onClick={() => onSelectChat(thread)} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-all cursor-pointer group">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-3xl bg-slate-100 flex items-center justify-center font-black text-slate-400 border border-slate-100">{thread.userName[0]}</div>
              <div className="space-y-1">
                <h6 className="font-bold text-lg text-slate-900">{thread.userName}</h6>
                <p className={`text-sm line-clamp-1 ${thread.unread > 0 ? 'text-teal-700 font-bold' : 'text-slate-400 font-medium'}`}>{thread.lastMessage}</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0">
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{thread.time}</span>
              {thread.unread > 0 && <div className="w-5 h-5 bg-teal-600 rounded-full flex items-center justify-center text-[10px] font-black text-white">{thread.unread}</div>}
            </div>
          </div>
        ))}
      </div>
    </Card>
  </div>
);

const ChatDetailView = ({ thread, onBack }: { thread: ChatThread, onBack: () => void }) => {
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES[thread.id] || []);
  const [inputText, setInputText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const newMessage: Message = { id: Date.now(), senderId: 'me', text: inputText, timestamp: "Now", isMe: true };
    setMessages([...messages, newMessage]);
    setInputText("");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] bg-white rounded-4xl border border-slate-100 shadow-sm overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
      <div className="p-6 border-b border-slate-50 flex items-center gap-4 bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-400 hover:text-teal-700 transition-colors"><ArrowLeft className="w-6 h-6" /></button>
        <div className="w-10 h-10 rounded-2xl bg-teal-50 flex items-center justify-center font-black text-teal-700">{thread.userName[0]}</div>
        <div><h3 className="font-bold text-slate-900 leading-none">{thread.userName}</h3><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Responder</span></div>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-3xl text-sm font-medium shadow-sm ${msg.isMe ? 'bg-teal-700 text-white rounded-tr-sm' : 'bg-white text-slate-700 border border-slate-100 rounded-tl-sm'}`}>
              {msg.text}<div className={`text-[9px] mt-1.5 font-bold uppercase tracking-tight ${msg.isMe ? 'text-teal-200/60 text-right' : 'text-slate-300'}`}>{msg.timestamp}</div>
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-50 flex gap-3">
        <input value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="Type a message..." className="flex-1 px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-teal-500 transition-all text-sm font-medium" />
        <button type="submit" className={`p-3.5 rounded-2xl transition-all ${inputText.trim() ? 'bg-teal-700 text-white' : 'bg-slate-100 text-slate-300'}`}><Send className="w-5 h-5" /></button>
      </form>
    </div>
  );
};

const ProfileView = ({ onMessageUser }: { onMessageUser: (name: string) => void }) => {
  const [profile, setProfile] = useState<UserProfile>({
    name: "Dr. Oluwaseun Benson",
    email: "benson.medical@efaa.ng",
    phone: "+234 803 456 7890",
    location: "Lagos, Nigeria"
  });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPanicModalOpen, setIsPanicModalOpen] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; message: string }>({ show: false, message: "" });

  const triggerToast = (message: string) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: "" }), 3000);
  };

  return (
    <div className="space-y-10 pb-32 animate-in fade-in duration-700">
      {toast.show && (
        <div className="fixed top-24 right-8 z-100 bg-slate-900 text-white px-6 py-4 rounded-3xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-right-10 duration-500">
          <div className="bg-teal-500/20 p-1.5 rounded-lg"><CheckCircle2 className="w-5 h-5 text-teal-400" /></div>
          <span className="text-sm font-bold tracking-tight">{toast.message}</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-4xl bg-linear-to-br from-teal-500 to-teal-800 flex items-center justify-center text-white text-3xl font-black shadow-xl ring-4 ring-white shrink-0">{profile.name[0]}</div>
          <div><h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase text-balance">My Profile</h2><div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest mt-1"><ShieldCheck className="w-3.5 h-3.5 text-teal-500" /> Responder Status Active</div></div>
        </div>
        <Button variant="danger" onClick={() => setIsPanicModalOpen(true)} className="flex-1 sm:flex-none uppercase"><AlertTriangle className="w-5 h-5 animate-pulse" /> Panic Signal</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-8">
          <Card className="space-y-6">
            <div className="flex items-center gap-3 mb-2"><div className="bg-teal-100 p-2 rounded-xl text-teal-700"><UserCheck className="w-5 h-5" /></div><h3 className="text-lg font-black uppercase tracking-tight">Identity & Contact</h3></div>

            <EditableField
              label="Display Name"
              icon={UserIcon}
              value={profile.name}
              onSave={val => { setProfile({ ...profile, name: val }); triggerToast("Name updated"); }}
            />

            <EditableField
              label="Email Address"
              icon={Mail}
              value={profile.email}
              type="email"
              onSave={val => { setProfile({ ...profile, email: val }); triggerToast("Email updated"); }}
            />

            <EditableField
              label="Phone Number"
              icon={Phone}
              value={profile.phone}
              type="tel"
              onSave={val => { setProfile({ ...profile, phone: val }); triggerToast("Phone updated"); }}
            />

            <div className="space-y-1.5"><label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-balance">Responder Region</label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <EditableField
                    label=""
                    icon={MapPin}
                    value={profile.location}
                    onSave={val => { setProfile({ ...profile, location: val }); triggerToast("Location changed"); }}
                  />
                </div>
                <button
                  onClick={() => { setIsRefreshing(true); setTimeout(() => { setIsRefreshing(false); triggerToast("Location Refreshed via GPS"); }, 1500); }}
                  className={`p-4 bg-teal-50 text-teal-700 h-15 self-end mb-px rounded-3xl hover:bg-teal-100 transition-all ${isRefreshing ? 'animate-spin' : ''}`}
                >
                  <RefreshCw className="w-6 h-6" />
                </button>
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-5 space-y-8">
          <Card className="bg-slate-900 border-none text-white shadow-2xl relative overflow-hidden group">
            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-3"><div className="bg-rose-500/20 p-2 rounded-xl text-rose-400"><HeartPulse className="w-6 h-6" /></div><h3 className="text-lg font-black uppercase tracking-tight">Rapid Response</h3></div>
              <div className="bg-white/10 p-6 rounded-3xl border border-white/5 backdrop-blur-md"><p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-1">Emergency Number</p><div className="flex items-end justify-between"><p className="text-5xl font-black tracking-tighter">112</p><Badge variant="rose">Priority</Badge></div></div>
            </div>
          </Card>

          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between"><h3 className="text-sm font-black uppercase text-slate-400 tracking-widest">Active Peers</h3><Badge variant="teal">LIVE</Badge></div>
            <Card className="p-0 overflow-hidden border-2 border-teal-50">
              <div className="divide-y divide-slate-50 max-h-100 overflow-y-auto">
                {MOCK_NEARBY_USERS.map(u => (
                  <div key={u.id} className="p-5 flex justify-between items-center hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center font-black text-slate-400 border border-slate-100">{u.name[0]}</div>
                      <div><h6 className="font-bold text-slate-900 text-sm leading-none mb-1">{u.name}</h6><p className="text-[10px] text-slate-400 font-bold uppercase">{u.distance} away</p></div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => onMessageUser(u.name)} className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-teal-600 transition-all"><MessageCircle className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>

      <Modal isOpen={isPanicModalOpen} onClose={() => setIsPanicModalOpen(false)} title="Panic Signal">
        <div className="space-y-8">
          <div className="bg-rose-50 p-6 rounded-3xl border border-rose-100 flex gap-4"><AlertTriangle className="w-8 h-8 text-rose-600 shrink-0" /><div><h4 className="font-black text-rose-800 uppercase tracking-tight mb-1 leading-none">High Alert</h4><p className="text-sm text-rose-700 font-medium">Alert responders within 5km.</p></div></div>
          <textarea placeholder="Tell us what happened..." className="w-full p-5 bg-slate-50 border rounded-3xl h-32 focus:outline-none focus:border-teal-500 transition-all text-slate-700 font-medium resize-none" />
          <div className="grid grid-cols-2 gap-4"><Button variant="danger" className="py-5 text-xl uppercase"><Send className="w-6 h-6" /> Send Signal</Button><Button variant="outline" onClick={() => setIsPanicModalOpen(false)} className="py-5 text-xl uppercase">Cancel</Button></div>
        </div>
      </Modal>
    </div>
  );
};

const DashboardView = ({ conditions, feedback }: { conditions: EmergencyCondition[], feedback: FeedbackItem[] }) => (
  <div className="space-y-8 animate-in fade-in duration-700">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[
        { label: "Active Alerts", value: "87", icon: AlertCircle, color: "text-rose-600", bg: "bg-rose-50" },
        { label: "Community", value: "12", icon: Activity, color: "text-teal-600", bg: "bg-teal-50" },
        { label: "Guides", value: conditions.length.toString(), icon: Lightbulb, color: "text-amber-600", bg: "bg-amber-50" },
        { label: "My Feedback", value: feedback.length.toString(), icon: MessageSquare, color: "text-blue-600", bg: "bg-blue-50" }
      ].map((m, i) => (
        <Card key={i}><div className={`${m.bg} ${m.color} p-3 rounded-2xl w-fit mb-4`}><m.icon className="w-6 h-6" /></div><p className="text-slate-400 text-[10px] font-black uppercase tracking-widest text-balance">{m.label}</p><h4 className="text-3xl font-black text-slate-900 tracking-tighter mt-1">{m.value}</h4></Card>
      ))}
    </div>
  </div>
);

const SettingsView = () => (
  <Card className="max-w-xl mx-auto space-y-6">
    <h3 className="text-2xl font-black uppercase text-slate-900 text-balance">Settings</h3>
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl"><span className="font-bold text-slate-700 uppercase text-xs tracking-widest">Global Peer Detection</span><div className="w-12 h-6 bg-teal-600 rounded-full relative"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" /></div></div>
    </div>
    <Button className="w-full py-4 uppercase">Update Settings</Button>
  </Card>
);

const NavItem = ({ id, icon: Icon, label, activeView, onClick, badge }: { id: string, icon: React.ElementType, label: string, activeView: string, onClick: (id: string) => void, badge?: string }) => {
  const isActive = activeView === id;
  return (
    <button onClick={() => onClick(id)} className={`w-full flex items-center gap-3 px-6 py-4 transition-all group relative ${isActive ? 'text-teal-700 bg-teal-50 font-black' : 'text-slate-400 hover:text-slate-600'}`}>
      {isActive && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-teal-700 rounded-r-full" />}
      <Icon className={`w-5 h-5 ${isActive ? 'text-teal-700' : 'text-slate-300'}`} />
      <span className="text-xs font-black uppercase tracking-widest flex-1 text-left">{label}</span>
      {badge && <div className="bg-teal-600 text-white text-[9px] px-2 py-0.5 rounded-full font-black">{badge}</div>}
      {isActive && <ChevronRight className="ml-auto w-4 h-4 opacity-50" />}
    </button>
  );
};

const LoginPage = ({ onLogin }: { onLogin: () => void }) => (
  <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
    <Card className="w-full max-w-md p-10 animate-in fade-in zoom-in-95 duration-500">
      <div className="text-center mb-10"><div className="bg-teal-700 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"><Activity className="text-white w-7 h-7" /></div><h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase text-balance">EFAA Hub</h1></div>
      <div className="space-y-4"><input type="email" placeholder="Email" className="w-full px-4 py-4 bg-slate-50 border rounded-2xl outline-none" /><input type="password" placeholder="Password" className="w-full px-4 py-4 bg-slate-50 border rounded-2xl outline-none" /><Button onClick={onLogin} className="w-full py-5 text-lg mt-4 uppercase">Sign In</Button></div>
    </Card>
  </div>
);

/**
 * MAIN COMPONENT (EXPORTED)
 */
export default function App() {
  const [authState, setAuthState] = useState<'login' | 'authenticated'>('login');
  const [activeView, setActiveView] = useState('profile');
  const [selectedChatUser, setSelectedChatUser] = useState<ChatThread | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const rafId = requestAnimationFrame(() => {
      setIsMounted(true);
      if (localStorage.getItem('efaa_user_logged_in') === 'true') setAuthState('authenticated');
    });
    return () => cancelAnimationFrame(rafId);
  }, []);

  const handleLogin = () => { localStorage.setItem('efaa_user_logged_in', 'true'); setAuthState('authenticated'); };
  const handleLogout = () => { localStorage.removeItem('efaa_user_logged_in'); setAuthState('login'); };

  const handleMessageNearbyUser = (userName: string) => {
    const thread = MOCK_CHAT_THREADS.find(t => t.userName === userName) || {
      id: Date.now().toString(),
      userName,
      lastMessage: "",
      time: "Now",
      unread: 0,
      status: 'Active' as const
    };
    setSelectedChatUser(thread);
    setActiveView('chat');
  };

  if (!isMounted) return null;
  if (authState === 'login') return <LoginPage onLogin={handleLogin} />;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col md:flex-row overflow-x-hidden selection:bg-teal-100 selection:text-teal-900">

      <aside className="hidden md:flex w-72 bg-white border-r border-slate-100 flex-col sticky top-0 h-screen z-50">
        
        <div className="p-8 mb-4 flex items-center gap-3 cursor-pointer" onClick={() => window.location.href = "/dashboard"}><div className="bg-teal-700 p-2 rounded-xl shadow-lg"><Activity className="text-white w-6 h-6" /></div><span className="text-2xl font-black  text-teal-800 uppercase tracking-tighter">EFAA</span></div>
        <nav className="flex-1 space-y-1">
          <NavItem id="dashboard" icon={LayoutDashboard} label="Overview" activeView={activeView} onClick={setActiveView} />
          <NavItem id="profile" icon={UserIcon} label="My Profile" activeView={activeView} onClick={setActiveView} />
          <NavItem id="inbox" icon={MessageSquare} label="Inbox" activeView={activeView} onClick={setActiveView} badge="2" />
          <NavItem id="settings" icon={Settings} label="Settings" activeView={activeView} onClick={setActiveView} />
        </nav>
        <div className="p-6"><button onClick={handleLogout} className="w-full flex items-center gap-3 px-6 py-4 text-rose-500 font-black uppercase tracking-widest hover:bg-rose-50 rounded-2xl transition-all"><LogOut className="w-5 h-5" /> Sign Out</button></div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 h-screen">
        <header className="bg-white/80 backdrop-blur-md z-40 border-b px-8 py-5 flex items-center justify-between border-slate-100 shadow-xs">
          <div className="flex items-center gap-4">
            <button onClick={() => setActiveView('inbox')} className="md:hidden p-2 text-slate-400 hover:text-teal-700 transition-colors"><ArrowLeft className="w-6 h-6" /></button>
            <h2 className="text-lg font-black uppercase tracking-tighter text-slate-700">{activeView === 'chat' ? `Responder Chat` : activeView}</h2>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 bg-slate-50 text-slate-400 hover:text-teal-600 rounded-xl transition-colors"><Bell className="w-5 h-5" /><span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" /></button>
            <div className="w-10 h-10 rounded-full bg-linear-to-br from-teal-500 to-teal-800 flex items-center justify-center text-white font-black text-xs shadow-md">OS</div>
          </div>
        </header>

        <div className="p-8 flex-1 max-w-7xl mx-auto w-full h-full overflow-y-auto">
          {activeView === 'dashboard' && <DashboardView conditions={MOCK_CONDITIONS} feedback={MOCK_FEEDBACK} />}
          {activeView === 'profile' && <ProfileView onMessageUser={handleMessageNearbyUser} />}
          {activeView === 'inbox' && <InboxView onSelectChat={(thread) => { setSelectedChatUser(thread); setActiveView('chat'); }} />}
          {activeView === 'chat' && selectedChatUser && <ChatDetailView thread={selectedChatUser} onBack={() => setActiveView('inbox')} />}
          {activeView === 'settings' && <SettingsView />}
        </div>
      </main>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t px-6 py-4 flex justify-between z-50 border-slate-100 shadow-2xl">
        <button onClick={() => setActiveView('dashboard')} className={activeView === 'dashboard' ? 'text-teal-700' : 'text-slate-300'}><LayoutDashboard /></button>
        <button onClick={() => setActiveView('profile')} className={activeView === 'profile' ? 'text-teal-700' : 'text-slate-300'}><UserIcon /></button>
        <button onClick={() => setActiveView('inbox')} className={activeView === 'inbox' || activeView === 'chat' ? 'text-teal-700' : 'text-slate-300'}><MessageSquare /></button>
        <button onClick={() => setActiveView('settings')} className={activeView === 'settings' ? 'text-teal-700' : 'text-slate-300'}><Settings /></button>
        <button onClick={handleLogout} className="text-rose-300"><LogOut /></button>
      </nav>
    </div>
  );
}