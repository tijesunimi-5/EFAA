"use client";

import { useState, useEffect, useCallback } from 'react';

export type ProtocolNodeType = 'question' | 'guide';

export interface ProtocolNode {
  id: string;
  type: ProtocolNodeType;
  title: string;
  text?: string;
  options?: { label: string; next: string }[];
  steps?: { text: string; voice: string; autoNext: number }[];
}

export interface ProtocolData {
  title: string;
  nodes: Record<string, ProtocolNode>;
}

export function useEmergencyEngine(protocol: ProtocolData | null) {
  const [currentNodeId, setCurrentNodeId] = useState<string>('start');
  const [isFinished, setIsFinished] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [history, setHistory] = useState<string[]>([]);

  // Timer: Essential for high-stress tracking (e.g., seizure duration)
  useEffect(() => {
    if (isFinished || !protocol) return;
    const interval = setInterval(() => setElapsedSeconds(s => s + 1), 1000);
    return () => clearInterval(interval);
  }, [isFinished, protocol]);

  const currentNode = protocol?.nodes[currentNodeId] || null;

  const goToNode = useCallback((nextId: string) => {
    if (!nextId || nextId === 'end') {
      setIsFinished(true);
    } else {
      setHistory(prev => [...prev, currentNodeId]);
      setCurrentNodeId(nextId);
    }
  }, [currentNodeId]);

  const goBack = useCallback(() => {
    if (history.length === 0) return false;
    const prevHistory = [...history];
    const lastNode = prevHistory.pop();
    setHistory(prevHistory);
    setCurrentNodeId(lastNode!);
    return true;
  }, [history]);

  const restart = useCallback(() => {
    setCurrentNodeId('start');
    setIsFinished(false);
    setElapsedSeconds(0);
    setHistory([]);
  }, []);

  return {
    currentNode,
    isFinished,
    elapsedSeconds,
    goToNode,
    goBack,
    restart,
    progress: protocol ? (history.length / Object.keys(protocol.nodes).length) * 100 : 0
  };
}