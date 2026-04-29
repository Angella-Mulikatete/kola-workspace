"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Sparkles, RefreshCw, Command } from "lucide-react";

interface FloatingActionButtonProps {
  onNewWorkspace?: () => void;
  onDiscoverJobs?: () => void;
  onShowShortcuts?: () => void;
}

export function FloatingActionButton({
  onNewWorkspace,
  onDiscoverJobs,
  onShowShortcuts,
}: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    {
      icon: <Sparkles className="w-5 h-5" />,
      label: "New Workspace",
      onClick: onNewWorkspace,
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: <RefreshCw className="w-5 h-5" />,
      label: "Discover Jobs",
      onClick: onDiscoverJobs,
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: <Command className="w-5 h-5" />,
      label: "Shortcuts",
      onClick: onShowShortcuts,
      color: "from-blue-500 to-cyan-500",
    },
  ];

  return (
    <div className="fixed bottom-8 right-8 z-40">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute bottom-20 right-0 space-y-3"
          >
            {actions.map((action, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => {
                  action.onClick?.();
                  setIsOpen(false);
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 hover:border-zinc-300 dark:hover:border-white/20 shadow-lg hover:shadow-xl transition-all group"
              >
                <div
                  className={`p-2 rounded-lg bg-gradient-to-br ${action.color} bg-opacity-20`}
                >
                  {action.icon}
                </div>
                <span className="text-sm font-medium whitespace-nowrap">
                  {action.label}
                </span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main FAB */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/70 transition-shadow flex items-center justify-center group"
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <Plus className="w-7 h-7 text-white" />
        </motion.div>

        {/* Pulse ring */}
        {!isOpen && (
          <motion.div
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-full bg-purple-500"
          />
        )}
      </motion.button>
    </div>
  );
}
