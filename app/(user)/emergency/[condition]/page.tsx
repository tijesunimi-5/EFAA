"use client";

import React, { useState, useEffect, use } from 'react';
import { ShieldCheck, RotateCcw } from 'lucide-react';
import { useAPI } from '@/components/hook/callApi';

// Component Imports
import EmergencyLayout from '@/components/emergency/EmergencyLayout';
import ObservationQuestions from '@/components/emergency/ObservationQuestions';
import StepCard from '@/components/emergency/StepCard';
import ActionControls from '@/components/emergency/ActionControls';
import ProgressIndicator from '@/components/emergency/ProgressIndicator';
import TimerDisplay from '@/components/emergency/TimerDisplay';
import EmergencyEscalationCard from '@/components/emergency/EscalationCard';

interface ProtocolNode {
  id: string;
  type: 'question' | 'guide';
  title: string;
  text?: string;
  options?: { label: string; next: string }[];
  steps?: { text: string; voice: string; autoNext: number }[];
}

interface ProtocolData {
  title: string;
  nodes: Record<string, ProtocolNode>;
}

export default function DynamicEmergencyPage({ params }: { params: Promise<{ condition: string }> }) {
  const { condition } = use(params);
  const { callApi } = useAPI();

  const [protocol, setProtocol] = useState<ProtocolData | null>(null);
  const [currentNodeId, setCurrentNodeId] = useState<string>('start');
  const [isFinished, setIsFinished] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProtocol = async () => {
      try {
        const res = await callApi<{ data: ProtocolData }>(`/protocols/${condition}`, 'GET');
        if (res.success && res.data) {
          setProtocol(res.data);
        }
      } catch (err) {
        console.error("Failed to load clinical protocol", err);
      } finally {
        setLoading(false);
      }
    };
    loadProtocol();
  }, [condition, callApi]);

  // Timer Logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (!isFinished && !loading) {
      interval = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isFinished, loading]);

  const currentNode = protocol?.nodes[currentNodeId];

  const handleAnswer = (nextId: string) => {
    if (!nextId || nextId === 'end') {
      setIsFinished(true);
    } else {
      setCurrentNodeId(nextId);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="font-black text-teal-800 uppercase tracking-widest">Fetching Clinical Guide...</p>
      </div>
    </div>
  );

  if (!protocol || !currentNode) return (
    <div className="p-20 text-center">
      <h2 className="text-2xl font-bold text-slate-800">Protocol not found</h2>
      <button onClick={() => window.history.back()} className="mt-4 text-teal-600 font-bold">Return to home</button>
    </div>
  );

  if (isFinished) {
    return (
      <EmergencyLayout onBack={() => setIsFinished(false)} title={protocol.title} subtitle="Stay Calm">
        <div className="flex-1 flex flex-col items-center justify-center text-center max-w-4xl mx-auto px-6">
          <div className="bg-teal-100 p-10 rounded-[3rem] mb-8">
            <ShieldCheck className="text-teal-700 w-20 h-20" />
          </div>
          <h2 className="text-4xl font-black text-slate-900 mb-4 uppercase">Guidance Complete.</h2>
          <p className="text-xl text-slate-500 mb-10 font-medium">Professional help is on the way. Stay with the person and speak calmly.</p>
          <EmergencyEscalationCard />
          <button
            onClick={() => window.location.href = '/home'}
            className="mt-12 text-slate-400 font-bold uppercase tracking-widest flex items-center gap-3 hover:text-teal-700 transition-all"
          >
            <RotateCcw className="w-5 h-5" /> Return to Home
          </button>
        </div>
      </EmergencyLayout>
    );
  }

  return (
    <EmergencyLayout
      onBack={() => window.history.back()}
      title={protocol.title}
      subtitle="Follow the steps below"
    >
      <div className="max-w-4xl mx-auto w-full px-6">
        {currentNode.type === 'question' ? (
          <ObservationQuestions
            title={currentNode.title}
            text={currentNode.text || ""}
            options={currentNode.options || []}
            onAnswer={handleAnswer}
          />
        ) : (
          <div className="space-y-8">
            <ProgressIndicator current={1} total={1} />
            <StepCard
              title={currentNode.title}
              instruction={currentNode.steps?.[0]?.text || ""}
              helperText="Initiate this action immediately."
              type={condition}
            />
            <div className="mt-6">
              <TimerDisplay seconds={elapsedSeconds} />
            </div>
            <ActionControls
              onNext={() => setIsFinished(true)}
              isLast={true}
              isFinished={false}
              onCantContinue={() => { }}
            />
          </div>
        )}
      </div>
    </EmergencyLayout>
  );
}