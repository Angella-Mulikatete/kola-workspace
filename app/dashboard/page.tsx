"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/providers/auth-provider";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useChat } from "@ai-sdk/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { JobCard } from "@/components/job-card";
import { Sparkles, Link as LinkIcon, Loader2, LogOut, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";

export default function DashboardPage() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();
  const [jobUrl, setJobUrl] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLocation, setSearchLocation] = useState("");

  const currentUser = useQuery(
    api.users.getCurrentUser,
    user ? { firebaseId: user.uid } : "skip"
  );

  const recommendedJobs = useQuery(
    api.jobs.getRecommendedJobs,
    currentUser ? { userId: currentUser._id, limit: 8 } : "skip"
  );

  const triggerJobDiscovery = useAction(api.jobs.triggerJobDiscovery);
  const createWorkspace = useMutation(api.workspaces.createWorkspace);
  const [isDiscovering, setIsDiscovering] = useState(false);

  const { messages, sendMessage, status } = useChat();
  const isLoading = status === "streaming";

  const handleGenerate = async (url?: string) => {
    const targetUrl = url || jobUrl;
    if (!targetUrl.trim() || !currentUser) return;

    try {
      // Create workspace first
      const workspaceId = await createWorkspace({
        userId: currentUser._id,
        jobUrl: targetUrl,
        jobTitle: "New Project", // Will be updated by AI
        jobDescription: "",
      });

      // Navigate to workspace page
      router.push(`/workspace/${workspaceId}`);
      
      showToast("success", "Workspace created! Generating details...");
      
      // Clear the input if it was from the manual input
      if (!url) {
        setJobUrl("");
      }
    } catch (error) {
      console.error("Error generating workspace:", error);
      showToast("error", "Failed to create workspace. Please try again.");
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const handleDiscoverJobs = async () => {
    if (!currentUser) return;
    
    // Use custom search if provided, otherwise use profile data
    const skill = searchQuery.trim() || currentUser.primarySkill;
    const location = searchLocation.trim() || currentUser.location;
    
    if (!skill || !location) {
      showToast("error", "Please enter both search query and location");
      return;
    }
    
    setIsDiscovering(true);
    try {
      const result = await triggerJobDiscovery({ 
        userId: currentUser._id,
        skill: searchQuery.trim() || undefined,
        location: searchLocation.trim() || undefined,
      });
      
      console.log("Job discovery result:", result);
      
      if (result.savedJobs > 0) {
        showToast("success", `Found ${result.savedJobs} matching jobs! Check below.`);
      } else if (result.totalJobs > 0) {
        showToast("info", `Found ${result.totalJobs} jobs but none matched your profile well enough (score > 60%)`);
      } else {
        showToast("info", "No jobs found. Try different search terms.");
      }
    } catch (error) {
      console.error("Error discovering jobs:", error);
      showToast("error", "Failed to discover jobs. Please try again.");
    } finally {
      setIsDiscovering(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm bg-black/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-400" />
            <h1 className="text-xl font-bold">Kola Workspace</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-zinc-400">
              {currentUser.primarySkill} • ${currentUser.hourlyRate}/hr
            </div>
            <Button
              onClick={handleSignOut}
              variant="ghost"
              size="sm"
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4"
          >
            <h2 className="text-4xl md:text-5xl font-bold">
              Welcome back, {user?.displayName?.split(" ")[0]}! 👋
            </h2>
            <p className="text-xl text-zinc-400">
              Paste a job URL to generate your complete project workspace
            </p>
          </motion.div>

          {/* Magic Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <div className="relative group">
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl blur-lg opacity-25 group-hover:opacity-40 transition-opacity" />

              {/* Input container */}
              <div className="relative bg-zinc-900 border border-white/10 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30">
                    <LinkIcon className="w-6 h-6 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">Magic Input</h3>
                    <p className="text-sm text-zinc-400">
                      Paste a job URL from Upwork, Fiverr, or any platform
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Input
                    type="url"
                    placeholder="https://www.upwork.com/jobs/..."
                    value={jobUrl}
                    onChange={(e) => setJobUrl(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !isLoading) {
                        handleGenerate();
                      }
                    }}
                    disabled={isLoading}
                    className="flex-1 h-12 text-base"
                  />
                  <Button
                    onClick={() => handleGenerate()}
                    disabled={!jobUrl.trim() || isLoading}
                    size="lg"
                    className="px-8 gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Generate Pitch
                      </>
                    )}
                  </Button>
                </div>

                {/* Example URLs */}
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="text-xs text-zinc-500">Try:</span>
                  {[
                    "Upwork Job",
                    "Fiverr Gig",
                    "Freelancer Project",
                  ].map((platform) => (
                    <button
                      key={platform}
                      onClick={() =>
                        setJobUrl(
                          `https://example.com/${platform.toLowerCase().replace(" ", "-")}`
                        )
                      }
                      className="text-xs px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                    >
                      {platform}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* AI Response Area */}
          {messages.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <h3 className="text-2xl font-bold">AI Response</h3>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-4 rounded-xl ${
                      message.role === "user"
                        ? "bg-blue-500/10 border border-blue-500/20"
                        : "bg-zinc-900 border border-white/10"
                    }`}
                  >
                    <div className="font-semibold mb-2">
                      {message.role === "user" ? "You" : "AI"}
                    </div>
                    {message.parts.map((part, i) => {
                      switch (part.type) {
                        case "text":
                          return (
                            <div key={`${message.id}-${i}`} className="whitespace-pre-wrap">
                              {part.text}
                            </div>
                          );
                        case "tool-analyzeJob":
                        case "tool-createWorkspace":
                          return (
                            <pre
                              key={`${message.id}-${i}`}
                              className="text-xs bg-black/50 p-3 rounded overflow-x-auto"
                            >
                              {JSON.stringify(part, null, 2)}
                            </pre>
                          );
                        default:
                          return null;
                      }
                    })}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Smart Discovery Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-2xl font-bold">Recommended Gigs</h3>
              <p className="text-zinc-400">
                Curated jobs matching your skills and location
              </p>
            </div>

            {/* Job Discovery Search */}
            <div className="relative group">
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-2xl blur-lg opacity-25 group-hover:opacity-40 transition-opacity" />

              {/* Search container */}
              <div className="relative bg-zinc-900 border border-white/10 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-green-500/20 to-teal-500/20 border border-green-500/30">
                    <RefreshCw className="w-6 h-6 text-green-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold">Discover Jobs</h4>
                    <p className="text-sm text-zinc-400">
                      Search for jobs by skill and location
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input
                    type="text"
                    placeholder={`Search query (e.g., ${currentUser.primarySkill})`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    disabled={isDiscovering}
                    className="h-12 text-base"
                  />
                  <Input
                    type="text"
                    placeholder={`Location (e.g., ${currentUser.location})`}
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    disabled={isDiscovering}
                    className="h-12 text-base"
                  />
                </div>

                <Button
                  onClick={handleDiscoverJobs}
                  disabled={isDiscovering}
                  size="lg"
                  className="w-full gap-2 bg-green-600 hover:bg-green-700"
                >
                  {isDiscovering ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Discovering Jobs...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4" />
                      Discover Now
                    </>
                  )}
                </Button>

                {/* Default values hint */}
                <div className="text-xs text-zinc-500 text-center">
                  Leave empty to use your profile: {currentUser.primarySkill} in {currentUser.location}
                </div>
              </div>
            </div>

            {/* Job Cards */}
            {recommendedJobs === undefined ? (
              // Loading state
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="p-6 rounded-xl bg-zinc-900/50 border border-white/5 space-y-3"
                  >
                    <div className="h-4 bg-zinc-800 rounded w-3/4 animate-pulse" />
                    <div className="h-3 bg-zinc-800 rounded w-full animate-pulse" />
                    <div className="h-3 bg-zinc-800 rounded w-5/6 animate-pulse" />
                    <div className="flex gap-2 pt-2">
                      <div className="h-6 bg-zinc-800 rounded w-16 animate-pulse" />
                      <div className="h-6 bg-zinc-800 rounded w-20 animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            ) : recommendedJobs.length === 0 ? (
              // Empty state
              <div className="text-center py-12 px-4 rounded-xl bg-zinc-900/50 border border-white/5">
                <Sparkles className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                <h4 className="text-lg font-semibold mb-2">No jobs yet</h4>
                <p className="text-zinc-400 mb-4">
                  Our AI is discovering the perfect gigs for you. Check back soon!
                </p>
                <p className="text-sm text-zinc-500">
                  Job discovery runs automatically every 6 hours
                </p>
              </div>
            ) : (
              // Job cards
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendedJobs.map((job) => (
                  <JobCard
                    key={job._id}
                    title={job.title}
                    description={job.description}
                    source={job.source}
                    matchScore={job.matchScore}
                    jobUrl={job.jobUrl}
                    onGeneratePitch={() => handleGenerate(job.jobUrl)}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </main>

      {/* Decorative elements */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
}
