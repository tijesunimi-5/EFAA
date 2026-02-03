"use client"
import { Activity, AlertTriangle, ArrowLeft, CheckCircle2, ChevronRight, Eye, Lightbulb, RotateCcw, ThumbsUp, XCircle } from "lucide-react";
import ProgressBar from "../UI/ProgressBar";
import Card from "../UI/Card";
import { useMemo, useState } from "react";
import { LearningContent } from "@/types";
import TButton from "../UI/TButton";

const LEARNING_DATA: Record<string, LearningContent> = {
  seizure: {
    id: 'seizure',
    title: "Seizure",
    subtitle: "Learn calmly. No pressure.",
    icon: <Activity className="w-6 h-6 text-teal-600" />,
    sections: [
      {
        title: "What it looks like",
        type: 'observation',
        content: "A person might fall down, stiffen, or experience rhythmic shaking. Their eyes might roll back, and they may not respond to their name.",
        mediaLabel: "Illustration: Recognizing seizure signs"
      },
      {
        title: "What NOT to do",
        type: 'dont',
        content: "Never restrain the person or put objects in their mouth. They cannot swallow their tongue, and forcing a spoon in can break teeth.",
        mediaLabel: "Animation: Common mistakes to avoid"
      },
      {
        title: "What to do",
        type: 'do',
        content: "Clear the area of sharp objects. Cushion their head. Once shaking stops, turn them on their side to keep the airway clear.",
        mediaLabel: "Video: The recovery position"
      }
    ],
    questions: [
      {
        id: "q1",
        text: "Should you restrain someone during a seizure to stop them from shaking?",
        options: ["Yes", "No"],
        correctIndex: 1,
        explanation: "Restraining can cause bone or muscle injuries. It's safer to let the seizure run its course."
      },
      {
        id: "q2",
        text: "Is it important to time the seizure duration?",
        options: ["Yes", "No"],
        correctIndex: 0,
        explanation: "Timing is critical. If a seizure lasts longer than 5 minutes, it is a medical emergency."
      },
      {
        id: "q3",
        text: "Can a person swallow their tongue during a seizure?",
        options: ["Yes", "No"],
        correctIndex: 1,
        explanation: "It is physically impossible to swallow the tongue. Never put anything in their mouth."
      }
    ]
  }
};

const LearnCondition = ({ conditionId, onBack }: { conditionId: string, onBack: () => void }) => {
  const content = LEARNING_DATA[conditionId];
  const [currentStep, setCurrentStep] = useState(0); // 0-2: Reading, 3-5: Quiz, 6: Feedback
  const [answers, setAnswers] = useState<number[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);

  const totalReadingSteps = content.sections.length;
  const totalQuizSteps = content.questions.length;
  const totalSteps = totalReadingSteps + totalQuizSteps;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
      setShowExplanation(false);
    }
  };

  const handleBack = () => {
    if (currentStep === 0) onBack();
    else {
      setCurrentStep(prev => prev - 1);
      setShowExplanation(false);
    }
  };

  const submitAnswer = (index: number) => {
    setAnswers([...answers, index]);
    setShowExplanation(true);
  };

  const score = useMemo(() => {
    return answers.reduce((acc, val, idx) => {
      return val === content.questions[idx].correctIndex ? acc + 1 : acc;
    }, 0);
  }, [answers, content.questions]);

  // View logic
  if (!content) return <div>Condition not found.</div>;

  const isReading = currentStep < totalReadingSteps;
  const isQuiz = currentStep >= totalReadingSteps && currentStep < totalSteps;
  const isFeedback = currentStep === totalSteps;

  return (
    <div className="flex flex-col min-h-full max-w-2xl mx-auto">
      <header className="flex items-center justify-between mb-8 sticky top-0 bg-white/80 backdrop-blur-md py-4 z-10">
        <button onClick={handleBack} className="p-2 -ml-2 text-slate-400 hover:text-teal-700 transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex-1 px-6">
          <ProgressBar current={currentStep + 1} total={totalSteps + 1} />
        </div>
        <div className="w-10" /> {/* Spacer */}
      </header>

      {/* SECTION A: LEARNING CONTENT */}
      {isReading && (
        <div className="animate-in fade-in slide-in-from-right-4 duration-500 flex-1 flex flex-col">
          <div className="mb-6">
            <span className="bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-4 inline-block">
              Part 1: Reading
            </span>
            <h2 className="text-3xl font-black text-slate-900 mb-2">{content.title}</h2>
            <p className="text-slate-500 font-medium uppercase text-xs tracking-widest">{content.subtitle}</p>
          </div>

          <Card className="mb-8 border-none bg-slate-50 overflow-hidden min-h-40 flex items-center justify-center">
            <div className="text-center p-8 opacity-40">
              <div className="bg-white w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm">
                {content.sections[currentStep].type === 'observation' && <Eye className="w-7 h-7 text-teal-600" />}
                {content.sections[currentStep].type === 'dont' && <AlertTriangle className="w-7 h-7 text-orange-500" />}
                {content.sections[currentStep].type === 'do' && <CheckCircle2 className="w-7 h-7 text-green-500" />}
              </div>
              <p className="font-bold text-xs uppercase tracking-widest">{content.sections[currentStep].mediaLabel}</p>
            </div>
          </Card>

          <div className="flex-1">
            <h3 className="text-2xl font-bold text-slate-800 mb-4">{content.sections[currentStep].title}</h3>
            <p className="text-xl text-slate-600 leading-relaxed font-medium mb-10">
              {content.sections[currentStep].content}
            </p>
          </div>

          <TButton onClick={handleNext} className="mt-auto">
            Next Section <ChevronRight className="w-5 h-5" />
          </TButton>
        </div>
      )}

      {/* SECTION B: PRACTICE QUIZ */}
      {isQuiz && (
        <div className="animate-in fade-in slide-in-from-right-4 duration-500 flex-1 flex flex-col">
          <div className="mb-8">
            <span className="bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-4 inline-block">
              Part 2: Quick Practice
            </span>
            <h2 className="text-2xl font-bold text-slate-800">Knowledge Check</h2>
          </div>

          <p className="text-2xl font-black text-slate-900 mb-10 leading-tight">
            {content.questions[currentStep - totalReadingSteps].text}
          </p>

          <div className="grid gap-4 mb-8">
            {content.questions[currentStep - totalReadingSteps].options.map((opt, idx) => {
              const questionIdx = currentStep - totalReadingSteps;
              const isAnswered = answers[questionIdx] !== undefined;
              const isCorrect = idx === content.questions[questionIdx].correctIndex;
              const isSelected = answers[questionIdx] === idx;

              return (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => submitAnswer(idx)}
                  className={`p-6 rounded-4xl text-left text-xl font-bold transition-all border-2 
                    ${!isAnswered ? 'bg-white border-slate-100 hover:border-teal-500 hover:bg-teal-50/30' : ''}
                    ${isAnswered && isCorrect ? 'bg-green-50 border-green-500 text-green-700' : ''}
                    ${isAnswered && isSelected && !isCorrect ? 'bg-rose-50 border-rose-500 text-rose-700' : ''}
                    ${isAnswered && !isSelected && !isCorrect ? 'opacity-40 border-slate-100 bg-slate-50' : ''}
                  `}
                >
                  <div className="flex justify-between items-center">
                    {opt}
                    {isAnswered && isCorrect && <CheckCircle2 className="w-6 h-6" />}
                    {isAnswered && isSelected && !isCorrect && <XCircle className="w-6 h-6" />}
                  </div>
                </button>
              );
            })}
          </div>

          {showExplanation && (
            <div className="bg-teal-50 p-6 rounded-3xl mb-8 animate-in zoom-in-95 duration-300">
              <div className="flex gap-3 text-teal-800">
                <Lightbulb className="w-6 h-6 shrink-0" />
                <p className="font-bold leading-snug">
                  {answers[currentStep - totalReadingSteps] === content.questions[currentStep - totalReadingSteps].correctIndex ? "Good call! " : "Here's the safer option: "}
                  <span className="font-medium">{content.questions[currentStep - totalReadingSteps].explanation}</span>
                </p>
              </div>
            </div>
          )}

          <TButton
            disabled={!showExplanation}
            onClick={handleNext}
            className="mt-auto"
          >
            {currentStep === totalSteps - 1 ? "See Results" : "Continue"}
          </TButton>
        </div>
      )}

      {/* SECTION C: FEEDBACK */}
      {isFeedback && (
        <div className="animate-in zoom-in-95 duration-700 flex-1 flex flex-col items-center text-center justify-center">
          <div className="bg-teal-50 p-8 rounded-[4rem] mb-8 shadow-inner">
            <ThumbsUp className="w-16 h-16 text-teal-600" />
          </div>

          <h2 className="text-4xl font-black text-slate-900 mb-2">Practice Complete</h2>
          <p className="text-xl text-slate-500 font-medium mb-10">
            You got <span className="text-teal-700 font-black">{score} out of {totalQuizSteps}</span> correct.
          </p>

          <Card className="mb-12 border-none bg-teal-900 p-8 text-white max-w-sm">
            <p className="text-lg font-bold leading-relaxed">
              This is enough to act correctly in real life. You have the tools to save a life today.
            </p>
          </Card>

          <div className="w-full space-y-4">
            <TButton variant="primary" onClick={onBack} className="w-full py-5 text-xl">
              Back to Library
            </TButton>
            <TButton variant="ghost" onClick={() => setCurrentStep(0)} className="w-full">
              <RotateCcw className="w-4 h-4" /> Restart Lesson
            </TButton>
          </div>
        </div>
      )}
    </div>
  );
};

export default LearnCondition;