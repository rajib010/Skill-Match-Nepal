// skills/SkillAddModal.tsx
"use client";

import { useState, useEffect } from "react";
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
import { createSkill } from "../action";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { skillSchema, SkillSchemaType } from "../schema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IconPlus, IconX } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";

interface UserProfile {
  id: string;
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface iAppProps {
  isOpen: boolean;
  onClose: () => void;
  profiles: UserProfile[];
}

export function SkillAddModal({ isOpen, onClose, profiles }: iAppProps) {
  const [selectedProfileId, setSelectedProfileId] = useState<string>("");
  const [skills, setSkills] = useState<
    Array<{ skillName: string; level?: string }>
  >([]);
  const [newSkill, setNewSkill] = useState("");
  const [newLevel, setNewLevel] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedProfile = profiles.find((p) => p.id === selectedProfileId);

  const addSkillToList = () => {
    if (
      newSkill.trim() &&
      !skills.find((s) => s.skillName === newSkill.trim())
    ) {
      setSkills([...skills, { skillName: newSkill.trim(), level: newLevel }]);
      setNewSkill("");
      setNewLevel(undefined);
    }
  };

  const removeSkill = (skillName: string) => {
    setSkills(skills.filter((s) => s.skillName !== skillName));
  };

  const handleSubmit = async () => {
    if (!selectedProfileId) {
      toast.error("Please select a user profile");
      return;
    }

    if (skills.length === 0) {
      toast.error("Please add at least one skill");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create skills one by one
      let successCount = 0;
      let errorCount = 0;

      for (const skill of skills) {
        const result = await createSkill({
          profileId: selectedProfileId,
          skillName: skill.skillName,
          level: skill.level,
        });

        if (result.success) {
          successCount++;
        } else {
          errorCount++;
        }
      }

      if (successCount > 0) {
        toast.success(`${successCount} skill(s) added successfully`);
      }
      if (errorCount > 0) {
        toast.error(`${errorCount} skill(s) failed to add`);
      }

      if (successCount > 0) {
        onClose();
        setSelectedProfileId("");
        setSkills([]);
      }
    } catch {
      toast.error("Failed to add skills");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      setSelectedProfileId("");
      setSkills([]);
      setNewSkill("");
      setNewLevel(undefined);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Skills</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Select User Profile */}
          <div className="space-y-2">
            <Label htmlFor="profile">
              Select User <span className="required-field">*</span>
            </Label>
            <Select
              value={selectedProfileId}
              onValueChange={setSelectedProfileId}
            >
              <SelectTrigger className="w-full cursor-pointer">
                <SelectValue placeholder="Select a user" />
              </SelectTrigger>
              <SelectContent>
                {profiles.map((profile) => (
                  <SelectItem key={profile.id} value={profile.id}>
                    {profile.user.name} ({profile.user.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Selected Profile Info */}
          {selectedProfile && (
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Adding skills for:</p>
              <p className="font-medium text-gray-900">
                {selectedProfile.user.name}
              </p>
              <p className="text-xs text-gray-500">
                {selectedProfile.user.email}
              </p>
            </div>
          )}

          {/* Add Skill Input */}
          <div className="space-y-2">
            <Label>
              Add Skills <span className="required-field">*</span>
            </Label>
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Enter skill name..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSkillToList();
                    }
                  }}
                />
              </div>
              <Select
                value={newLevel}
                onValueChange={(value) => setNewLevel(value)}
              >
                <SelectTrigger className="w-[140px] cursor-pointer">
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="expert">Expert</SelectItem>
                </SelectContent>
              </Select>
              <Button type="button" onClick={addSkillToList} size="icon">
                <IconPlus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Skills List */}
          {skills.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm text-gray-600">
                Skills to be added ({skills.length})
              </Label>
              <div className="max-h-[200px] overflow-y-auto space-y-2 border rounded-lg p-3 bg-gray-50">
                {skills.map((skill) => (
                  <div
                    key={skill.skillName}
                    className="flex items-center justify-between bg-white p-3 rounded-md border"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <span className="font-medium text-gray-900">
                        {skill.skillName}
                      </span>
                      {skill.level && (
                        <Badge variant="outline" className="text-xs capitalize">
                          {skill.level}
                        </Badge>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeSkill(skill.skillName)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <IconX className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : `Add ${skills.length} Skill(s)`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
