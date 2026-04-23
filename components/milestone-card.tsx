"use client";

import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { GripVertical, Clock, DollarSign, Edit2, Check, X } from "lucide-react";
import { motion } from "framer-motion";

interface Milestone {
  _id: Id<"milestones">;
  title: string;
  description?: string;
  status: "todo" | "in-progress" | "done";
  estimatedHours: number;
  cost: number;
  order: number;
}

interface MilestoneCardProps {
  milestone: Milestone;
  onUpdate: (
    milestoneId: Id<"milestones">,
    updates: {
      title?: string;
      description?: string;
      estimatedHours?: number;
      cost?: number;
      status?: "todo" | "in-progress" | "done";
    }
  ) => Promise<void>;
}

export function MilestoneCard({ milestone, onUpdate }: MilestoneCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(milestone.title);
  const [hours, setHours] = useState(milestone.estimatedHours.toString());
  const [cost, setCost] = useState(milestone.cost.toString());

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: milestone._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleSave = async () => {
    await onUpdate(milestone._id, {
      title,
      estimatedHours: parseFloat(hours) || 0,
      cost: parseFloat(cost) || 0,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTitle(milestone.title);
    setHours(milestone.estimatedHours.toString());
    setCost(milestone.cost.toString());
    setIsEditing(false);
  };

  const handleStatusChange = async () => {
    const statusOrder: Array<"todo" | "in-progress" | "done"> = [
      "todo",
      "in-progress",
      "done",
    ];
    const currentIndex = statusOrder.indexOf(milestone.status);
    const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length];
    await onUpdate(milestone._id, { status: nextStatus });
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 rounded-xl border transition-all ${
        milestone.status === "done"
          ? "bg-green-500/5 border-green-500/20"
          : milestone.status === "in-progress"
          ? "bg-blue-500/5 border-blue-500/20"
          : "bg-zinc-900 border-white/10"
      } hover:border-white/20`}
    >
      <div className="flex items-start gap-3">
        {/* Drag Handle */}
        <button
          {...attributes}
          {...listeners}
          className="mt-1 cursor-grab active:cursor-grabbing text-zinc-500 hover:text-zinc-300"
        >
          <GripVertical className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="flex-1 space-y-3">
          {isEditing ? (
            // Edit Mode
            <div className="space-y-3">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Milestone title"
                className="font-semibold"
              />
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs text-zinc-400">Hours</label>
                  <Input
                    type="number"
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                    placeholder="0"
                    min="0"
                    step="0.5"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-zinc-400">Cost ($)</label>
                  <Input
                    type="number"
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                    placeholder="0"
                    min="0"
                    step="50"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSave} size="sm" className="flex-1">
                  <Check className="w-4 h-4 mr-1" />
                  Save
                </Button>
                <Button
                  onClick={handleCancel}
                  size="sm"
                  variant="outline"
                  className="flex-1"
                >
                  <X className="w-4 h-4 mr-1" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            // View Mode
            <>
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-semibold flex-1">{milestone.title}</h4>
                <Button
                  onClick={() => setIsEditing(true)}
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0"
                >
                  <Edit2 className="w-3 h-3" />
                </Button>
              </div>

              {milestone.description && (
                <p className="text-sm text-zinc-400">{milestone.description}</p>
              )}

              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-zinc-400">
                  <Clock className="w-4 h-4" />
                  <span>{milestone.estimatedHours}h</span>
                </div>
                <div className="flex items-center gap-1 text-zinc-400">
                  <DollarSign className="w-4 h-4" />
                  <span>{milestone.cost.toLocaleString()}</span>
                </div>
              </div>

              <Button
                onClick={handleStatusChange}
                size="sm"
                variant="outline"
                className="w-full"
              >
                Move to{" "}
                {milestone.status === "todo"
                  ? "In Progress"
                  : milestone.status === "in-progress"
                  ? "Done"
                  : "To Do"}
              </Button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
