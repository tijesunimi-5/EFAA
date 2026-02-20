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
import { useAlert } from '@/components/context/Alert'; // Ensure path is correct

/**
 * TYPES & INTERFACES
 */
export type Step = 1 | 2 | 3 | 'complete';

export interface FormData {
  fullName: string;
  email: string;
  phone: string;
  state: string;
  country: string;
  // Add these for the database
  latitude?: number;
  longitude?: number;
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
   * SESSION PERSISTENCE LOGIC
   * Checks if the user is already recognized by the browser
   */
  useEffect(() => {
    const token = localStorage.getItem("efaa_token");
    if (token) {
      // If user is already registered, take them straight to dashboard
      router.push('/dashboard');
    }
  }, [router]);

  /**
   * REGISTRATION LOGIC
   * Sends data to Node.js backend POST /users
   * Updated to receive direct lat/long to avoid React state delay
   */
  const handleRegistration = async (lat?: number, long?: number) => {
    // Combine current form data with direct coordinates to ensure they aren't empty
    const finalData = {
      ...formData,
      latitude: lat ?? formData.latitude,
      longitude: long ?? formData.longitude
    };

    // 1. Correct the endpoint to match your backend route
    const result = await callApi("/authentication/users", "POST", finalData);

    if (!result.error) {
      // 2. The backend sends { token, user }. We store the token for long-term persistence.
      if (result.token) {
        localStorage.setItem("efaa_token", result.token);
      }

      showAlert("Registration successful! Your device is now recognized.", "success");
      setStep('complete');
    } else {
      // callApi already showed the error alert, so we just stop here
      console.log("Registration failed", result.message);
    }
  };

  const nextStep = () => {
    if (step === 1) setStep(2);
    else if (step === 2) setStep(3);
    // Note: Step 3 (Location) handles its own registration trigger now
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
      showAlert("Geolocation is not supported", "error");
      setIsLocating(false);
      handleRegistration(); // Register with empty location if not supported
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        // Save into state for UI consistency
        setFormData(prev => ({
          ...prev,
          latitude,
          longitude
        }));

        setIsLocating(false);
        showAlert("Location captured successfully!", "success");

        // Pass coordinates DIRECTLY to avoid waiting for React state update
        handleRegistration(latitude, longitude);
      },
      (error) => {
        setIsLocating(false);
        showAlert("Location denied. You can still use EFAA manually.", "info");
        console.log("An error occured:", error);
        handleRegistration(); // Register even if location is denied
      }
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