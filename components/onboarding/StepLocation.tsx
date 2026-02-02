"use client";

import React from "react";
import { MapPin } from "lucide-react";
import ProgressIndicator from "../UI/ProgressIndicator";
import SButton from "../UI/SButton";

/**
 * Prop interface for StepLocation.
 * These values should be managed by the parent "Main Page" state
 * and passed down here.
 */
interface StepLocationProps {
  handleLocationRequest: () => void;
  isLocating: boolean;
  nextStep: () => void;
}

const StepLocation = ({
  handleLocationRequest,
  isLocating,
  nextStep
}: StepLocationProps) => (
  <div className="animate-in fade-in slide-in-from-right-4 duration-500 text-center">
    <ProgressIndicator currentStep={3} />

    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
      <MapPin className="w-8 h-8" />
    </div>

    <h2 className="text-2xl font-bold mb-3 text-slate-900">Enable Location</h2>

    <p className="text-slate-600 mb-8 leading-relaxed px-4">
      Location access allows EFAA to pinpoint the nearest hospitals and provide
      specific guidance for your exact area in Nigeria.
    </p>

    <div className="space-y-4">
      <SButton
        onClick={handleLocationRequest}
        disabled={isLocating}
        variant="primary"
      >
        {isLocating ? (
          <span className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Connecting...
          </span>
        ) : (
          "Allow Location Access"
        )}
      </SButton>

      <SButton
        variant="ghost"
        onClick={nextStep}
        disabled={isLocating}
      >
        Skip for now
      </SButton>
    </div>

    <p className="mt-8 text-xs text-slate-400 px-6">
      You can always change this later in your device settings.
      We prioritize your privacy.
    </p>
  </div>
);

export default StepLocation;