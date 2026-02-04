"use client";

import React, { useState, useMemo } from 'react';
import {
  Search,
  ArrowLeft,
  ChevronRight,
  Activity,
  Droplets,
  Flame,
  Wind,
  Skull,
  Clock,
  X,
  SearchX,
  AlertCircle
} from 'lucide-react';

/**
 * TYPES & INTERFACES
 */
interface Condition {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

/**
 * DUMMY DATA
 */
const CONDITIONS: Condition[] = [
  {
    id: '1',
    slug: 'seizure',
    name: 'Seizure',
    description: 'Rhythmic shaking or loss of consciousness.',
    icon: <Activity className="w-6 h-6" />,
    color: 'bg-teal-50 text-teal-600',
  },
  {
    id: '2',
    slug: 'severe-bleeding',
    name: 'Severe Bleeding',
    description: 'Heavy blood loss from deep wounds.',
    icon: <Droplets className="w-6 h-6" />,
    color: 'bg-rose-50 text-rose-600',
  },
  {
    id: '3',
    slug: 'burns',
    name: 'Burns',
    description: 'Heat, chemical, or electrical skin damage.',
    icon: <Flame className="w-6 h-6" />,
    color: 'bg-orange-50 text-orange-600',
  },
  {
    id: '4',
    slug: 'choking',
    name: 'Choking',
    description: 'Blocked airway and inability to breathe.',
    icon: <Wind className="w-6 h-6" />,
    color: 'bg-blue-50 text-blue-600',
  },
  {
    id: '5',
    slug: 'snake-bite',
    name: 'Snake Bite',
    description: 'Venomous bites requiring urgent care.',
    icon: <Skull className="w-6 h-6" />,
    color: 'bg-slate-50 text-slate-600',
  },
  {
    id: '6',
    slug: 'unconscious',
    name: 'Unconscious',
    description: 'Person is non-responsive but breathing.',
    icon: <Activity className="w-6 h-6" />,
    color: 'bg-purple-50 text-purple-600',
  }
];

/**
 * REUSABLE COMPONENTS
 * (In a local project, these would be in /components/search/)
 */

const SearchInput = ({
  value,
  onChange,
  onClear
}: {
  value: string;
  onChange: (val: string) => void;
  onClear: () => void;
}) => (
  <div className="relative group">
    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-600 transition-colors">
      <Search className="w-5 h-5" />
    </div>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search symptoms (e.g. seizure, bleeding)"
      className="w-full bg-white border border-slate-100 rounded-3xl py-5 pl-14 pr-12 text-lg shadow-sm focus:outline-none focus:ring-4 focus:ring-teal-500/5 focus:border-teal-500 transition-all placeholder:text-slate-400"
    />
    {value && (
      <button
        onClick={onClear}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-slate-100 rounded-full text-slate-400"
      >
        <X className="w-5 h-5" />
      </button>
    )}
  </div>
);

const ConditionCard = ({ condition }: { condition: Condition }) => (
  <div
    onClick={() => window.location.href = `/conditions/${condition.slug}`}
    className="bg-white rounded-[2rem] p-5 border border-slate-100 shadow-xs hover:shadow-md hover:border-teal-100 transition-all cursor-pointer group flex flex-col h-full"
  >
    <div className={`${condition.color} w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-inner`}>
      {condition.icon}
    </div>
    <h3 className="font-bold text-slate-900 text-lg mb-1 group-hover:text-teal-700 transition-colors">
      {condition.name}
    </h3>
    <p className="text-slate-500 text-sm leading-relaxed mb-4 flex-1">
      {condition.description}
    </p>
    <div className="flex items-center text-xs font-bold text-teal-600 uppercase tracking-widest gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      Guide <ChevronRight className="w-3 h-3" />
    </div>
  </div>
);

const ConditionGrid = ({ conditions }: { conditions: Condition[] }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
    {conditions.map((c) => (
      <ConditionCard key={c.id} condition={c} />
    ))}
  </div>
);

/**
 * MAIN SEARCH PAGE
 */
export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>(['Bleeding', 'Snake Bite']);

  const filteredConditions = useMemo(() => {
    const lowerQuery = query.toLowerCase().trim();
    if (!lowerQuery) return CONDITIONS;

    return CONDITIONS.filter(c =>
      c.name.toLowerCase().includes(lowerQuery) ||
      c.description.toLowerCase().includes(lowerQuery)
    );
  }, [query]);

  const handleClear = () => setQuery('');

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-teal-100">

      {/* --- Sticky Header --- */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <button
            onClick={() => window.history.back()}
            className="p-2 -ml-2 hover:bg-slate-100 rounded-2xl text-slate-400 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl font-black tracking-tight text-slate-900">Search Conditions</h1>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Guidance in seconds</p>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 pt-8 pb-24">

        {/* --- Title & Subtitle --- */}
        <div className="mb-8">
          <h2 className="text-3xl font-black text-slate-900 mb-2">Find Help Fast</h2>
          <p className="text-slate-500 font-medium">Find the right first aid guidance by symptom or name.</p>
        </div>

        {/* --- Search Box --- */}
        <div className="mb-10">
          <SearchInput
            value={query}
            onChange={setQuery}
            onClear={handleClear}
          />
        </div>

        {/* --- Recent Searches (Bonus) --- */}
        {!query && recentSearches.length > 0 && (
          <div className="mb-10 animate-in fade-in slide-in-from-top-2 duration-500">
            <div className="flex items-center gap-2 mb-4 text-slate-400">
              <Clock className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest">Recent Searches</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setQuery(s)}
                  className="bg-white border border-slate-100 px-5 py-2.5 rounded-full text-sm font-semibold text-slate-600 hover:border-teal-200 hover:text-teal-700 transition-all shadow-xs"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* --- Results Section --- */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
              {query ? `Search Results (${filteredConditions.length})` : 'Common Conditions'}
            </h3>
          </div>

          {filteredConditions.length > 0 ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <ConditionGrid conditions={filteredConditions} />
            </div>
          ) : (
            /* --- Empty State --- */
            <div className="bg-white rounded-[2.5rem] p-12 text-center border border-slate-100 shadow-sm animate-in zoom-in-95 duration-500">
              <div className="bg-slate-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <SearchX className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">No condition found</h3>
              <p className="text-slate-500 mb-8 max-w-xs mx-auto">
                Try searching for a broad term like &quot;shaking&quot; or &quot;bleeding&quot;.
              </p>
              <button
                onClick={handleClear}
                className="text-teal-700 font-bold hover:underline underline-offset-4"
              >
                Clear search and try again
              </button>
            </div>
          )}
        </div>

        {/* --- Safety Nudge --- */}
        <div className="mt-16 bg-teal-900 rounded-4xl p-8 text-white relative overflow-hidden">
          <div className="relative z-10 flex gap-4">
            <div className="bg-white/10 p-3 rounded-2xl h-fit shrink-0">
              <AlertCircle className="w-6 h-6 text-teal-300" />
            </div>
            <div>
              <h4 className="font-black text-lg mb-1 uppercase tracking-tight">Can&apos;t find what you need?</h4>
              <p className="text-teal-100/80 text-sm leading-relaxed mb-4">
                If the situation is critical and you aren&apos;t sure what to do, call local emergency services immediately.
              </p>
              <a
                href="tel:112"
                className="inline-flex items-center gap-2 bg-white text-teal-900 px-6 py-3 rounded-xl font-bold text-sm active:scale-95 transition-transform"
              >
                <PhoneIcon className="w-4 h-4 fill-current" /> Call 112
              </a>
            </div>
          </div>
          {/* Decorative Background */}
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-teal-800 rounded-full blur-3xl opacity-50" />
        </div>

      </main>

    </div>
  );
}

// Simple fallback icon component
const PhoneIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M6.62 10.79a15.15 15.15 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.11-.27 11.72 11.72 0 0 0 3.67.58 1 1 0 0 1 1 1v3.59a1 1 0 0 1-1 1A16 16 0 0 1 3 4a1 1 0 0 1 1-1h3.59a1 1 0 0 1 1 1 11.72 11.72 0 0 0 .58 3.67 1 1 0 0 1-.27 1.11l-2.2 2.2z" />
  </svg>
);