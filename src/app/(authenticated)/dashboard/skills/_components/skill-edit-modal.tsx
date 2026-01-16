// skills/SkillEditModal.tsx
"use client";

import { memo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SkillsType, updateSkill } from "../action";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { skillSchema, SkillSchemaType } from "../schema";
import DialogWrapper from "../../_components/dialog-wrapper";

interface iAppProps {
  isOpen: boolean;
  onClose: () => void;
  skill: SkillsType[0];
}

export const SkillEditModal = memo(function SkillEditModal({
  isOpen,
  onClose,
  skill,
}: iAppProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<SkillSchemaType>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      profileId: skill.profileId,
      skillName: skill.skillName,
      level: skill.level || undefined,
    },
  });

  const level = watch("level");

  const onSubmit = async (data: SkillSchemaType) => {
    try {
      const result = await updateSkill(skill.id, {
        skillName: data.skillName,
        level: data.level,
      });

      if (result.success) {
        toast.success("Skill updated successfully");
        onClose();
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Failed to update skill");
    }
  };

  if (!isOpen) return null;

  return (
    <DialogWrapper
      isOpen={isOpen}
      noAutoClose={isDirty}
      onOpenChange={onClose}
      title="Edit Skill"
      key="edit-skill"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Skill Name */}
        <div className="space-y-2">
          <Label htmlFor="skillName">
            Skill Name <span className="required-field">*</span>
          </Label>
          <Input
            id="skillName"
            {...register("skillName")}
            placeholder="e.g. React, Node.js, Python"
          />
          {errors.skillName && (
            <p className="text-xs text-red-600 mt-1">
              {errors.skillName.message}
            </p>
          )}
        </div>

        {/* Skill Level */}
        <div className="space-y-2">
          <Label htmlFor="level">Skill Level</Label>
          <Select
            value={level}
            onValueChange={(value) =>
              setValue("level", value as "beginner" | "intermediate" | "expert")
            }
          >
            <SelectTrigger className="w-full cursor-pointer">
              <SelectValue placeholder="Select skill level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="expert">Expert</SelectItem>
            </SelectContent>
          </Select>
          {errors.level && (
            <p className="text-xs text-red-600 mt-1">{errors.level.message}</p>
          )}
        </div>

        {/* User Info (Read-only) */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <p className="text-sm text-gray-600">User</p>
          <p className="font-medium text-gray-900">{skill.profile.user.name}</p>
          <p className="text-xs text-gray-500">{skill.profile.user.email}</p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Update Skill"}
          </Button>
        </div>
      </form>
    </DialogWrapper>
  );
});
