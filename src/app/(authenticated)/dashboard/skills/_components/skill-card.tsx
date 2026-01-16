// skills/SkillCards.tsx
"use client";

import { deleteSkill, SkillsType } from "../action";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  IconDotsVertical,
  IconEdit,
  IconTrash,
  IconUser,
  IconBrain,
  IconCalendar,
  IconTrophy,
} from "@tabler/icons-react";
import { useCallback, useState } from "react";
import { AlertModal } from "../../_components/alert-modal";
import { cn, formatDate } from "@/lib/utils";
import { SkillDetailModal } from "./skill-detail-modal";
import { SkillEditModal } from "./skill-edit-modal";

interface iAppProps {
  skills: SkillsType[];
  search?: string;
}

export function SkillCards({ skills, search }: iAppProps) {
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedSkill, setSelectedSkill] = useState<SkillsType[0] | null>(
    null
  );

  const handleCloseDetail = useCallback(() => {
    setIsDetailModalOpen(false);
  }, []);

  const handleCloseEdit = useCallback(() => {
    setIsEditModalOpen(false);
  }, []);

  if (skills.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <IconBrain className="w-12 h-12 text-gray-400 mb-3" />
        <p className="text-gray-600 text-lg font-medium">No skills found</p>
        {search && (
          <p className="text-gray-400 text-sm mt-1">
            Try adjusting your search term
          </p>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {skills.map((skill) => (
          <div
            key={skill.id}
            className="bg-white border rounded-lg p-5 hover:shadow-md transition-shadow relative"
          >
            {/* Dropdown Menu */}
            <div className="absolute top-4 right-4">
              <DropdownMenu
                open={openDropdownId === skill.id}
                onOpenChange={(open) => {
                  setOpenDropdownId(open ? skill.id : null);
                }}
              >
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <IconDotsVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onSelect={(e) => {
                      e.preventDefault();
                      setSelectedSkill(skill);
                      setOpenDropdownId(null);
                      setIsDetailModalOpen(true);
                    }}
                  >
                    <IconBrain className="h-4 w-4" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={(e) => {
                      e.preventDefault();
                      setSelectedSkill(skill);
                      setOpenDropdownId(null);
                      setIsEditModalOpen(true);
                    }}
                  >
                    <IconEdit className="h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-600"
                    onSelect={(e) => {
                      e.preventDefault();
                      setSelectedSkill(skill);
                      setOpenDropdownId(null);
                      setIsDeleteModalOpen(true);
                    }}
                  >
                    <IconTrash className="h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Skill Level Badge */}
            <div className="mb-3">
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

            {/* Skill Name */}
            <h3 className="text-lg font-semibold text-gray-900 mb-3 pr-8 line-clamp-2">
              {skill.skillName}
            </h3>

            {/* User Info */}
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-3 pb-3 border-b">
              <IconUser className="w-4 h-4" />
              <span className="truncate">{skill.profile.user.name}</span>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-1.5">
                <IconCalendar className="w-3.5 h-3.5" />
                <span>Added {formatDate(skill.createdAt)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Dialog */}
      {selectedSkill && isDeleteModalOpen && (
        <AlertModal
          open={isDeleteModalOpen}
          onOpenChange={setIsDeleteModalOpen}
          action={async () => {
            await deleteSkill(selectedSkill.id);
            setIsDeleteModalOpen(false);
            setSelectedSkill(null);
          }}
          description="This action cannot be undone. This will delete the skill from the user's profile."
          mainText="Are you sure you want to delete this skill?"
        />
      )}

      {/* Detail Modal */}
      {selectedSkill && isDetailModalOpen && (
        <SkillDetailModal
          isOpen={isDetailModalOpen}
          onClose={handleCloseDetail}
          skill={selectedSkill}
        />
      )}

      {/* Edit Modal */}
      {selectedSkill && isEditModalOpen && (
        <SkillEditModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEdit}
          skill={selectedSkill}
        />
      )}
    </>
  );
}
