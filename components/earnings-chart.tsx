"use client";

import { Id } from "@/convex/_generated/dataModel";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Milestone {
  _id: Id<"milestones">;
  title: string;
  estimatedHours: number;
  cost: number;
  order: number;
}

interface EarningsChartProps {
  milestones: Milestone[];
}

export function EarningsChart({ milestones }: EarningsChartProps) {
  // Generate cumulative earnings data
  const data = milestones
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

  // Add starting point
  const chartData = [{ name: "Start", earnings: 0, hours: 0 }, ...data];

  const totalEarnings = milestones.reduce((sum, m) => sum + m.cost, 0);

  return (
    <div className="space-y-4">
      <div className="p-6 rounded-xl bg-zinc-900 border border-white/10">
        <div className="mb-6">
          <div className="text-3xl font-bold text-green-400">
            ${totalEarnings.toLocaleString()}
          </div>
          <div className="text-sm text-zinc-400">Total Project Value</div>
        </div>

        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData}>
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
              formatter={(value: any) => {
                return [`$${value.toLocaleString()}`, "Earnings"];
              }}
            />
            <Line
              type="monotone"
              dataKey="earnings"
              stroke="#22c55e"
              strokeWidth={3}
              dot={{ fill: "#22c55e", r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>

        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold">{milestones.length}</div>
            <div className="text-xs text-zinc-400">Milestones</div>
          </div>
          <div>
            <div className="text-lg font-semibold">
              {milestones.reduce((sum, m) => sum + m.estimatedHours, 0)}h
            </div>
            <div className="text-xs text-zinc-400">Total Hours</div>
          </div>
          <div>
            <div className="text-lg font-semibold">
              $
              {Math.round(
                totalEarnings /
                  milestones.reduce((sum, m) => sum + m.estimatedHours, 0)
              )}
              /h
            </div>
            <div className="text-xs text-zinc-400">Avg Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
}
