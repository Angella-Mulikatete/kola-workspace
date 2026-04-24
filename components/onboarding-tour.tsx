"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Sparkles, Target, TrendingUp, Zap } from "lucide-react";
import { Button } from "./ui/button";

interface TourStep {
  title: string;
  description: string;
  icon: React.ReactNode;
  highlight?: string;
}

const tourSteps: TourStep[] = [
  {
    title: "Welcome to Kola Workspace! 🎉",
    description: "Your AI-powered freelance command center. Let's take a quick tour of what makes this special.",
    icon: <Sparkles className="w-8 h-8 text-purple-400" />,
  },
  {
    title: "Magic Input ✨",
    description: "Paste any job URL and watch AI generate a complete project workspace with milestones, proposals, and earnings forecasts.",
    icon: <Zap className="w-8 h-8 text-yellow-400" />,
    highlight: "magic-input",
  },
  {
    title: "Smart Job Discovery 🎯",
    description: "AI discovers and scores jobs that match your skills. Get personalized recommendations updated every 6 hours.",
    icon: <Target className="w-8 h-8 text-green-400" />,
    highlight: "job-discovery",
  },
  {
    title: "Track Your Earnings 📊",
    description: "Visualize your project progress with interactive charts. See cumulative earnings, breakdowns, and timeline forecasts.",
    icon: <TrendingUp className="w-8 h-8 text-blue-400" />,
  },
];

export function OnboardingTour() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Check if user has seen the tour
    const hasSeenTour = localStorage.getItem("hasSeenTour");
    if (!hasSeenTour) {
      // Show tour after a short delay
      setTimeout(() => setIsOpen(true), 1000);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("hasSeenTour", "true");
  };

  const currentTourStep = tourSteps[currentStep];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />

          {/* Tour Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg"
          >
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl blur-xl opacity-50" />

              {/* Card content */}
              <div className="relative bg-zinc-900 border border-white/10 rounded-3xl p-8 shadow-2xl">
                {/* Close button */}
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Icon */}
                <motion.div
                  key={currentStep}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", duration: 0.6 }}
                  className="flex items-center justify-center mb-6"
                >
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30">
                    {currentTourStep.icon}
                  </div>
                </motion.div>

                {/* Content */}
                <motion.div
                  key={`content-${currentStep}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-center space-y-4"
                >
                  <h2 className="text-2xl font-bold">{currentTourStep.title}</h2>
                  <p className="text-zinc-400 leading-relaxed">
                    {currentTourStep.description}
                  </p>
                </motion.div>

                {/* Progress dots */}
                <div className="flex items-center justify-center gap-2 mt-8 mb-6">
                  {tourSteps.map((_, index) => (
                    <motion.div
                      key={index}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className={`h-2 rounded-full transition-all ${
                        index === currentStep
                          ? "w-8 bg-purple-500"
                          : "w-2 bg-zinc-700"
                      }`}
                    />
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between gap-4">
                  <button
                    onClick={handleClose}
                    className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    Skip tour
                  </button>
                  <Button
                    onClick={handleNext}
                    size="lg"
                    className="gap-2"
                  >
                    {currentStep < tourSteps.length - 1 ? (
                      <>
                        Next
                        <ArrowRight className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        Get Started
                        <Sparkles className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </div>

                {/* Step counter */}
                <div className="text-center mt-4">
                  <span className="text-xs text-zinc-600">
                    Step {currentStep + 1} of {tourSteps.length}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
