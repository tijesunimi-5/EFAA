"use client";

import React, { useEffect, useState, use } from 'react';
import { ShieldCheck, RotateCcw } from 'lucide-react';
import { useAPI } from '@/components/hook/callApi';
import { useEmergencyEngine, ProtocolData } from '@/components/hook/useEmergencyEngine';

// Components
import EmergencyLayout from '@/components/emergency/EmergencyLayout';
import ObservationQuestions from '@/components/emergency/ObservationQuestions';
import StepCard from '@/components/emergency/StepCard';
import ActionControls from '@/components/emergency/ActionControls';
import TimerDisplay from '@/components/emergency/TimerDisplay';
import EmergencyEscalationCard from '@/components/emergency/EscalationCard';

export default function DynamicEmergencyPage({ params }: { params: Promise<{ condition: string }> }) {
  const { condition } = use(params);
  const { callApi } = useAPI();
  const [protocol, setProtocol] = useState<ProtocolData | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize the Engine - removed 'restart' as it was unused
  const {
    currentNode,
    isFinished,
    elapsedSeconds,
    goToNode,
    goBack // Added to handle the back button in the header
  } = useEmergencyEngine(protocol);

  useEffect(() => {
    const loadProtocol = async () => {
      try {
        const res = await callApi<{ data: ProtocolData }>(`/protocols/${condition}`, 'GET');
        if (res.success) setProtocol(res.data);
      } finally {
        setLoading(false);
      }
    };
    loadProtocol();
  }, [condition, callApi]);

  if (loading) return <FullScreenLoader />;
  if (!protocol || !currentNode) return <ErrorState />;

  // Finish Screen
  if (isFinished) {
    return (
      <EmergencyLayout
        title={protocol.title}
        subtitle="Guidance Complete"
        onBack={() => window.location.href = '/home'} // Required prop fixed
      >
        <div className="flex-1 flex flex-col items-center justify-center text-center max-w-4xl mx-auto px-6">
          <div className="bg-teal-100 p-10 rounded-[3rem] mb-8">
            <ShieldCheck className="text-teal-700 w-20 h-20" />
          </div>
          <h2 className="text-4xl font-black text-slate-900 mb-4 uppercase">You did great.</h2>
          <p className="text-xl text-slate-500 mb-10">Stay with the person until help arrives.</p>
          <EmergencyEscalationCard />
          <button onClick={() => window.location.href = '/home'} className="mt-12 flex items-center gap-2 text-slate-400 font-bold uppercase tracking-widest">
            <RotateCcw className="w-5 h-5" /> Home
          </button>
        </div>
      </EmergencyLayout>
    );
  }

  // Active Emergency Screen
  return (
    <EmergencyLayout
      title={protocol.title}
      subtitle="Follow carefully"
      onBack={() => {
        // Uses the engine's back logic; if at start, goes back to emergency list
        if (!goBack()) window.history.back();
      }} // Required prop fixed
    >
      <div className="max-w-4xl mx-auto w-full px-6 space-y-8">
        {currentNode.type === 'question' ? (
          <ObservationQuestions
            title={currentNode.title}
            text={currentNode.text || ""}
            options={currentNode.options || []}
            onAnswer={goToNode}
          />
        ) : (
          <>
            <StepCard
              title={currentNode.title}
              instruction={currentNode.steps?.[0]?.text || ""}
              helperText="Initiate this action immediately."
              type={condition}
            />
            <TimerDisplay seconds={elapsedSeconds} />
            <ActionControls
              onNext={() => goToNode('end')}
              isLast={true}
              onCantContinue={() => { }}
            />
          </>
        )}
      </div>
    </EmergencyLayout>
  );
}

const FullScreenLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-white">
    <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const ErrorState = () => (
  <div className="p-20 text-center">
    <h2 className="text-2xl font-bold">Protocol unavailable.</h2>
    <button onClick={() => window.history.back()} className="text-teal-600 font-bold underline">Go Back</button>
  </div>
);