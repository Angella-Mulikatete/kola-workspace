"use client";

import { useState, useEffect } from "react";
import { Id } from "@/convex/_generated/dataModel";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { motion } from "framer-motion";
import { TrendingUp, BarChart3, Calendar } from "lucide-react";

interface Milestone {
  _id: Id<"milestones">;
  title: string;
  estimatedHours: number;
  cost: number;
  order: number;
  status: "todo" | "in-progress" | "done";
}

interface EarningsChartProps {
  milestones: Milestone[];
}

type ChartView = "cumulative" | "breakdown" | "timeline";

export function EarningsChart({ milestones }: EarningsChartProps) {
  const [view, setView] = useState<ChartView>("cumulative");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Generate cumulative earnings data
  const cumulativeData = milestones
    .sort((a, b) => a.order - b.order)
    .reduce((acc: any[], milestone, index) => {
      const previousTotal = index > 0 ? acc[index - 1].earnings : 0;
      return [
        ...acc,
        {
          name: `M${index + 1}`,
          milestone: milestone.title,
          earnings: previousTotal + milestone.cost,
          hours: milestone.estimatedHours,
        },
      ];
    }, []);

  // Add starting point for cumulative chart
  const cumulativeChartData = [
    { name: "Start", earnings: 0, hours: 0 },
    ...cumulativeData,
  ];

  // Generate breakdown data (individual milestone values)
  const breakdownData = milestones
    .sort((a, b) => a.order - b.order)
    .map((milestone, index) => ({
      name: `M${index + 1}`,
      milestone: milestone.title,
      cost: milestone.cost,
      hours: milestone.estimatedHours,
      status: milestone.status,
    }));

  // Generate timeline forecast (assuming 1 week per milestone)
  const timelineData = mounted ? milestones
    .sort((a, b) => a.order - b.order)
    .reduce((acc: any[], milestone, index) => {
      const previousTotal = index > 0 ? acc[index - 1].earnings : 0;
      const weeksFromNow = index + 1;
      const date = new Date();
      date.setDate(date.getDate() + weeksFromNow * 7);
      
      return [
        ...acc,
        {
          date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          earnings: previousTotal + milestone.cost,
          milestone: milestone.title,
        },
      ];
    }, []) : [];

  const totalEarnings = milestones.reduce((sum, m) => sum + m.cost, 0);
  const totalHours = milestones.reduce((sum, m) => sum + m.estimatedHours, 0);
  const avgRate = totalHours > 0 ? Math.round(totalEarnings / totalHours) : 0;

  const completedMilestones = milestones.filter((m) => m.status === "done").length;
  const earnedSoFar = milestones
    .filter((m) => m.status === "done")
    .reduce((sum, m) => sum + m.cost, 0);

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="space-y-4">
        <div className="flex gap-2 p-1 bg-zinc-900 rounded-lg border border-white/10 h-[42px]" />
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-zinc-900 border border-white/10 h-[80px]" />
          <div className="p-4 rounded-xl bg-zinc-900 border border-white/10 h-[80px]" />
        </div>
        <div className="p-6 rounded-xl bg-zinc-900 border border-white/10 h-[300px]" />
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-zinc-900 border border-white/10 h-[60px]" />
          <div className="p-4 rounded-xl bg-zinc-900 border border-white/10 h-[60px]" />
          <div className="p-4 rounded-xl bg-zinc-900 border border-white/10 h-[60px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Chart Type Selector */}
      <div className="flex gap-2 p-1 bg-zinc-900 rounded-lg border border-white/10">
        <button
          onClick={() => setView("cumulative")}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm transition-all ${
            view === "cumulative"
              ? "bg-green-600 text-white"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Cumulative
        </button>
        <button
          onClick={() => setView("breakdown")}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm transition-all ${
            view === "breakdown"
              ? "bg-green-600 text-white"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          Breakdown
        </button>
        <button
          onClick={() => setView("timeline")}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm transition-all ${
            view === "timeline"
              ? "bg-green-600 text-white"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          <Calendar className="w-4 h-4" />
          Timeline
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-zinc-900 border border-white/10"
        >
          <div className="text-2xl font-bold text-green-400">
            ${totalEarnings.toLocaleString()}
          </div>
          <div className="text-xs text-zinc-400">Total Project Value</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 rounded-xl bg-zinc-900 border border-white/10"
        >
          <div className="text-2xl font-bold text-blue-400">
            ${earnedSoFar.toLocaleString()}
          </div>
          <div className="text-xs text-zinc-400">
            Earned ({completedMilestones}/{milestones.length} done)
          </div>
        </motion.div>
      </div>

      {/* Chart */}
      <motion.div
        key={view}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="p-6 rounded-xl bg-zinc-900 border border-white/10"
      >
        {view === "cumulative" && (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={cumulativeChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis
                dataKey="name"
                stroke="#71717a"
                style={{ fontSize: "12px" }}
              />
              <YAxis
                stroke="#71717a"
                style={{ fontSize: "12px" }}
                tickFormatter={(value) => `$${value / 1000}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#18181b",
                  border: "1px solid #27272a",
                  borderRadius: "8px",
                  color: "#fff",
                }}
                formatter={(value: any) => [`$${value.toLocaleString()}`, "Earnings"]}
              />
              <Line
                type="monotone"
                dataKey="earnings"
                stroke="#22c55e"
                strokeWidth={3}
                dot={{ fill: "#22c55e", r: 5 }}
                activeDot={{ r: 7 }}
                animationDuration={1000}
              />
            </LineChart>
          </ResponsiveContainer>
        )}

        {view === "breakdown" && (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={breakdownData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis
                dataKey="name"
                stroke="#71717a"
                style={{ fontSize: "12px" }}
              />
              <YAxis
                stroke="#71717a"
                style={{ fontSize: "12px" }}
                tickFormatter={(value) => `$${value / 1000}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#18181b",
                  border: "1px solid #27272a",
                  borderRadius: "8px",
                  color: "#fff",
                }}
                formatter={(value: any) => [`$${value.toLocaleString()}`, "Cost"]}
              />
              <Bar
                dataKey="cost"
                fill="#22c55e"
                radius={[8, 8, 0, 0]}
                animationDuration={1000}
              />
            </BarChart>
          </ResponsiveContainer>
        )}

        {view === "timeline" && (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis
                dataKey="date"
                stroke="#71717a"
                style={{ fontSize: "12px" }}
              />
              <YAxis
                stroke="#71717a"
                style={{ fontSize: "12px" }}
                tickFormatter={(value) => `$${value / 1000}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#18181b",
                  border: "1px solid #27272a",
                  borderRadius: "8px",
                  color: "#fff",
                }}
                formatter={(value: any) => [`$${value.toLocaleString()}`, "Projected Earnings"]}
              />
              <Line
                type="monotone"
                dataKey="earnings"
                stroke="#3b82f6"
                strokeWidth={3}
                strokeDasharray="5 5"
                dot={{ fill: "#3b82f6", r: 5 }}
                activeDot={{ r: 7 }}
                animationDuration={1000}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-4 rounded-xl bg-zinc-900 border border-white/10 text-center"
        >
          <div className="text-xl font-semibold">{milestones.length}</div>
          <div className="text-xs text-zinc-400">Milestones</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-4 rounded-xl bg-zinc-900 border border-white/10 text-center"
        >
          <div className="text-xl font-semibold">{totalHours}h</div>
          <div className="text-xs text-zinc-400">Total Hours</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-4 rounded-xl bg-zinc-900 border border-white/10 text-center"
        >
          <div className="text-xl font-semibold">${avgRate}/h</div>
          <div className="text-xs text-zinc-400">Avg Rate</div>
        </motion.div>
      </div>
    </div>
  );
}
