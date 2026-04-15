"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import StepWelcome from '@/components/onboarding/StepWelcome';
import StepInfo from '@/components/onboarding/StepInfo';
import StepLocation from '@/components/onboarding/StepLocation';
import SuccessScreen from '@/components/onboarding/SuccessScreen';
import Layout from '@/components/UI/Layout';

// Hooks and Context
import { useAPI } from '@/components/hook/callApi';
import { useAlert } from '@/components/context/Alert';
import { useUser, UserRole } from '@/components/context/User';

/**
 * TYPES & INTERFACES
 */
export type Step = 1 | 2 | 3 | 'complete';

export interface FormData {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  state: string;
  country: string;
  latitude?: number;
  longitude?: number;
}

export interface ApiResponse {
  success: boolean;
  token?: string;
  user: {
    fullName: string;
    email: string;
    state: string;
    role: UserRole; // Added to match refactored context
  };
  error?: string;
}

export default function OnboardingPage() {
  const router = useRouter();
  const { callApi } = useAPI();
  const { showAlert } = useAlert();
  const { setUser } = useUser(); // Access global user state

  const [step, setStep] = useState<Step>(1);
  const [isLocating, setIsLocating] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    state: '',
    country: 'Nigeria'
  });

  /**
   * SESSION PERSISTENCE
   * If a token exists, we skip onboarding entirely.
   */
  useEffect(() => {
    const token = localStorage.getItem("efaa_token");
    if (token) {
      router.push('/home'); // Redirect to new professional hub
    }
  }, [router]);

  /**
   * REGISTRATION LOGIC
   * Finalizes the account and logs the user in immediately.
   */
  const handleRegistration = async (lat?: number, lng?: number) => {
    try {
      const finalData = {
        ...formData,
        latitude: lat || formData.latitude,
        longitude: lng || formData.longitude,
        role: 'user' // Default role for new responders
      };

      const result = await callApi('/authentication/users', 'POST', finalData) as unknown as ApiResponse;

      if (result.success && result.token) {
        // 1. Set Auth Token
        localStorage.setItem('efaa_token', String(result.token));

        // 2. Hydrate Global User State
        // This ensures the "Header" and "WelcomeHeader" update immediately
        setUser({
          fullName: result.user.fullName,
          email: result.user.email,
          state: result.user.state,
          role: result.user.role || 'user'
        });

        showAlert("Profile created successfully!", "success");
        setStep('complete');
      } else {
        const errorMessage = typeof result.error === 'string' ? result.error : "Failed to create profile";
        showAlert(errorMessage, "error");
      }
    } catch (err) {
      console.error("Registration error:", err);
      showAlert("Network error. Please try again.", "error");
    }
  };

  const nextStep = () => {
    if (step === 1) setStep(2);
    else if (step === 2) setStep(3);
  };

  const prevStep = () => {
    if (step === 2) setStep(1);
    else if (step === 3) setStep(2);
  };

  const handleFinish = () => {
    router.push('/home');
  };

  const handleLocationRequest = () => {
    setIsLocating(true);

    if (!navigator.geolocation) {
      showAlert("Location services unavailable", "error");
      setIsLocating(false);
      handleRegistration();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setFormData(prev => ({ ...prev, latitude, longitude }));
        setIsLocating(false);
        showAlert("Location verified", "success");
        handleRegistration(latitude, longitude);
      },
      (error) => {
        setIsLocating(false);
        showAlert("Location denied. Proceeding with default settings.", "info");
        handleRegistration();
      }
    );
  };

  return (
    <Layout
      onBack={step !== 1 && step !== 'complete' ? prevStep : undefined}
      currentStep={step === 'complete' ? 3 : step}
    >
      <div className="max-w-md mx-auto w-full px-4 py-8">
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

        {step === 'complete' && <SuccessScreen onReset={handleFinish} />}
      </div>
    </Layout>
  );
}