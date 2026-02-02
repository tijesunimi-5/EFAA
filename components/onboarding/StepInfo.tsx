"use client";

import React, { ReactNode, InputHTMLAttributes, SelectHTMLAttributes } from "react";
import { Mail, Phone, User, Info, Globe, ChevronRight } from "lucide-react";

/**
 * TYPES & INTERFACES
 */

export interface FormData {
  fullName: string;
  email: string;
  phone: string;
  country: string;
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
        className={`h-1.5 rounded-full transition-all duration-500 ${s <= currentStep ? "w-8 bg-teal-600" : "w-4 bg-slate-200"
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

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  icon: ReactNode;
  options: { value: string; label: string }[];
}

const SelectField = ({ label, icon, options, ...props }: SelectFieldProps) => (
  <div className="mb-5">
    <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">
      {label}
    </label>
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-600 transition-colors z-10 pointer-events-none">
        {icon}
      </div>
      <select
        {...props}
        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-10 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-slate-900 appearance-none cursor-pointer"
      >
        <option value="" disabled>
          Select your country
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
        <ChevronRight className="w-4 h-4 rotate-90" />
      </div>
    </div>
  </div>
);

const SButton = ({
  children,
  variant = "primary",
  className = "",
  ...props
}: {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const variants = {
    primary: "bg-teal-700 text-white hover:bg-teal-800 shadow-md",
    secondary: "bg-white text-teal-700 border-2 border-teal-700 hover:bg-teal-50",
    ghost: "text-slate-500 hover:text-slate-800 hover:bg-slate-100",
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
 * Gathering profile data and region to personalize the emergency response.
 */

const StepInfo = ({ formData, setFormData, nextStep }: StepInfoProps) => {
  const countries = [
    { value: "nigeria", label: "Nigeria" },
    { value: "ghana", label: "Ghana" },
    { value: "kenya", label: "Kenya" },
    { value: "south_africa", label: "South Africa" },
    { value: "rwanda", label: "Rwanda" },
    { value: "other", label: "Other" },
  ];

  const isValid = formData.fullName.trim() !== "" && formData.country !== "";

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <ProgressIndicator currentStep={2} />

      <h2 className="text-2xl font-bold mb-2 text-slate-900">Tell us about yourself</h2>
      <p className="text-slate-500 mb-8 leading-relaxed">
        This helps us personalize your emergency support.
      </p>

      <Card>
        <InputField
          label="Full Name"
          placeholder="e.g. Chidi Benson"
          icon={<User className="w-5 h-5" />}
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
        />

        <SelectField
          label="Your Region / Country"
          icon={<Globe className="w-5 h-5" />}
          options={countries}
          value={formData.country}
          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
        />

        <InputField
          label="Email Address (Optional)"
          type="email"
          placeholder="email@example.com"
          icon={<Mail className="w-5 h-5" />}
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />

        <InputField
          label="Phone Number (Optional)"
          type="tel"
          placeholder="+234..."
          icon={<Phone className="w-5 h-5" />}
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />

        <div className="flex gap-2 mt-2 text-xs text-slate-400 leading-tight bg-slate-50 p-3 rounded-xl">
          <Info className="w-4 h-4 shrink-0" />
          <p>Your information helps us improve emergency guidance in your area.</p>
        </div>
      </Card>

      <div className="mt-8">
        <SButton onClick={nextStep} disabled={!isValid}>
          Continue
        </SButton>
      </div>
    </div>
  );
};

export default StepInfo;