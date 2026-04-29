"use client";

import { motion } from "framer-motion";
import { ExternalLink, MapPin, Sparkles, TrendingUp } from "lucide-react";
import { Button } from "./ui/button";

interface JobCardProps {
  title: string;
  description?: string;
  source: string;
  matchScore: number;
  jobUrl: string;
  onGeneratePitch: () => void;
}

export function JobCard({
  title,
  description,
  source,
  matchScore,
  jobUrl,
  onGeneratePitch,
}: JobCardProps) {
  const scoreColor =
    matchScore >= 0.8
      ? "text-green-400"
      : matchScore >= 0.6
      ? "text-yellow-400"
      : "text-orange-400";

  const scoreLabel =
    matchScore >= 0.8
      ? "Excellent Match"
      : matchScore >= 0.6
      ? "Good Match"
      : "Fair Match";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="p-6 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10 transition-all space-y-4 group"
    >
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold line-clamp-2 group-hover:text-purple-400 transition-colors">
            {title}
          </h3>
          <a
            href={jobUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg hover:bg-white/10 transition-colors flex-shrink-0"
          >
            <ExternalLink className="w-4 h-4 text-zinc-400" />
          </a>
        </div>

        {/* Match Score */}
        <div className="flex items-center gap-2">
          <TrendingUp className={`w-4 h-4 ${scoreColor}`} />
          <span className={`text-sm font-medium ${scoreColor}`}>
            {scoreLabel} ({Math.round(matchScore * 100)}%)
          </span>
        </div>
      </div>

      {/* Description */}
      {description && (
        <p className="text-sm text-zinc-400 line-clamp-3">{description}</p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-white/5">
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <span className="px-2 py-1 rounded-full bg-white/5 border border-white/10">
            {source}
          </span>
        </div>

        <Button
          onClick={onGeneratePitch}
          size="sm"
          className="gap-2 hover:scale-105 transition-transform"
        >
          Generate Pitch
        </Button>
      </div>
    </motion.div>
  );
}
