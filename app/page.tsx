"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/providers/auth-provider";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { OnboardingModal } from "@/components/onboarding-modal";
import { Sparkles, Zap, TrendingUp } from "lucide-react";

export default function Home() {
  const { user, loading, signInWithGoogle } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  const needsOnboarding = useQuery(
    api.users.needsOnboarding,
    user ? { firebaseId: user.uid } : "skip"
  );

  useEffect(() => {
    if (user && needsOnboarding) {
      setShowOnboarding(true);
    }
  }, [user, needsOnboarding]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-zinc-400"
        >
          Loading...
        </motion.div>
      </div>
    );
  }

  // Redirect to dashboard if user is authenticated and onboarded
  useEffect(() => {
    if (user && !needsOnboarding) {
      window.location.href = "/dashboard";
    }
  }, [user, needsOnboarding]);

  if (user && !needsOnboarding) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-zinc-400"
        >
          Redirecting to dashboard...
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen px-4 relative overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05),transparent_50%)]" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-4xl mx-auto text-center space-y-8"
        >
          {/* Logo/Brand */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm"
          >
            <span className="text-sm font-medium">AI-Powered Workspace</span>
          </motion.div>

          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-6xl md:text-7xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-white via-white to-zinc-400 bg-clip-text text-transparent">
                Kola Workspace
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto">
              Automate gig discovery, project scoping, proposals, and earnings
              forecasting—all in one stunning command center
            </p>
          </div>

          {/* Feature Pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-4 pt-4"
          >
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-sm">Smart Job Discovery</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm">Instant Proposals</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-sm">Earnings Forecaster</span>
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="pt-8"
          >
            <Button
              onClick={signInWithGoogle}
              size="lg"
              className="text-lg px-8 py-6 rounded-xl bg-white text-black hover:bg-white/90 shadow-2xl shadow-white/20"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Get Started with Google
            </Button>
            <p className="text-sm text-zinc-500 mt-4">
              Free to start • No credit card required
            </p>
          </motion.div>
        </motion.div>

        {/* Decorative elements */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      {/* Onboarding Modal */}
      {user && (
        <OnboardingModal
          open={showOnboarding}
          onComplete={() => setShowOnboarding(false)}
        />
      )}
    </>
  );
}
