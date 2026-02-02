"use client";

import React, { useState, ReactNode, use } from 'react';
import {
  Activity,
  ArrowLeft,
  ShieldCheck,
  ChevronRight,
  Phone,
  Flame,
  Droplets,
  Wind
} from 'lucide-react';

/**
 * EMERGENCY DATA REGISTRY
 */
const EMERGENCY_CONTENT = {
  seizure: {
    title: "Seizure",
    steps: [
      {
        title: "Stay calm and ensure safety",
        instruction: "Do not panic. Move any sharp or hard objects away from the person to prevent injury.",
      },
      {
        title: "Do NOT restrain them",
        instruction: "Do not hold them down or try to stop their movements. This can cause bone or muscle injury.",
      },
      {
        title: "Turn them on their side",
        instruction: "Once the shaking stops, gently turn them on their side. This keeps their airway clear.",
      },
      {
        title: "Nothing in the mouth",
        instruction: "NEVER put anything in their mouth. They will not swallow their tongue.",
      },
      {
        title: "Time the seizure",
        instruction: "If the shaking lasts longer than 5 minutes, call emergency services immediately.",
      }
    ]
  },
  bleeding: {
    title: "Severe Bleeding",
    steps: [
      {
        title: "Apply direct pressure",
        instruction: "Use a clean cloth or your hands (with gloves if possible) to push hard directly on the wound.",
      },
      {
        title: "Maintain pressure",
        instruction: "Do not lift the cloth to check the wound. If blood soaks through, add another cloth on top.",
      },
      {
        title: "Elevate the wound",
        instruction: "If possible, keep the bleeding limb raised above the level of the heart.",
      },
      {
        title: "Help them lie down",
        instruction: "Keep the person still and warm. This helps prevent shock.",
      },
      {
        title: "Secure the dressing",
        instruction: "Once bleeding slows, wrap the cloth firmly with a bandage or another strip of cloth.",
      }
    ]
  },
  burns: {
    title: "Burns",
    steps: [
      {
        title: "Cool the burn",
        instruction: "Run cool (not cold) tap water over the burn for at least 10 to 20 minutes.",
      },
      {
        title: "Remove restrictive items",
        instruction: "Gently remove rings or tight clothing before the area starts to swell.",
      },
      {
        title: "Do NOT pop blisters",
        instruction: "Popping blisters increases the risk of infection. Leave them alone.",
      },
      {
        title: "Cover loosely",
        instruction: "Apply a sterile gauze bandage or clean cloth loosely to protect the area.",
      },
      {
        title: "Seek help if severe",
        instruction: "If the burn is large, deep, or on the face/hands, go to a hospital immediately.",
      }
    ]
  },
  choking: {
    title: "Choking",
    steps: [
      {
        title: "Encourage coughing",
        instruction: "If the person can speak or cough loudly, encourage them to keep coughing.",
      },
      {
        title: "5 Back Blows",
        instruction: "Lean them forward and give 5 sharp blows between the shoulder blades with the heel of your hand.",
      },
      {
        title: "5 Abdominal Thrusts",
        instruction: "Stand behind them. Wrap arms around waist. Make a fist above the navel and pull inward and upward 5 times.",
      },
      {
        title: "Repeat the cycle",
        instruction: "Alternate between 5 back blows and 5 abdominal thrusts until the object is forced out.",
      },
      {
        title: "If they go limp",
        instruction: "If they become unconscious, lower them to the ground and begin CPR immediately.",
      }
    ]
  }
};

/**
 * REUSABLE COMPONENTS
 */

const ProgressBar = ({ current, total }: { current: number; total: number }) => (
  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-8">
    <div
      className="h-full bg-teal-600 transition-all duration-500 ease-out"
      style={{ width: `${(current / total) * 100}%` }}
    />
  </div>
);

const ActionButton = ({
  children,
  onClick,
  variant = 'primary'
}: {
  children: ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'emergency'
}) => (
  <button
    onClick={onClick}
    className={`w-full py-5 rounded-2xl font-black text-xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-3 ${variant === 'primary'
        ? 'bg-teal-700 text-white hover:bg-teal-800'
        : 'bg-rose-600 text-white hover:bg-rose-700'
      }`}
  >
    {children}
  </button>
);

const StepCard = ({
  step,
  title,
  instruction,
  totalSteps,
  type
}: {
  step: number;
  title: string;
  instruction: string;
  totalSteps: number;
  type: string;
}) => {
  const IconMap = {
    seizure: <Activity className="text-teal-600 w-8 h-8" />,
    bleeding: <Droplets className="text-rose-600 w-8 h-8" />,
    burns: <Flame className="text-orange-600 w-8 h-8" />,
    choking: <Wind className="text-blue-600 w-8 h-8" />,
  };

  return (
    <div className="flex flex-col flex-1 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-4">
        <span className="text-teal-700 font-bold uppercase tracking-widest text-sm">
          Step {step} of {totalSteps}
        </span>
        <h2 className="text-3xl font-black text-slate-900 mt-2 leading-tight">
          {title}
        </h2>
      </div>

      <div className="w-full aspect-square bg-slate-100 rounded-[2.5rem] my-6 flex items-center justify-center border-2 border-dashed border-slate-200">
        <div className="text-center p-8">
          <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
            {IconMap[type as keyof typeof IconMap] || <Activity className="text-teal-600 w-8 h-8" />}
          </div>
          <p className="text-slate-400 font-bold text-sm uppercase tracking-wider">
            Instructional Visual
          </p>
        </div>
      </div>

      <p className="text-xl text-slate-600 leading-relaxed font-medium">
        {instruction}
      </p>
    </div>
  );
};

const EmergencyLayout = ({
  children,
  onBack,
  title
}: {
  children: ReactNode;
  onBack: () => void;
  title: string;
}) => (
  <div className="min-h-screen bg-white font-sans text-slate-900 flex flex-col p-6">
    <header className="flex items-center gap-4 mb-6">
      <button
        onClick={onBack}
        className="p-2 -ml-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-colors"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>
      <div className="flex items-center gap-2">
        <Activity className="text-teal-700 w-5 h-5" />
        <span className="font-black text-slate-400 text-sm uppercase tracking-tighter">
          {title} — Emergency Guidance
        </span>
      </div>
    </header>

    {children}

    <footer className="mt-8 pt-6 border-t border-slate-100">
      <div className="bg-rose-50 p-4 rounded-2xl flex items-center justify-between border border-rose-100">
        <div className="flex items-center gap-3">
          <div className="bg-rose-600 p-2 rounded-lg text-white">
            <Phone className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] font-black text-rose-800 uppercase tracking-widest">Immediate Help</p>
            <p className="text-rose-700 font-bold">Call 112 (Emergency)</p>
          </div>
        </div>
        <ChevronRight className="text-rose-300 w-5 h-5" />
      </div>
    </footer>
  </div>
);

/**
 * DYNAMIC EMERGENCY FLOW PAGE
 */
export default function EmergencyFlowPage({
  params
}: {
  params: Promise<{ condition: string }>
}) {
  const resolvedParams = use(params);
  const type = resolvedParams.condition as keyof typeof EMERGENCY_CONTENT;

  const [currentStep, setCurrentStep] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // Get content based on type, fallback to seizure
  const content = EMERGENCY_CONTENT[type] || EMERGENCY_CONTENT.seizure;
  const steps = content.steps;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      window.history.back();
    }
  };

  if (isFinished) {
    return (
      <EmergencyLayout onBack={() => setIsFinished(false)} title={content.title}>
        <div className="flex-1 flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-500">
          <div className="bg-teal-100 p-6 rounded-[2.5rem] mb-6">
            <ShieldCheck className="text-teal-700 w-16 h-16" />
          </div>
          <h2 className="text-4xl font-black text-slate-900 mb-4">You did great.</h2>
          <p className="text-xl text-slate-600 mb-12 max-w-xs mx-auto">
            Stay with the person until help arrives or they are fully alert. Keep them calm and comfortable.
          </p>
          <ActionButton onClick={() => window.location.href = '/'}>
            Return Home
          </ActionButton>
        </div>
      </EmergencyLayout>
    );
  }

  return (
    <EmergencyLayout onBack={handleBack} title={content.title}>
      <ProgressBar current={currentStep + 1} total={steps.length} />

      <StepCard
        step={currentStep + 1}
        totalSteps={steps.length}
        title={steps[currentStep].title}
        instruction={steps[currentStep].instruction}
        type={type}
      />

      <div className="mt-8">
        <ActionButton onClick={handleNext}>
          {currentStep === steps.length - 1 ? "Finish Guidance" : "Done — Next step"}
          <ChevronRight className="w-6 h-6" />
        </ActionButton>
      </div>
    </EmergencyLayout>
  );
}