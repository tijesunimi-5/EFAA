"use client";

import React, { ReactNode, ButtonHTMLAttributes } from "react";
import { CheckCircle2, ChevronRight, ShieldCheck } from "lucide-react";
import Link from "next/link";

/**
 * TYPES & INTERFACES
 */

interface StepWelcomeProps {
  onNext: () => void;
}

/**
 * INTERNAL UI COMPONENTS
 * Consolidated to ensure zero-config compilation and high portability.
 */

const Card = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div className={`bg-white rounded-3xl p-8 shadow-sm border border-slate-100 ${className}`}>
    {children}
  </div>
);

interface SButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  className?: string;
}

const SButton: React.FC<SButtonProps> = ({
  children,
  variant = 'primary',
  className = "",
  ...props
}) => {
  const variants = {
    primary: "bg-teal-700 text-white hover:bg-teal-800 shadow-md",
    secondary: "bg-white text-teal-700 border-2 border-teal-700 hover:bg-teal-50",
    ghost: "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
  };

  return (
    <button
      {...props}
      className={`w-full py-4 rounded-2xl font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

/**
 * STEP WELCOME COMPONENT
 * The initial landing state of the onboarding flow designed to reassure the user.
 */

const StepWelcome = ({ onNext }: StepWelcomeProps) => {
  return (
    <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="w-20 h-20 bg-teal-100 text-teal-700 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
        <ShieldCheck className="w-10 h-10" />
      </div>

      <h1 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">
        Welcome to EFAA
      </h1>

      <p className="text-lg text-slate-600 mb-10 leading-relaxed">
        EFAA helps guide you through medical emergencies
        <span className="text-teal-700 font-semibold"> calmly and safely.</span>
      </p>

      <Card className="mb-8">
        <ul className="text-left space-y-4">
          <li className="flex gap-3 text-slate-600 items-start">
            <CheckCircle2 className="w-5 h-5 text-teal-500 shrink-0 mt-0.5" />
            <span className="text-sm md:text-base leading-snug">
              Step-by-step emergency guidance for common medical crises.
            </span>
          </li>
          <li className="flex gap-3 text-slate-600 items-start">
            <CheckCircle2 className="w-5 h-5 text-teal-500 shrink-0 mt-0.5" />
            <span className="text-sm md:text-base leading-snug">
              Offline access ensuring reliability when data is unavailable.
            </span>
          </li>
        </ul>
      </Card>

      <SButton onClick={onNext} variant="primary">
        Get Started <ChevronRight className="w-5 h-5" />
      </SButton>
      
      <Link href="/onboarding/login" className="bg-teal-700 text-white hover:bg-teal-800 shadow-md w-full py-4 rounded-2xl font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-2.5">Sign In<ChevronRight className="w-5 h-5" /></Link>
      

      <p className="mt-6 text-xs text-slate-400 uppercase tracking-widest font-bold">
        Nigeria&apos;s First Aid Companion
      </p>
    </div>
  );
};

export default StepWelcome;