// skills/SkillDetailModal.tsx
"use client";

import { memo } from "react";
import { Badge } from "@/components/ui/badge";
import {
  IconUser,
  IconMail,
  IconCalendar,
  IconTrophy,
  IconBrain,
} from "@tabler/icons-react";
import { SkillsType } from "../action";
import { formatDate } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import DialogWrapper from "../../_components/dialog-wrapper";
import { cn } from "@/lib/utils";

interface iAppProps {
  isOpen: boolean;
  onClose: () => void;
  skill: SkillsType[0];
}

export const SkillDetailModal = memo(function SkillDetailModal({
  isOpen,
  onClose,
  skill,
}: iAppProps) {
  if (!isOpen) return null;

  return (
    <DialogWrapper
      isOpen={isOpen}
      onOpenChange={onClose}
      noAutoClose={false}
      title="Skill Details"
      key="skill-detail"
    >
      <div className="space-y-6">
        {/* Skill Name & Level */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-5 rounded-lg">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <IconBrain className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-bold text-gray-900">
                {skill.skillName}
              </h3>
            </div>
            <Badge
              variant={
                skill.level === "expert"
                  ? "default"
                  : skill.level === "intermediate"
                  ? "secondary"
                  : "outline"
              }
              className={cn(
                "text-xs capitalize",
                skill.level === "expert" && "bg-green-500 hover:bg-green-600",
                skill.level === "intermediate" &&
                  "bg-blue-500 hover:bg-blue-600"
              )}
            >
              <IconTrophy className="w-3 h-3 mr-1" />
              {skill.level || "Not specified"}
            </Badge>
          </div>
        </div>

        {/* User Information */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
            <IconUser className="w-4 h-4" />
            User Information
          </h4>
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage
                  src={skill.profile.user.image || ""}
                  alt={skill.profile.user.name}
                />
                <AvatarFallback>
                  {skill.profile.user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-gray-900">
                  {skill.profile.user.name}
                </p>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <IconMail className="w-3.5 h-3.5" />
                  {skill.profile.user.email}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Timestamps */}
        <div className="space-y-3 pt-4 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 flex items-center gap-2">
              <IconCalendar className="w-4 h-4" />
              Added on
            </span>
            <span className="font-medium text-gray-900">
              {formatDate(skill.createdAt)}
            </span>
          </div>
        </div>

        {/* Profile ID (for reference) */}
        <div className="bg-gray-50 rounded p-3 text-xs text-gray-500">
          <span className="font-medium">Profile ID:</span> {skill.profileId}
        </div>
      </div>
    </DialogWrapper>
  );
});
