"use client";
import React, { useState } from 'react';

import StepWelcome from '@/components/onboarding/StepWelcome';
import StepInfo from '@/components/onboarding/StepInfo';
import StepLocation from '@/components/onboarding/StepLocation';
import SuccessScreen from '@/components/onboarding/SuccessScreen';
import Layout from '@/components/UI/Layout';

/**
 * TYPES & INTERFACES
 */
export type Step = 1 | 2 | 3 | 'complete';

export interface FormData {
  fullName: string;
  email: string;
  phone: string;
  country: string;
}

// --- Internal UI Components (Consolidated for Compilation) ---






// --- Step Views ---


/**
 * ONBOARDING PAGE
 * Orchestrates the multi-step flow for the EFAA assistant.
 */
export default function OnboardingPage() {
  const [step, setStep] = useState<Step>(1);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    country: ''
  });
  const [isLocating, setIsLocating] = useState(false);

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
      {step === 1 && <StepWelcome onNext={nextStep} />}
      {step === 2 && <StepInfo formData={formData} setFormData={setFormData} nextStep={nextStep} />}
      {step === 3 && <StepLocation handleLocationRequest={handleLocationRequest} isLocating={isLocating} nextStep={nextStep} />}
      {step === 'complete' && <SuccessScreen onReset={handleReset} />}
    </Layout>
  );
}