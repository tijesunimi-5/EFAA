"use client";
import React, { useState, useEffect, ReactNode, ButtonHTMLAttributes } from 'react';
import {
  Shield,
  HeartPulse,
  Info,
  AlertCircle,
  Activity,
  Clock,
  ArrowRight
} from 'lucide-react';

/**
 * EFAA - Emergency First Aid Assistant
 * * TYPESCRIPT & LINT FIXES:
 * 1. Resolved react-hooks/set-state-in-effect by using requestAnimationFrame.
 * 2. Included "use client" directive for Next.js compatibility.
 * 3. Maintained Tailwind v4 canonical suggestions and escaped JSX entities.
 */

// --- Component Interfaces ---

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'emergency' | 'outline';
  className?: string;
}

// --- Helper Components ---

const Section: React.FC<SectionProps> = ({ children, className = "", id = "" }) => (
  <section id={id} className={`px-6 py-16 md:py-24 max-w-7xl mx-auto ${className}`}>
    {children}
  </section>
);

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  className = "",
  ...props
}) => {
  const variants = {
    primary: "bg-teal-700 text-white hover:bg-teal-800 shadow-md",
    emergency: "bg-rose-600 text-white hover:bg-rose-700 shadow-lg animate-pulse",
    outline: "border-2 border-teal-700 text-teal-700 hover:bg-teal-50",
  };

  return (
    <button
      className={`px-6 py-4 rounded-xl font-bold transition-all active:scale-95 flex items-center justify-center gap-2 text-lg ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// --- Main Application ---

const App: React.FC = () => {
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    // Schedule state update after paint to avoid "cascading render" lint warning
    const mountId = requestAnimationFrame(() => {
      setMounted(true);
    });

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      cancelAnimationFrame(mountId);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Prevent hydration mismatch by using a stable initial state
  const navBackground: string = !mounted
    ? 'bg-transparent py-5'
    : (scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5');

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-teal-100 selection:text-teal-900">

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBackground}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-teal-700 p-1.5 rounded-lg">
              <Activity className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-teal-800">EFAA</span>
          </div>
          <div className="hidden md:flex items-center gap-8 font-medium text-slate-600">
            <a href="#mission" className="hover:text-teal-700 transition-colors">Mission</a>
            <a href="#how-it-works" className="hover:text-teal-700 transition-colors">How it works</a>
            <Button variant="outline" className="py-2 text-sm">Download App</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-32 pb-20 overflow-hidden bg-linear-to-b from-teal-50 to-slate-50">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-125 h-125 bg-teal-200/20 rounded-full blur-3xl -z-10" />

        <Section className="text-center md:text-left md:flex md:items-center md:gap-12">
          <div className="md:flex-1">
            <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-bold mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
              </span>
              AFRICA&apos;S FIRST AID COMPANION
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 leading-[1.1] mb-6 tracking-tight">
              Guidance when <span className="text-teal-700">seconds</span> matter.
            </h1>

            <p className="text-xl text-slate-600 mb-10 max-w-xl mx-auto md:mx-0 leading-relaxed">
              Immediate, offline, step-by-step first aid instructions tailored for the African context. Calm guidance for seizures, bleeding, and more.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button variant="emergency" className="w-full sm:w-auto px-8 py-5">
                <AlertCircle className="w-6 h-6" />
                🚨 Something is happening now
              </Button>
              <Button variant="outline" className="w-full sm:w-auto">
                Explore Scenarios
              </Button>
            </div>
          </div>

          <div className="mt-16 md:mt-0 md:flex-1 relative">
            <div className="bg-white p-4 rounded-[2.5rem] shadow-2xl border border-slate-200 max-w-[320px] mx-auto transform rotate-2">
              <div className="bg-slate-900 rounded-4xl h-150 w-full overflow-hidden relative">
                <div className="p-6 pt-12 text-white">
                  <div className="flex justify-between items-center mb-8">
                    <Activity className="text-teal-400" />
                    <div className="w-8 h-1 bg-slate-700 rounded-full" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Seizure Response</h3>
                  <p className="text-slate-400 text-sm mb-6">Follow these 5 steps immediately.</p>

                  <div className="space-y-4">
                    {[1, 2, 3].map((step) => (
                      <div key={step} className={`p-4 rounded-2xl border ${step === 1 ? 'bg-teal-900/40 border-teal-500' : 'bg-slate-800 border-slate-700'}`}>
                        <div className="flex gap-3">
                          <span className="font-bold text-teal-400">{step}</span>
                          <div className="h-4 w-3/4 bg-slate-700 rounded mt-1" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="h-12 w-full bg-rose-600 rounded-xl flex items-center justify-center font-bold text-white">
                    NEXT STEP
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl -z-10" />
          </div>
        </Section>
      </header>

      {/* Mission Section */}
      <Section id="mission" className="bg-white">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Mission</h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            In Nigeria, emergency response times can be unpredictable. EFAA bridges the gap between the onset of an emergency and the arrival of medical professionals by empowering everyday people with the knowledge to save lives.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100">
            <div className="bg-teal-100 w-12 h-12 rounded-2xl flex items-center justify-center text-teal-700 mb-6">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Instant Access</h3>
            <p className="text-slate-600">No loading screens. Access life-saving steps in under 3 seconds when pressure is high.</p>
          </div>

          <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100">
            <div className="bg-teal-100 w-12 h-12 rounded-2xl flex items-center justify-center text-teal-700 mb-6">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Offline First</h3>
            <p className="text-slate-600">Designed for reliability. Our core instructions work without data or internet connection across Nigeria.</p>
          </div>

          <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100">
            <div className="bg-teal-100 w-12 h-12 rounded-2xl flex items-center justify-center text-teal-700 mb-6">
              <HeartPulse className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Calm Instructions</h3>
            <p className="text-slate-600">Simple, jargon-free language accompanied by clear visual illustrations to keep you focused.</p>
          </div>
        </div>
      </Section>

      {/* Emergency Scenarios Grid */}
      <Section className="bg-slate-50" id="how-it-works">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-3xl font-bold mb-4">What EFAA covers</h2>
            <p className="text-slate-600 max-w-md">Critical guidance for common medical emergencies found in local communities.</p>
          </div>
          <a href="#" className="text-teal-700 font-bold flex items-center gap-2 hover:underline">
            View all 20+ scenarios <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { title: "Severe Bleeding", icon: "🩸" },
            { title: "Seizures", icon: "🧠" },
            { title: "Choking", icon: "✋" },
            // { title: "Unconsciousness", icon: "💤" },
            { title: "Burn Care", icon: "🔥" },
            { title: "Fainting", icon: "💫" },
            { title: "Poisoning", icon: "🧪" },
            { title: "Allergic Reaction", icon: "🐝" },
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-teal-300 hover:shadow-lg transition-all cursor-pointer group">
              <div className="text-3xl mb-4 grayscale group-hover:grayscale-0 transition-all">{item.icon}</div>
              <h4 className="font-bold text-slate-800">{item.title}</h4>
            </div>
          ))}
        </div>
      </Section>

      {/* Trust & Disclaimer Section */}
      <Section className="bg-white">
        <div className="bg-teal-900 rounded-[3rem] p-8 md:p-16 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-10">
            <Shield className="w-64 h-64" />
          </div>

          <div className="relative z-10 max-w-2xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-teal-400/20 p-2 rounded-lg text-teal-300">
                <Info className="w-6 h-6" />
              </div>
              <span className="font-bold tracking-widest text-sm uppercase">Trust & Safety</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold mb-6">Designed with safety as our core priority.</h2>

            <div className="space-y-6 text-teal-100 text-lg">
              <p>
                EFAA is an assistive tool built to provide standard first aid procedures. We follow international guidelines adapted for immediate use.
              </p>

              <ul className="space-y-4">
                <li className="flex gap-4">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />
                  <span>EFAA does <strong className="text-white">not</strong> diagnose medical conditions.</span>
                </li>
                <li className="flex gap-4">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />
                  <span>EFAA does <strong className="text-white">not</strong> prescribe drugs or treatments.</span>
                </li>
                <li className="flex gap-4">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />
                  <span>EFAA is <strong className="text-white">not</strong> a replacement for professional medical doctors or emergency services.</span>
                </li>
              </ul>

              <div className="pt-8">
                <p className="text-sm opacity-70 italic">
                  Always call local emergency services (112 in Nigeria) as soon as it is safe to do so.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* CTA Footer Section */}
      <Section className="text-center bg-slate-50">
        <h2 className="text-3xl md:text-5xl font-black mb-8 text-slate-900">Be prepared before it happens.</h2>
        <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
          Join thousands of Nigerians keeping EFAA on their home screen for peace of mind.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="primary" className="px-12">
            Download for Android
          </Button>
          <Button variant="outline" className="px-12">
            Download for iOS
          </Button>
        </div>
      </Section>

      {/* Simple Footer */}
      <footer className="border-t border-slate-200 bg-white py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="bg-teal-700 p-1.5 rounded-lg">
              <Activity className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-black tracking-tighter text-teal-800 uppercase">EFAA</span>
          </div>

          <p className="text-slate-500 text-sm">
            © 2024 EFAA (Nigeria). All rights reserved.
          </p>

          <div className="flex gap-6 text-slate-400">
            <a href="#" className="text-sm hover:text-teal-700 transition-colors">Privacy Policy</a>
            <a href="#" className="text-sm hover:text-teal-700 transition-colors">Contact Support</a>
          </div>
        </div>
      </footer>

      {/* Floating Emergency Action (Mobile only) */}
      <div className="md:hidden fixed bottom-6 left-6 right-6 z-40">
        <Button variant="emergency" className="w-full h-16 shadow-2xl">
          <AlertCircle className="w-6 h-6" />
          EMERGENCY HELP NOW
        </Button>
      </div>

    </div>
  );
};

export default App;