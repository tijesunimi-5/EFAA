"use client";
import React, { useState } from 'react';
import StepLocation from '@/components/onboarding/StepLocation';
import StepWelcome from '@/components/onboarding/StepWelcome';
import StepInfo from '@/components/onboarding/StepInfo';
import Layout from '@/components/UI/Layout';
import SuccessScreen from '@/components/onboarding/SuccessScreen';

/**
 * TYPES & INTERFACES
 */
export type Step = 1 | 2 | 3 | 'complete';

export interface FormData {
  fullName: string;
  email: string;
  phone: string;
}

// --- Internal UI Components (Consolidated for Compilation) ---

// const Layout = ({ children, onBack, currentStep }: { children: ReactNode; onBack?: () => void; currentStep: number | Step }) => {
//   const displayStep = typeof currentStep === 'number' ? currentStep : 3;

//   return (
//     <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
//       <header className="p-6 flex items-center justify-between max-w-2xl mx-auto w-full">
//         <div className="flex items-center gap-2">
//           <div className="bg-teal-700 p-1.5 rounded-lg">
//             <Activity className="text-white w-5 h-5" />
//           </div>
//           <span className="font-black tracking-tighter text-teal-800 text-xl">EFAA</span>
//         </div>
//         {onBack && (
//           <button
//             onClick={onBack}
//             className="text-slate-500 hover:text-teal-700 flex items-center gap-1 text-sm font-medium transition-colors"
//           >
//             <ArrowLeft className="w-4 h-4" /> Back
//           </button>
//         )}
//       </header>
//       <main className="flex-1 flex flex-col items-center px-6 pb-12">
//         <div className="w-full max-w-md">
//           {children}
//         </div>
//       </main>
//     </div>
//   );
// };

// const ProgressIndicator = ({ currentStep }: { currentStep: number }) => (
//   <div className="flex gap-2 mb-8 justify-center">
//     {[1, 2, 3].map((s) => (
//       <div
//         key={s}
//         className={`h-1.5 rounded-full transition-all duration-500 ${s <= currentStep ? 'w-8 bg-teal-600' : 'w-4 bg-slate-200'
//           }`}
//       />
//     ))}
//   </div>
// );

// const Card = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
//   <div className={`bg-white rounded-3xl p-8 shadow-sm border border-slate-100 ${className}`}>
//     {children}
//   </div>
// );

// interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
//   label: string;
//   icon: ReactNode;
// }

// const InputField = ({ label, icon, ...props }: InputFieldProps) => (
//   <div className="mb-5">
//     <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">
//       {label}
//     </label>
//     <div className="relative group">
//       <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-600 transition-colors">
//         {icon}
//       </div>
//       <input
//         {...props}
//         className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-slate-900 placeholder:text-slate-400"
//       />
//     </div>
//   </div>
// );

// const SButton = ({
//   children,
//   variant = 'primary',
//   className = "",
//   ...props
// }: {
//   children: ReactNode;
//   variant?: 'primary' | 'secondary' | 'ghost';
//   className?: string;
// } & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
//   const variants = {
//     primary: "bg-teal-700 text-white hover:bg-teal-800 shadow-md",
//     secondary: "bg-white text-teal-700 border-2 border-teal-700 hover:bg-teal-50",
//     ghost: "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
//   };

//   return (
//     <button
//       {...props}
//       className={`w-full py-4 rounded-2xl font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${variants[variant]} ${className} disabled:opacity-50 disabled:cursor-not-allowed`}
//     >
//       {children}
//     </button>
//   );
// };

// --- Onboarding Steps ---

// const StepWelcome = ({ onNext }: { onNext: () => void }) => (
//   <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
//     <div className="w-20 h-20 bg-teal-100 text-teal-700 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
//       <ShieldCheck className="w-10 h-10" />
//     </div>
//     <h1 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">
//       Welcome to EFAA
//     </h1>
//     <p className="text-lg text-slate-600 mb-10 leading-relaxed">
//       EFAA helps guide you through medical emergencies <span className="text-teal-700 font-semibold">calmly and safely.</span>
//     </p>
//     <Card className="mb-8">
//       <ul className="text-left space-y-4">
//         <li className="flex gap-3 text-slate-600 items-start">
//           <CheckCircle2 className="w-5 h-5 text-teal-500 shrink-0 mt-0.5" />
//           <span>Step-by-step emergency guidance</span>
//         </li>
//         <li className="flex gap-3 text-slate-600 items-start">
//           <CheckCircle2 className="w-5 h-5 text-teal-500 shrink-0 mt-0.5" />
//           <span>Offline access for local reliability</span>
//         </li>
//       </ul>
//     </Card>
//     <SButton onClick={onNext}>
//       Get Started <ChevronRight className="w-5 h-5" />
//     </SButton>
//   </div>
// );

// const StepInfo = ({ formData, setFormData, nextStep }: { formData: FormData; setFormData: React.Dispatch<React.SetStateAction<FormData>>; nextStep: () => void }) => (
//   <div className="animate-in fade-in slide-in-from-right-4 duration-500">
//     <ProgressIndicator currentStep={2} />
//     <h2 className="text-2xl font-bold mb-2">Tell us about yourself</h2>
//     <p className="text-slate-500 mb-8">This helps us personalize your emergency support.</p>
//     <Card>
//       <InputField
//         label="Full Name"
//         placeholder="e.g. Chidi Benson"
//         icon={<User className="w-5 h-5" />}
//         value={formData.fullName}
//         onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
//       />
//       <InputField
//         label="Email Address (Optional)"
//         placeholder="email@example.com"
//         icon={<Mail className="w-5 h-5" />}
//         value={formData.email}
//         onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//       />
//       <InputField
//         label="Phone Number (Optional)"
//         placeholder="+234..."
//         icon={<Phone className="w-5 h-5" />}
//         value={formData.phone}
//         onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
//       />
//       <div className="flex gap-2 mt-2 text-xs text-slate-400 leading-tight bg-slate-50 p-3 rounded-xl">
//         <Info className="w-4 h-4 shrink-0" />
//         <p>Your information helps us improve emergency guidance in your area.</p>
//       </div>
//     </Card>
//     <div className="mt-8">
//       <SButton onClick={nextStep} disabled={!formData.fullName}>
//         Continue
//       </SButton>
//     </div>
//   </div>
// );

// const StepLocation = ({ handleLocationRequest, isLocating, nextStep }: { handleLocationRequest: () => void; isLocating: boolean; nextStep: () => void }) => (
//   <div className="animate-in fade-in slide-in-from-right-4 duration-500 text-center">
//     <ProgressIndicator currentStep={3} />
//     <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
//       <MapPin className="w-8 h-8" />
//     </div>
//     <h2 className="text-2xl font-bold mb-3">Enable Location</h2>
//     <p className="text-slate-600 mb-8 leading-relaxed px-4">
//       Location access allows EFAA to pinpoint the nearest hospitals and provide specific guidance for your exact area.
//     </p>
//     <div className="space-y-4">
//       <SButton onClick={handleLocationRequest} disabled={isLocating}>
//         {isLocating ? (
//           <span className="flex items-center gap-2">
//             <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//             Connecting...
//           </span>
//         ) : 'Allow Location Access'}
//       </SButton>
//       <SButton variant="ghost" onClick={nextStep}>
//         Skip for now
//       </SButton>
//     </div>
//   </div>
// );

// 

/**
 * ONBOARDING PAGE
 * Orchestrates the multi-step flow for the EFAA assistant.
 */
export default function OnboardingPage() {
  // --- State Management ---
  const [step, setStep] = useState<Step>(1);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: ''
  });
  const [isLocating, setIsLocating] = useState(false);

  // --- Navigation Logic ---
  const nextStep = () => {
    if (step === 1) setStep(2);
    else if (step === 2) setStep(3);
    else if (step === 3) setStep('complete');
  };

  const prevStep = () => {
    if (step === 2) setStep(1);
    else if (step === 3) setStep(2);
  };

  const handleReset = () => {
    window.location.href = '/dashboard';
  };

  // --- Geolocation Handler ---
  const handleLocationRequest = () => {
    setIsLocating(true);

    if (!navigator.geolocation) {
      setIsLocating(false);
      nextStep();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log("Location captured:", position.coords);
        setIsLocating(false);
        nextStep();
      },
      (error) => {
        console.error("Location error:", error);
        setIsLocating(false);
        nextStep();
      },
      { timeout: 10000 }
    );
  };

  return (
    <Layout
      onBack={step !== 1 && step !== 'complete' ? prevStep : undefined}
      currentStep={step === 'complete' ? 3 : step}
    >
      {step === 1 && (
        <StepWelcome onNext={nextStep} />
      )}

      {step === 2 && (
        <StepInfo
          formData={formData}
          setFormData={setFormData}
          nextStep={nextStep}
        />
      )}

      {step === 3 && (
        <StepLocation
          handleLocationRequest={handleLocationRequest}
          isLocating={isLocating}
          nextStep={nextStep}
        />
      )}

      {step === 'complete' && (
        <SuccessScreen onReset={handleReset} />
      )}
    </Layout>
  );
}