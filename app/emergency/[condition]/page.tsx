"use client";

import React, { useState, ReactNode, use, useEffect, useCallback } from 'react';
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
  Info,
  Check,
  X
} from 'lucide-react';

/**
 * TYPES & DATA STRUCTURE
 */
interface ObservationQuestion {
  id: string;
  text: string;
  yesLabel?: string;
  noLabel?: string;
}

interface EmergencyStep {
  id: string;
  title: string;
  instruction: string;
  helperText: string;
  requiresTimer: boolean;
  timerThreshold?: number;
  mediaPlaceholder?: 'video' | 'gif' | 'illustration';
}

interface EmergencyContent {
  title: string;
  subtitle: string;
  questions?: ObservationQuestion[];
  steps: EmergencyStep[];
}

const EMERGENCY_CONTENT: Record<string, EmergencyContent> = {
  seizure: {
    title: "Seizure",
    subtitle: "Take a deep breath. We are here with you.",
    questions: [
      { id: "q1", text: "Is the body shaking or STIFF?", yesLabel: "SHAKING", noLabel: "STIFF" },
      { id: "q2", text: "Are the eyes rolled back or fixed?", yesLabel: "ROLLED BACK", noLabel: "NORMAL" },
      { id: "q3", text: "Is there foam or saliva from the mouth?", yesLabel: "FOAMING", noLabel: "CLEAR" },
      { id: "q4", text: "Did the person suddenly fall or stiffen?", yesLabel: "FELL DOWN", noLabel: "STILL UPRIGHT" },
    ],
    steps: [
      {
        id: "s1",
        title: "Stay calm and ensure safety",
        instruction: "Take a deep breath. Look at the person and ensure they are not in immediate danger.",
        helperText: "Clear the space around them. Ensure they won't hit their head on anything hard.",
        requiresTimer: false,
        mediaPlaceholder: 'illustration'
      },
      {
        id: "s2",
        title: "Track the duration",
        instruction: "It is important to know how long the seizure lasts.",
        helperText: "The timer below has started automatically. If shaking exceeds 5 mins, call 112.",
        requiresTimer: true,
        timerThreshold: 300,
        mediaPlaceholder: 'video'
      },
      {
        id: "s3",
        title: "Do NOT restrain them",
        instruction: "Do not hold them down or try to stop their movements.",
        helperText: "Restraining can cause injury. Let the seizure run its course naturally.",
        requiresTimer: true,
        timerThreshold: 300,
        mediaPlaceholder: 'gif'
      },
      {
        id: "s4",
        title: "Nothing in the mouth",
        instruction: "NEVER put anything in their mouth.",
        helperText: "They will not swallow their tongue. Objects cause choking or broken teeth.",
        requiresTimer: true,
        timerThreshold: 300,
        mediaPlaceholder: 'illustration'
      },
      {
        id: "s5",
        title: "Recovery Position",
        instruction: "Gently turn them on their side once shaking stops.",
        helperText: "This helps keep their airway clear and prevents choking on saliva.",
        requiresTimer: false,
        mediaPlaceholder: 'video'
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
        requiresTimer: false,
        mediaPlaceholder: 'illustration'
      },
      {
        id: "b2",
        title: "Maintain pressure for 10 minutes",
        instruction: "Keep pushing. Do not lift the cloth to check the wound.",
        helperText: "The timer will help you maintain pressure for the required duration.",
        requiresTimer: true,
        timerThreshold: 600,
        mediaPlaceholder: 'video'
      }
    ]
  }
};

/**
 * REUSABLE COMPONENTS
 */

const ObservationQuestions = ({
  questions,
  onComplete,
  onQuestionChange
}: {
  questions: ObservationQuestion[],
  onComplete: () => void,
  onQuestionChange?: (text: string) => void
}) => {
  const [currentQ, setCurrentQ] = useState(0);

  useEffect(() => {
    if (onQuestionChange && questions[currentQ]) {
      onQuestionChange(questions[currentQ].text);
    }
  }, [currentQ, questions, onQuestionChange]);

  const handleAnswer = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      onComplete();
    }
  };

  const currentQuestion = questions[currentQ];
  if (!currentQuestion) return null;

  return (
    <div className="flex-1 flex flex-col justify-center animate-in fade-in slide-in-from-bottom-8 duration-700 max-w-4xl mx-auto w-full">
      <div className="mb-8">
        <h2 className="text-3xl lg:text-5xl font-black text-slate-900 leading-tight mb-4 uppercase text-balance">
          Quick Observation
        </h2>
        <p className="text-lg lg:text-xl text-slate-500 font-medium">
          Choose the option that best matches what you see.
        </p>
      </div>

      <div className="bg-white rounded-4xl p-8 lg:p-12 shadow-xl border border-slate-100 mb-8">
        <p className="text-2xl lg:text-4xl font-bold text-slate-800 leading-snug mb-10">
          {currentQuestion.text}
        </p>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={handleAnswer}
            className="h-24 rounded-3xl bg-teal-50 text-teal-700 border-2 border-teal-100 flex flex-col items-center justify-center gap-1 text-xl font-bold hover:bg-teal-100 transition-colors uppercase tracking-tight active:scale-95"
          >
            <Check className="w-6 h-6" /> {currentQuestion.yesLabel || "YES"}
          </button>
          <button
            onClick={handleAnswer}
            className="h-24 rounded-3xl bg-slate-50 text-slate-600 border-2 border-slate-100 flex flex-col items-center justify-center gap-1 text-xl font-bold hover:bg-slate-100 transition-colors uppercase tracking-tight active:scale-95"
          >
            <X className="w-6 h-6" /> {currentQuestion.noLabel || "NO"}
          </button>
        </div>
      </div>
      <button
        onClick={onComplete}
        className="text-slate-400 font-bold uppercase tracking-widest text-sm hover:text-teal-600 transition-colors"
      >
        Skip observations
      </button>
    </div>
  );
};

const ProgressIndicator = ({ current, total, autoAdvance }: { current: number; total: number; autoAdvance?: boolean }) => (
  <div className="w-full mb-8 lg:mb-12">
    <div className="flex justify-between items-end mb-2">
      <span className="text-teal-700 font-bold uppercase tracking-widest text-xs lg:text-sm flex items-center gap-2">
        Step {current} of {total}
        {autoAdvance && <span className="lowercase text-slate-400 font-medium">(Auto-advancing soon...)</span>}
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
    <div className={`flex items-center gap-3 px-4 py-3 lg:px-6 lg:py-5 rounded-3xl transition-colors ${isOverThreshold ? 'bg-rose-50 text-rose-700 border border-rose-200 shadow-inner' : 'bg-teal-50 text-teal-700 border border-teal-100 shadow-inner'}`}>
      <Clock className={`w-5 h-5 lg:w-7 lg:h-7 ${isOverThreshold ? 'animate-pulse' : ''}`} />
      <span className="font-mono text-2xl lg:text-4xl font-black">{formatTime(seconds)}</span>
      {isOverThreshold && (
        <span className="text-[10px] lg:text-xs font-bold uppercase tracking-tighter leading-none ml-auto max-w-20 lg:max-w-30">
          Safety Alert: Call 112
        </span>
      )}
    </div>
  );
};

const EmergencyEscalationCard = () => (
  <div className="bg-rose-600 rounded-4xl lg:p-10 p-6 text-white shadow-2xl shadow-rose-200 animate-in fade-in zoom-in-95 duration-500 mt-6 lg:mt-10">
    <div className="flex items-start gap-4 lg:gap-6 mb-6">
      <div className="bg-white/20 p-3 lg:p-4 rounded-2xl">
        <AlertCircle className="w-6 h-6 lg:w-10 lg:h-10 text-white" />
      </div>
      <div>
        <h3 className="font-black text-lg lg:text-2xl leading-tight uppercase">Medical Emergency</h3>
        <p className="text-rose-100 text-sm lg:text-lg font-medium opacity-90 mt-1 text-balance">Status requires professional intervention immediately.</p>
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
}) => {
  return (
    <div className="flex flex-col gap-4 mt-8 lg:mt-12">
      <div className="flex items-center gap-3 lg:gap-5">
        <button
          onClick={onNext}
          className="flex-1 h-20 bg-teal-700 text-white rounded-3xl font-black text-xl lg:text-2xl shadow-lg hover:bg-teal-800 active:scale-95 transition-all flex items-center justify-center gap-3"
        >
          {isFinished ? "Finish" : isLast ? "Done" : "Next Step"}
          <ChevronRight className="w-6 h-6 lg:w-8 lg:h-8" />
        </button>

        <div className="relative group">
          <button
            disabled
            className="w-20 h-20 flex flex-col items-center justify-center rounded-3xl bg-slate-50 text-slate-300 transition-colors"
          >
            <Mic className="w-6 h-6" />
            <span className="text-[8px] lg:text-[10px] font-bold mt-1 uppercase tracking-widest">SOON</span>
          </button>
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-2 bg-slate-800 text-white text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            Live voice support coming soon
          </div>
        </div>
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
};

const StepCard = ({
  title,
  instruction,
  helperText,
  type,
  mediaType
}: {
  title: string;
  instruction: string;
  helperText: string;
  type: string;
  mediaType?: string;
}) => {
  const IconMap: Record<string, ReactNode> = {
    seizure: <Activity className="text-teal-600 w-8 h-8" />,
    bleeding: <Droplets className="text-rose-600 w-8 h-8" />,
    burns: <Flame className="text-orange-600 w-8 h-8" />,
    choking: <Wind className="text-blue-600 w-8 h-8" />,
  };

  return (
    <div className="flex flex-col animate-in fade-in slide-in-from-bottom-6 duration-700">
      <h2 className="text-3xl lg:text-5xl font-black text-slate-900 leading-tight mb-3 lg:mb-5 uppercase text-balance">
        {title}
      </h2>
      <p className="text-lg lg:text-2xl text-slate-500 font-medium mb-6 lg:mb-10 leading-relaxed max-w-3xl">
        {instruction}
      </p>

      <div className="bg-slate-50 p-5 lg:p-8 rounded-2xl lg:rounded-4xl border border-slate-100 mb-6 lg:mb-10 order-2 lg:order-1">
        <div className="flex gap-3 lg:gap-5">
          <Info className="w-5 h-5 lg:w-8 lg:h-8 text-teal-600 shrink-0 mt-0.5" />
          <p className="text-sm lg:text-xl text-slate-600 font-medium leading-relaxed">
            {helperText}
          </p>
        </div>
      </div>

      <div className="w-full lg:max-w-md aspect-video lg:aspect-auto lg:h-48 bg-slate-50 rounded-[2.5rem] mb-6 lg:mb-0 flex items-center justify-center border-2 border-dashed border-slate-200 relative overflow-hidden order-1 lg:order-2 self-start lg:mt-4 transition-all hover:border-teal-200">
        <div className="text-center z-10 px-4">
          <div className="bg-white w-12 h-12 lg:w-14 lg:h-14 rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-sm">
            {IconMap[type] || <Activity className="text-teal-600 w-6 h-6 lg:w-8 lg:h-8" />}
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            {mediaType === 'video' ? 'Video Demonstration' : mediaType === 'gif' ? 'Action Loop' : 'Visual Guide'}
          </span>
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
  subtitle,
  headerRight
}: {
  children: ReactNode;
  onBack: () => void;
  title: string;
  subtitle: string;
  headerRight?: ReactNode;
}) => (
  <div className="min-h-screen bg-white font-sans text-slate-900 flex flex-col p-6 lg:p-12 max-w-screen-2xl mx-auto overflow-x-hidden">
    <header className="flex items-center justify-between gap-4 lg:gap-8 mb-8 lg:mb-16 sticky top-0 bg-white/90 backdrop-blur-md z-50 py-4 border-b border-slate-50">
      <div className="flex items-center gap-4 lg:gap-8">
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
      </div>

      {headerRight && <div>{headerRight}</div>}
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

  const content = EMERGENCY_CONTENT[type] || EMERGENCY_CONTENT.seizure;
  const hasQuestions = content.questions && content.questions.length > 0;

  const [phase, setPhase] = useState<'observations' | 'guidance'>(() => 
    hasQuestions ? 'observations' : 'guidance'
  );
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [forceShowEscalation, setForceShowEscalation] = useState(false);
  const [timerExceeded, setTimerExceeded] = useState(false);

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [shouldAutoRead, setShouldAutoRead] = useState(false);
  const [autoAdvanceSeconds, setAutoAdvanceSeconds] = useState(0);

  // Safety check: calculate activeStep with fallback to avoid "undefined" errors during transitions
  const activeStep = content.steps[currentStepIndex] || content.steps[0];

  // Helper: Trigger TTS for specific text
  const speakText = useCallback((text: string) => {
    if (typeof window === 'undefined') return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, []);

  // Effect: Auto-read guidance when step changes
  useEffect(() => {
    if (shouldAutoRead && phase === 'guidance' && !isFinished && activeStep) {
      speakText(`${activeStep.title}. ${activeStep.instruction}. ${activeStep.helperText}`);
    }
  }, [currentStepIndex, phase, isFinished, shouldAutoRead, activeStep, speakText]);

  const handleNext = useCallback(() => {
    setAutoAdvanceSeconds(0);
    if (currentStepIndex < content.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      if (typeof window !== 'undefined') window.speechSynthesis.cancel();
      setShouldAutoRead(false);
      setIsFinished(true);
    }
  }, [content.steps.length, currentStepIndex]);

  const handleBack = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
      setAutoAdvanceSeconds(0);
    } else {
      if (typeof window !== 'undefined') window.speechSynthesis.cancel();
      setShouldAutoRead(false);
      window.history.back();
    }
  }, [currentStepIndex]);


  // Main Timer Logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (!isFinished && phase === 'guidance') {
      interval = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isFinished, phase]);

  // Auto-Progression Logic (20 second rule for idle steps with timers)
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    // Safe-check requiresTimer via optional chaining to prevent TypeError
    if (phase === 'guidance' && !isFinished && activeStep?.requiresTimer) {
      interval = setInterval(() => {
        setAutoAdvanceSeconds(prev => {
          if (prev >= 20) {
            handleNext();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [phase, isFinished, activeStep?.requiresTimer, handleNext]);

  // TTS Toggle Logic
  const toggleSpeech = () => {
    if (typeof window === 'undefined') return;

    if (shouldAutoRead) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setShouldAutoRead(false);
    } else {
      setShouldAutoRead(true);
      // Start reading immediately based on current content
      const textToSpeak = phase === 'guidance'
        ? `${activeStep?.title || ""}. ${activeStep?.instruction || ""}. ${activeStep?.helperText || ""}`
        : (content.questions?.[0]?.text || "Observe the patient carefully.");
      speakText(textToSpeak);
    }
  };

  const onThresholdExceeded = () => {
    if (!timerExceeded) setTimerExceeded(true);
  };

  const showEscalation = timerExceeded || forceShowEscalation || isFinished;

  const SpeakerButton = (
    <button
      onClick={toggleSpeech}
      className={`w-12 h-12 lg:w-16 lg:h-16 flex items-center justify-center rounded-2xl transition-all shadow-sm active:scale-90 ${shouldAutoRead ? 'bg-teal-600 text-white animate-pulse' : 'bg-teal-50 text-teal-600 hover:bg-teal-100'}`}
      title={shouldAutoRead ? "Turn off Auto-read" : "Turn on Auto-read"}
    >
      <Volume2 className="w-6 h-6 lg:w-8 lg:h-8" />
    </button>
  );

  // --- RENDERING ---

  if (phase === 'observations' && content.questions) {
    return (
      <EmergencyLayout
        onBack={() => window.history.back()}
        title={content.title}
        subtitle="Observe carefully"
        headerRight={SpeakerButton}
      >
        <ObservationQuestions
          questions={content.questions}
          onQuestionChange={(text) => {
            if (shouldAutoRead) speakText(text);
          }}
          onComplete={() => {
            if (typeof window !== 'undefined' && shouldAutoRead) window.speechSynthesis.cancel();
            setPhase('guidance');
          }}
        />
      </EmergencyLayout>
    );
  }

  if (isFinished) {
    return (
      <EmergencyLayout onBack={() => setIsFinished(false)} title={content.title} subtitle={content.subtitle}>
        <div className="flex-1 flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-1000 max-w-4xl mx-auto">
          <div className="bg-teal-100 p-8 lg:p-14 rounded-[4rem] mb-10 shadow-inner">
            <ShieldCheck className="text-teal-700 w-20 h-20 lg:w-32 lg:h-32" />
          </div>
          <h2 className="text-4xl lg:text-7xl font-black text-slate-900 mb-6 tracking-tighter uppercase">Guidance Complete.</h2>
          <p className="text-lg lg:text-3xl text-slate-500 mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
            You acted decisively. Stay with the person until help arrives. Speak calmly to them.
          </p>

          <div className="w-full max-w-2xl">
            <EmergencyEscalationCard />
          </div>

          <button
            onClick={() => window.location.href = '/dashboard'}
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
      headerRight={SpeakerButton}
    >
      <div className="lg:grid lg:grid-cols-12 lg:gap-20 items-start">
        {/* Left Column: Instructions & Core Flow */}
        <div className="lg:col-span-7 xl:col-span-8">
          <ProgressIndicator
            current={currentStepIndex + 1}
            total={content.steps.length}
            autoAdvance={activeStep?.requiresTimer && autoAdvanceSeconds > 15}
          />

          <StepCard
            title={activeStep?.title || ""}
            instruction={activeStep?.instruction || ""}
            helperText={activeStep?.helperText || ""}
            type={type}
            mediaType={activeStep?.mediaPlaceholder}
          />

          {showEscalation && (
            <div className="hidden lg:block lg:mt-12">
              <EmergencyEscalationCard />
            </div>
          )}
        </div>

        {/* Right Column: Interaction, Timer, Actions */}
        <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-32">
          {activeStep?.requiresTimer && (
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