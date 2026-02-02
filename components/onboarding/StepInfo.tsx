"use client";

import React, { ReactNode, InputHTMLAttributes } from "react";
import { Mail, Phone, User, Info } from "lucide-react";

/**
 * TYPES & INTERFACES
 */

export interface FormData {
  fullName: string;
  email: string;
  phone: string;
}

interface StepInfoProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  nextStep: () => void;
}

/**
 * INTERNAL UI COMPONENTS
 * Consolidated for portability and to ensure zero-config compilation.
 */

const ProgressIndicator = ({ currentStep }: { currentStep: number }) => (
  <div className="flex gap-2 mb-8 justify-center">
    {[1, 2, 3].map((s) => (
      <div
        key={s}
        className={`h-1.5 rounded-full transition-all duration-500 ${s <= currentStep ? 'w-8 bg-teal-600' : 'w-4 bg-slate-200'
          }`}
      />
    ))}
  </div>
);

const Card = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div className={`bg-white rounded-3xl p-8 shadow-sm border border-slate-100 ${className}`}>
    {children}
  </div>
);

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: ReactNode;
}

const InputField = ({ label, icon, ...props }: InputFieldProps) => (
  <div className="mb-5">
    <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">
      {label}
    </label>
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-600 transition-colors">
        {icon}
      </div>
      <input
        {...props}
        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-slate-900 placeholder:text-slate-400"
      />
    </div>
  </div>
);

const SButton = ({
  children,
  variant = 'primary',
  className = "",
  ...props
}: {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const variants = {
    primary: "bg-teal-700 text-white hover:bg-teal-800 shadow-md",
    secondary: "bg-white text-teal-700 border-2 border-teal-700 hover:bg-teal-50",
    ghost: "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
  };

  return (
    <button
      {...props}
      className={`w-full py-4 rounded-2xl font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${variants[variant]} ${className} disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  );
};

/**
 * STEP INFO COMPONENT
 * Focused on gathering basic profile data to personalize the emergency response.
 */

const StepInfo = ({
  formData,
  setFormData,
  nextStep
}: StepInfoProps) => {

  const handleUpdate = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <ProgressIndicator currentStep={2} />

      <h2 className="text-2xl font-bold mb-2 text-slate-900">Tell us about yourself</h2>
      <p className="text-slate-500 mb-8 leading-relaxed">
        This helps us personalize your emergency support and community safety guidance.
      </p>

      <Card>
        <InputField
          label="Full Name"
          placeholder="e.g. Chidi Benson"
          icon={<User className="w-5 h-5" />}
          value={formData.fullName}
          onChange={(e) => handleUpdate('fullName', e.target.value)}
          required
        />

        <InputField
          label="Email Address (Optional)"
          type="email"
          placeholder="email@example.com"
          icon={<Mail className="w-5 h-5" />}
          value={formData.email}
          onChange={(e) => handleUpdate('email', e.target.value)}
        />

        <InputField
          label="Phone Number (Optional)"
          type="tel"
          placeholder="+234..."
          icon={<Phone className="w-5 h-5" />}
          value={formData.phone}
          onChange={(e) => handleUpdate('phone', e.target.value)}
        />

        <div className="flex gap-2 mt-2 text-xs text-slate-400 leading-tight bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <Info className="w-4 h-4 shrink-0 text-teal-600" />
          <p>
            Your information helps us improve local emergency guidance. We never share your data with unauthorized third parties.
          </p>
        </div>
      </Card>

      <div className="mt-8">
        <SButton
          onClick={nextStep}
          disabled={!formData.fullName.trim()}
          variant="primary"
        >
          Continue
        </SButton>
      </div>
    </div>
  );
};

export default StepInfo;