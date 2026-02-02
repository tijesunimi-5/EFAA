"use client";

import React, { useState, ReactNode, use, useEffect } from 'react';
import {
  Activity,
  ArrowLeft,
  ShieldCheck,
  ChevronRight,
  Phone,
  Flame,
  Droplets,
  Wind,
  Mic,
  Volume2,
  Clock,
  AlertCircle,
  RotateCcw,
  Info
} from 'lucide-react';

/**
 * TYPES & DATA STRUCTURE
 */
interface EmergencyStep {
  id: string;
  title: string;
  instruction: string;
  helperText: string;
  requiresTimer: boolean;
  timerThreshold?: number; // in seconds
}

interface EmergencyContent {
  title: string;
  subtitle: string;
  steps: EmergencyStep[];
}

const EMERGENCY_CONTENT: Record<string, EmergencyContent> = {
  seizure: {
    title: "Seizure",
    subtitle: "Take a deep breath. We are here with you.",
    steps: [
      {
        id: "s1",
        title: "Stay calm and ensure safety",
        instruction: "Take a deep breath. Look at the person and ensure they are not in immediate danger.",
        helperText: "Clear the space around them. Ensure they won't hit their head on anything hard.",
        requiresTimer: false
      },
      {
        id: "s2",
        title: "Track the duration",
        instruction: "It is important to know how long the seizure lasts.",
        helperText: "The timer below has started automatically to help you keep track.",
        requiresTimer: true,
        timerThreshold: 300 // 5 minutes
      },
      {
        id: "s3",
        title: "Do NOT restrain them",
        instruction: "Do not hold them down or try to stop their movements.",
        helperText: "Restraining them can cause bone or muscle injury. Let the seizure run its course.",
        requiresTimer: true,
        timerThreshold: 300
      },
      {
        id: "s4",
        title: "Nothing in the mouth",
        instruction: "NEVER put anything in their mouth.",
        helperText: "They will not swallow their tongue. Objects can cause choking or broken teeth.",
        requiresTimer: true,
        timerThreshold: 300
      },
      {
        id: "s5",
        title: "Recovery Position",
        instruction: "Gently turn them on their side once shaking stops.",
        helperText: "This helps keep their airway clear and prevents choking on saliva.",
        requiresTimer: false
      }
    ]
  },
  bleeding: {
    title: "Severe Bleeding",
    subtitle: "Focus on applying pressure. You can stop this.",
    steps: [
      {
        id: "b1",
        title: "Apply direct pressure",
        instruction: "Use a clean cloth or your hands to push hard directly on the wound.",
        helperText: "If blood soaks through, add another cloth on top. Do not remove the first one.",
        requiresTimer: false
      },
      {
        id: "b2",
        title: "Maintain pressure for 10 minutes",
        instruction: "Keep pushing. Do not lift the cloth to check the wound.",
        helperText: "The timer will help you maintain pressure for the required duration.",
        requiresTimer: true,
        timerThreshold: 600
      }
    ]
  }
};

/**
 * REUSABLE COMPONENTS
 */

const ProgressIndicator = ({ current, total }: { current: number; total: number }) => (
  <div className="w-full mb-8 lg:mb-12">
    <div className="flex justify-between items-end mb-2">
      <span className="text-teal-700 font-bold uppercase tracking-widest text-xs lg:text-sm">
        Step {current} of {total}
      </span>
      <span className="text-slate-400 text-xs lg:text-sm font-medium">
        {Math.round((current / total) * 100)}% Complete
      </span>
    </div>
    <div className="w-full h-1.5 lg:h-2.5 bg-slate-100 rounded-full overflow-hidden">
      <div
        className="h-full bg-teal-600 transition-all duration-700 ease-in-out"
        style={{ width: `${(current / total) * 100}%` }}
      />
    </div>
  </div>
);

const TimerDisplay = ({ seconds, threshold, onThresholdExceeded }: { seconds: number; threshold?: number; onThresholdExceeded?: () => void }) => {
  const isOverThreshold = threshold ? seconds >= threshold : false;

  useEffect(() => {
    if (isOverThreshold && onThresholdExceeded) {
      onThresholdExceeded();
    }
  }, [isOverThreshold, onThresholdExceeded]);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`flex items-center gap-3 px-4 py-3 lg:px-6 lg:py-5 rounded-3xl transition-colors ${isOverThreshold ? 'bg-rose-50 text-rose-700 border border-rose-200 shadow-rose-100 shadow-inner' : 'bg-teal-50 text-teal-700 border border-teal-100 shadow-teal-100 shadow-inner'}`}>
      <Clock className={`w-5 h-5 lg:w-7 lg:h-7 ${isOverThreshold ? 'animate-pulse' : ''}`} />
      <span className="font-mono text-2xl lg:text-4xl font-black">{formatTime(seconds)}</span>
      {isOverThreshold && (
        <span className="text-[10px] lg:text-xs font-bold uppercase tracking-tighter leading-none ml-auto max-w-20 lg:max-w-30">
          Threshold Exceeded - Check Safety
        </span>
      )}
    </div>
  );
};

const EmergencyEscalationCard = () => (
  <div className="bg-rose-600 rounded-4xl lg:rounded-[3rem] p-6 lg:p-10 text-white shadow-2xl shadow-rose-200 animate-in fade-in zoom-in-95 duration-500 mt-6 lg:mt-10">
    <div className="flex items-start gap-4 lg:gap-6 mb-6">
      <div className="bg-white/20 p-3 lg:p-4 rounded-2xl">
        <AlertCircle className="w-6 h-6 lg:w-10 lg:h-10 text-white" />
      </div>
      <div>
        <h3 className="font-black text-lg lg:text-2xl leading-tight">Medical Emergency Identified</h3>
        <p className="text-rose-100 text-sm lg:text-lg font-medium opacity-90 mt-1">This situation requires immediate professional medical intervention.</p>
      </div>
    </div>
    <a
      href="tel:112"
      className="w-full bg-white text-rose-600 py-4 lg:py-6 rounded-2xl lg:rounded-3xl font-black text-xl lg:text-3xl flex items-center justify-center gap-4 active:scale-95 transition-all shadow-lg hover:bg-rose-50"
    >
      <Phone className="w-6 h-6 lg:w-8 lg:h-8 fill-current" /> Call 112 Now
    </a>
  </div>
);

const ActionControls = ({
  onNext,
  isLast,
  isFinished,
  onCantContinue
}: {
  onNext: () => void;
  isLast: boolean;
  isFinished: boolean;
  onCantContinue: () => void;
}) => (
  <div className="flex flex-col gap-4 mt-8 lg:mt-12">
    <div className="flex items-center gap-3 lg:gap-5">
      <button
        className="w-16 h-16 lg:w-20 lg:h-20 flex items-center justify-center rounded-2xl lg:rounded-3xl bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
        title="Speaker (Dummy TTS)"
      >
        <Volume2 className="w-6 h-6 lg:w-8 lg:h-8" />
      </button>

      <button
        onClick={onNext}
        className="flex-1 h-16 lg:h-20 bg-teal-700 text-white rounded-2xl lg:rounded-3xl font-black text-xl lg:text-2xl shadow-lg hover:bg-teal-800 active:scale-95 transition-all flex items-center justify-center gap-3"
      >
        {isFinished ? "Finish" : isLast ? "Done" : "Next Step"}
        <ChevronRight className="w-6 h-6 lg:w-8 lg:h-8" />
      </button>

      <button
        disabled
        className="w-16 h-16 lg:w-20 lg:h-20 flex flex-col items-center justify-center rounded-2xl lg:rounded-3xl bg-slate-50 text-slate-300 relative group"
      >
        <Mic className="w-5 h-5 lg:w-7 lg:h-7" />
        <span className="text-[8px] lg:text-[10px] font-bold mt-1 uppercase tracking-widest">SOON</span>
      </button>
    </div>

    {!isFinished && (
      <button
        onClick={onCantContinue}
        className="text-slate-400 text-sm lg:text-base font-bold uppercase tracking-widest hover:text-rose-500 transition-colors py-2"
      >
        I can&apos;t continue
      </button>
    )}
  </div>
);

const StepCard = ({
  title,
  instruction,
  helperText,
  type
}: {
  title: string;
  instruction: string;
  helperText: string;
  type: string;
}) => {
  const IconMap: Record<string, ReactNode> = {
    seizure: <Activity className="text-teal-600 w-8 h-8" />,
    bleeding: <Droplets className="text-rose-600 w-8 h-8" />,
    burns: <Flame className="text-orange-600 w-8 h-8" />,
    choking: <Wind className="text-blue-600 w-8 h-8" />,
  };

  return (
    <div className="flex flex-col animate-in fade-in slide-in-from-bottom-6 duration-700">
      <h2 className="text-3xl lg:text-5xl font-black text-slate-900 leading-tight mb-3 lg:mb-5">
        {title}
      </h2>
      <p className="text-lg lg:text-2xl text-slate-500 font-medium mb-6 lg:mb-10 leading-relaxed max-w-3xl">
        {instruction}
      </p>

      {/* Helper Box - Higher priority on desktop */}
      <div className="bg-slate-50 p-5 lg:p-8 rounded-2xl lg:rounded-4xl border border-slate-100 mb-6 lg:mb-10 order-2 lg:order-1">
        <div className="flex gap-3 lg:gap-5">
          <Info className="w-5 h-5 lg:w-8 lg:h-8 text-teal-600 shrink-0 mt-0.5" />
          <p className="text-sm lg:text-xl text-slate-600 font-medium leading-relaxed">
            {helperText}
          </p>
        </div>
      </div>

      {/* Illustration Box - Smaller and contained on desktop */}
      <div className="w-full lg:max-w-md aspect-video lg:aspect-auto lg:h-48 bg-slate-50 rounded-[2.5rem] mb-6 lg:mb-0 flex items-center justify-center border-2 border-dashed border-slate-200 relative overflow-hidden order-1 lg:order-2 self-start lg:mt-4">
        <div className="text-center z-10 px-4">
          <div className="bg-white w-12 h-12 lg:w-14 lg:h-14 rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-sm">
            {IconMap[type] || <Activity className="text-teal-600 w-6 h-6 lg:w-8 lg:h-8" />}
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Visual Guide</span>
        </div>
        <div className="absolute inset-0 bg-linear-to-tr from-teal-50/20 to-transparent" />
      </div>
    </div>
  );
};

const EmergencyLayout = ({
  children,
  onBack,
  title,
  subtitle
}: {
  children: ReactNode;
  onBack: () => void;
  title: string;
  subtitle: string;
}) => (
  <div className="min-h-screen bg-white font-sans text-slate-900 flex flex-col p-6 lg:p-12 max-w-screen-2xl mx-auto overflow-x-hidden">
    <header className="flex items-center gap-4 lg:gap-8 mb-8 lg:mb-16">
      <button
        onClick={onBack}
        className="p-3 lg:p-4 -ml-2 text-slate-400 hover:bg-slate-100 rounded-2xl transition-all hover:scale-105 active:scale-95"
      >
        <ArrowLeft className="w-6 h-6 lg:w-10 lg:h-10" />
      </button>
      <div>
        <div className="flex items-center gap-2 lg:gap-3">
          <Activity className="text-teal-700 w-4 h-4 lg:w-7 lg:h-7" />
          <span className="font-black text-teal-800 text-xs lg:text-xl uppercase tracking-tighter">
            {title} Assistance
          </span>
        </div>
        <p className="text-[10px] lg:text-base text-slate-400 font-bold uppercase tracking-widest opacity-80">{subtitle}</p>
      </div>
    </header>

    <div className="flex-1 flex flex-col">
      {children}
    </div>

    <footer className="mt-12 lg:mt-24 text-center py-6 border-t border-slate-50">
      <p className="text-[10px] lg:text-sm text-slate-300 font-bold uppercase tracking-widest leading-loose">
        EFAA Guidance — Nigeria&apos;s First Aid Companion — Stay Focused. Stay Calm.
      </p>
    </footer>
  </div>
);

/**
 * MAIN PAGE COMPONENT
 */
export default function EmergencyFlowPage({
  params
}: {
  params: Promise<{ condition: string }>
}) {
  const resolvedParams = use(params);
  const type = (resolvedParams.condition as keyof typeof EMERGENCY_CONTENT) || "seizure";

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [forceShowEscalation, setForceShowEscalation] = useState(false);
  const [timerExceeded, setTimerExceeded] = useState(false);

  const content = EMERGENCY_CONTENT[type];
  const activeStep = content.steps[currentStepIndex];

  // Timer Logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (!isFinished) {
      interval = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isFinished]);

  const handleNext = () => {
    if (currentStepIndex < content.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    } else {
      window.history.back();
    }
  };

  const onThresholdExceeded = () => {
    if (!timerExceeded) setTimerExceeded(true);
  };

  const showEscalation = timerExceeded || forceShowEscalation || isFinished;

  if (isFinished) {
    return (
      <EmergencyLayout onBack={() => setIsFinished(false)} title={content.title} subtitle={content.subtitle}>
        <div className="flex-1 flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-1000 max-w-4xl mx-auto">
          <div className="bg-teal-100 p-8 lg:p-14 rounded-[4rem] mb-10 shadow-inner">
            <ShieldCheck className="text-teal-700 w-20 h-20 lg:w-32 lg:h-32" />
          </div>
          <h2 className="text-4xl lg:text-7xl font-black text-slate-900 mb-6 tracking-tighter">Guidance Complete.</h2>
          <p className="text-lg lg:text-3xl text-slate-500 mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
            You did exactly what was needed. Stay with the person until they are fully alert or professional help arrives.
          </p>

          <div className="w-full max-w-2xl">
            <EmergencyEscalationCard />
          </div>

          <button
            onClick={() => window.location.href = '/'}
            className="mt-12 text-slate-400 font-bold uppercase tracking-widest flex items-center gap-3 hover:text-teal-700 transition-all hover:scale-105 mx-auto lg:text-xl py-4"
          >
            <RotateCcw className="w-5 h-5 lg:w-7 lg:h-7" /> Return to Dashboard
          </button>
        </div>
      </EmergencyLayout>
    );
  }

  return (
    <EmergencyLayout
      onBack={handleBack}
      title={content.title}
      subtitle={content.subtitle}
    >
      <div className="lg:grid lg:grid-cols-12 lg:gap-20 items-start">
        {/* Left Column: Instructions & Core Flow */}
        <div className="lg:col-span-7 xl:col-span-8">
          <ProgressIndicator
            current={currentStepIndex + 1}
            total={content.steps.length}
          />

          <StepCard
            title={activeStep.title}
            instruction={activeStep.instruction}
            helperText={activeStep.helperText}
            type={type}
          />

          {showEscalation && (
            <div className="hidden lg:block lg:mt-12">
              <EmergencyEscalationCard />
            </div>
          )}
        </div>

        {/* Right Column: Interaction, Timer, Actions */}
        <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-32">
          {activeStep.requiresTimer && (
            <div className="mb-6 lg:mb-10">
              <TimerDisplay
                seconds={elapsedSeconds}
                threshold={activeStep.timerThreshold}
                onThresholdExceeded={onThresholdExceeded}
              />
            </div>
          )}

          <ActionControls
            onNext={handleNext}
            isLast={currentStepIndex === content.steps.length - 1}
            isFinished={isFinished}
            onCantContinue={() => setForceShowEscalation(true)}
          />

          {showEscalation && (
            <div className="lg:hidden">
              <EmergencyEscalationCard />
            </div>
          )}
        </div>
      </div>
    </EmergencyLayout>
  );
}