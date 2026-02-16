"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import StepWelcome from '@/components/onboarding/StepWelcome';
import StepInfo from '@/components/onboarding/StepInfo';
import StepLocation from '@/components/onboarding/StepLocation';
import SuccessScreen from '@/components/onboarding/SuccessScreen';
import Layout from '@/components/UI/Layout';

// Hooks and Context
import { useAPI } from '@/components/hook/callApi';
import { useAlert } from '@/components/context/Alert'; // Ensure path is correct

/**
 * TYPES & INTERFACES
 */
export type Step = 1 | 2 | 3 | 'complete';

export interface FormData {
  fullName: string;
  email: string;
  phone: string;
  state: string; // Required for African context/Nigerian states
  country: string;
}

export default function OnboardingPage() {
  const router = useRouter();
  const { callApi } = useAPI();
  const { showAlert } = useAlert();

  const [step, setStep] = useState<Step>(1);
  const [isLocating, setIsLocating] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    state: '',
    country: 'Nigeria'
  });

  /**
   * REGISTRATION LOGIC
   * Sends data to Node.js backend POST /users
   */
  const handleRegistration = async () => {
    // callApi automatically handles the error showAlert pop-up
    const result = await callApi("/users", "POST", formData) as {
      error?: boolean;
      token?: string;
      message?: string
    };

    if (!result.error) {
      // One-time registration: store the 10-year JWT
      if (result.token) {
        localStorage.setItem("efaa_token", result.token);
      }
      showAlert("Registration successful! Welcome to EFAA.", "success");
      setStep('complete');
    }
  };

  const nextStep = () => {
    if (step === 1) setStep(2);
    else if (step === 2) setStep(3);
    else if (step === 3) handleRegistration();
  };

  const prevStep = () => {
    if (step === 2) setStep(1);
    else if (step === 3) setStep(2);
  };

  const handleReset = () => {
    router.push('/dashboard');
  };

  const handleLocationRequest = () => {
    setIsLocating(true);

    if (!navigator.geolocation) {
      showAlert("Geolocation is not supported by your browser", "error");
      setIsLocating(false);
      nextStep();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Sync to backend heartbeat if needed immediately
        console.log("Location captured:", position.coords);
        setIsLocating(false);
        showAlert("Location access granted. We can now find nearby help.", "success");
        nextStep();
      },
      (_error) => {
        console.error("Location error:", _error);
        setIsLocating(false);
        showAlert("Location access denied. You can still use EFAA manually.", "info");
        nextStep();
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <Layout
      onBack={step !== 1 && step !== 'complete' ? prevStep : undefined}
      currentStep={step === 'complete' ? 3 : step}
    >
      {step === 1 && <StepWelcome onNext={nextStep} />}

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

      {step === 'complete' && <SuccessScreen onReset={handleReset} />}
    </Layout>
  );
}