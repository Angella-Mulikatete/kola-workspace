"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { MilestoneCard } from "./milestone-card";
import { celebrateMilestone } from "@/lib/confetti";
import { useToast } from "./ui/toast";

interface Milestone {
  _id: Id<"milestones">;
  workspaceId: Id<"workspaces">;
  title: string;
  description?: string;
  status: "todo" | "in-progress" | "done";
  estimatedHours: number;
  cost: number;
  order: number;
}

interface KanbanBoardProps {
  workspaceId: Id<"workspaces">;
  milestones: Milestone[];
}

export function KanbanBoard({ workspaceId, milestones }: KanbanBoardProps) {
  const [localMilestones, setLocalMilestones] = useState(milestones);
  const updateMilestone = useMutation(api.workspaces.updateMilestone);
  const { showToast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Update local state when milestones change
  if (milestones.length !== localMilestones.length) {
    setLocalMilestones(milestones);
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = localMilestones.findIndex((m) => m._id === active.id);
    const newIndex = localMilestones.findIndex((m) => m._id === over.id);

    const newMilestones = arrayMove(localMilestones, oldIndex, newIndex);
    setLocalMilestones(newMilestones);

    // Update order in database
    // We'll update the moved milestone's order
    try {
      await updateMilestone({
        milestoneId: active.id as Id<"milestones">,
        // Update with new order based on position
      });
    } catch (error) {
      console.error("Error updating milestone order:", error);
      // Revert on error
      setLocalMilestones(milestones);
    }
  };

  const handleUpdateMilestone = async (
    milestoneId: Id<"milestones">,
    updates: {
      title?: string;
      description?: string;
      estimatedHours?: number;
      cost?: number;
      status?: "todo" | "in-progress" | "done";
    }
  ) => {
    try {
      // Check if milestone is being marked as done
      const milestone = localMilestones.find((m) => m._id === milestoneId);
      const wasNotDone = milestone && milestone.status !== "done";
      const isNowDone = updates.status === "done";

      await updateMilestone({
        milestoneId,
        ...updates,
      });

      // Celebrate when milestone is completed!
      if (wasNotDone && isNowDone) {
        celebrateMilestone();
        showToast("success", `🎉 Milestone completed! Great work!`);
      }
    } catch (error) {
      console.error("Error updating milestone:", error);
      showToast("error", "Failed to update milestone");
    }
  };

  // Group milestones by status
  const todoMilestones = localMilestones.filter((m) => m.status === "todo");
  const inProgressMilestones = localMilestones.filter(
    (m) => m.status === "in-progress"
  );
  const doneMilestones = localMilestones.filter((m) => m.status === "done");

  return (
    <div className="space-y-6">
      {/* To Do Column */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-zinc-500" />
          <h3 className="font-semibold text-zinc-400">
            TO DO ({todoMilestones.length})
          </h3>
        </div>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={todoMilestones.map((m) => m._id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {todoMilestones.map((milestone) => (
                <MilestoneCard
                  key={milestone._id}
                  milestone={milestone}
                  onUpdate={handleUpdateMilestone}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      {/* In Progress Column */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          <h3 className="font-semibold text-blue-400">
            IN PROGRESS ({inProgressMilestones.length})
          </h3>
        </div>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={inProgressMilestones.map((m) => m._id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {inProgressMilestones.map((milestone) => (
                <MilestoneCard
                  key={milestone._id}
                  milestone={milestone}
                  onUpdate={handleUpdateMilestone}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      {/* Done Column */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <h3 className="font-semibold text-green-400">
            DONE ({doneMilestones.length})
          </h3>
        </div>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={doneMilestones.map((m) => m._id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {doneMilestones.map((milestone) => (
                <MilestoneCard
                  key={milestone._id}
                  milestone={milestone}
                  onUpdate={handleUpdateMilestone}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}
