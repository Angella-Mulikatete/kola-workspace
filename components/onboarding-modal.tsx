"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/providers/auth-provider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface OnboardingModalProps {
  open: boolean;
  onComplete: () => void;
}

export function OnboardingModal({ open, onComplete }: OnboardingModalProps) {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [hourlyRate, setHourlyRate] = useState("");
  const [primarySkill, setPrimarySkill] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

  const updateUserProfile = useMutation(api.users.updateUserProfile);

  const handleNext = () => {
    if (step === 1 && hourlyRate) {
      setStep(2);
    }
  };

  const handleComplete = async () => {
    if (!user || !hourlyRate || !primarySkill || !location) return;

    setLoading(true);
    try {
      await updateUserProfile({
        firebaseId: user.uid,
        hourlyRate: parseFloat(hourlyRate),
        primarySkill,
        location,
      });
      onComplete();
    } catch (error) {
      console.error("Error completing onboarding:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {step === 1 ? "Welcome to Kola Workspace 🚀" : "Tell us about yourself"}
          </DialogTitle>
          <DialogDescription>
            {step === 1
              ? "Let's get you set up in just 15 seconds"
              : "This helps us find the perfect gigs for you"}
          </DialogDescription>
        </DialogHeader>

        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="space-y-6 py-4"
        >
          {step === 1 ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="hourlyRate" className="text-sm font-medium">
                  What is your base hourly rate? (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
                    $
                  </span>
                  <Input
                    id="hourlyRate"
                    type="number"
                    placeholder="50"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(e.target.value)}
                    className="pl-8"
                    min="0"
                    step="5"
                  />
                </div>
              </div>
              <Button
                onClick={handleNext}
                disabled={!hourlyRate}
                className="w-full"
              >
                Continue
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="primarySkill" className="text-sm font-medium">
                  What is your primary skill?
                </label>
                <Input
                  id="primarySkill"
                  type="text"
                  placeholder="e.g., Full-Stack Developer, UI/UX Designer"
                  value={primarySkill}
                  onChange={(e) => setPrimarySkill(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="location" className="text-sm font-medium">
                  Where are you located?
                </label>
                <Input
                  id="location"
                  type="text"
                  placeholder="e.g., United States, London, Remote"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => setStep(1)}
                  variant="outline"
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={handleComplete}
                  disabled={!primarySkill || !location || loading}
                  className="flex-1"
                >
                  {loading ? "Setting up..." : "Complete Setup"}
                </Button>
              </div>
            </div>
          )}
        </motion.div>

        <div className="flex justify-center gap-2 pt-2">
          <div
            className={`h-2 w-2 rounded-full transition-colors ${
              step === 1 ? "bg-white" : "bg-white/20"
            }`}
          />
          <div
            className={`h-2 w-2 rounded-full transition-colors ${
              step === 2 ? "bg-white" : "bg-white/20"
            }`}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
