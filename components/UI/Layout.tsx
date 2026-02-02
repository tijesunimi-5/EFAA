"use client"
import { Step } from "@/types";
import { Activity, ArrowLeft } from "lucide-react";
import { ReactNode } from "react";

const Layout = ({ children, onBack, currentStep }: { children: ReactNode; onBack?: () => void; currentStep: Step }) => (
  <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
    <header className="p-6 flex items-center justify-between max-w-2xl mx-auto w-full">
      <div className="flex items-center gap-2">
        <div className="bg-teal-700 p-1.5 rounded-lg">
          <Activity className="text-white w-5 h-5" />
        </div>
        <span className="font-black tracking-tighter text-teal-800 text-xl">EFAA</span>
      </div>
      {onBack && currentStep !== 'complete' && (
        <button
          onClick={onBack}
          className="text-slate-500 hover:text-teal-700 flex items-center gap-1 text-sm font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      )}
    </header>
    <main className="flex-1 flex flex-col items-center px-6 pb-12">
      <div className="w-full max-w-md">
        {children}
      </div>
    </main>
  </div>
);

export default Layout