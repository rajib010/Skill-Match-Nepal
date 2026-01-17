"use client";

import { deleteJob, JobsType } from "../action";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  IconBriefcase,
  IconMapPin,
  IconCurrencyDollar,
  IconClock,
  IconDotsVertical,
  IconEdit,
  IconTrash,
  IconEye,
  IconBuilding,
  IconCalendar,
} from "@tabler/icons-react";
import { useCallback, useState } from "react";
import { AlertModal } from "../../_components/alert-modal";
import { JobDetailModal, RequirementType } from "./job-detail-modal";
import { cn, formatDate } from "@/lib/utils";
import { JobEditModal } from "./job-edit-modal";
import { toast } from "sonner";

interface iAppProps {
  jobs: JobsType[];
  search?: string;
}

export function JobCards({ jobs, search }: iAppProps) {
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedJob, setSelectedJob] = useState<JobsType | null>(null);

  const handleCloseDetail = useCallback(() => {
    setIsDetailModalOpen(false);
  }, []);

  const handleCloseEdit = useCallback(() => {
    setIsEditModalOpen(false);
  }, []);

  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <IconBriefcase className="w-12 h-12 text-gray-400 mb-3" />
        <p className="text-gray-600 text-lg font-medium">No jobs found</p>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {jobs.map((job) => (
          <div
            key={job.id}
            className={cn(
              "bg-white border rounded-lg p-5 hover:shadow-md transition-shadow relative",
              !job.isActive && "opacity-60 bg-gray-50"
            )}
          >
            {/* Dropdown Menu */}
            <div className="absolute top-4 right-4">
              <DropdownMenu
                open={openDropdownId === job.id}
                onOpenChange={(open) => {
                  setOpenDropdownId(open ? job.id : null);
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
                      setSelectedJob(job);
                      setOpenDropdownId(null);
                      setIsDetailModalOpen(true);
                    }}
                  >
                    <IconEye className="h-4 w-4" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={(e) => {
                      e.preventDefault();
                      setSelectedJob(job);
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
                      setSelectedJob(job);
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

            {/* Job Status Badge */}
            <div className="mb-3">
              <Badge
                variant={job.isActive ? "default" : "secondary"}
                className="text-xs text-white"
              >
                {job.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>

            {/* Job Title & Company */}
            <h3 className="text-lg font-semibold text-gray-900 mb-1 pr-8 line-clamp-2">
              {job.title}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
              <IconBuilding className="w-4 h-4" />
              <span className="truncate">{job.company}</span>
            </div>

            {/* Location & Job Type */}
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <div className="flex items-center gap-1.5 text-sm text-gray-600">
                <IconMapPin className="w-4 h-4" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-gray-600">
                <IconClock className="w-4 h-4" />
                <span className="capitalize">
                  {job.jobType.replace("-", " ")}
                </span>
              </div>
            </div>

            {/* Salary */}
            {job.salary && (
              <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-3">
                <IconCurrencyDollar className="w-4 h-4" />
                <span>{job.salary}</span>
              </div>
            )}

            {/* Category */}
            <div className="mb-3">
              <Badge variant="outline" className="text-xs">
                {job.category.name}
              </Badge>
            </div>

            {/* Requirements */}
            {job.requirements.length > 0 && (
              <div className="mb-3 h-17">
                <p className="text-xs text-gray-500 mb-2">Required Skills:</p>
                <div className="flex flex-wrap gap-1.5">
                  {job.requirements.slice(0, 3).map((req: RequirementType) => (
                    <Badge
                      key={req.id}
                      variant="secondary"
                      className="text-xs px-2 py-0.5"
                    >
                      {req.skillName}
                    </Badge>
                  ))}
                  {job.requirements.length > 3 && (
                    <Badge variant="secondary" className="text-xs px-2 py-0.5">
                      +{job.requirements.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t text-xs text-gray-500">
              <div className="flex items-center gap-1.5">
                <IconCalendar className="w-3.5 h-3.5" />
                <span>Posted {formatDate(job.createdAt)}</span>
              </div>
              <span>{job._count.applications} applications</span>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Dialog */}
      {selectedJob && isDeleteModalOpen && (
        <AlertModal
          open={isDeleteModalOpen}
          onOpenChange={setIsDeleteModalOpen}
          action={async () => {
            const res = await deleteJob(selectedJob.id);
            if (!res.success) {
              toast.error(res.message);
              return;
            }
            toast.success(res.message);
            setIsDeleteModalOpen(false);
            setSelectedJob(null);
          }}
          description="This action cannot be undone. This will delete the job information completely from our system."
          mainText="Are you sure you want to delete this job?"
        />
      )}

      {/* Detail Modal */}
      {selectedJob && isDetailModalOpen && (
        <JobDetailModal
          isOpen={isDetailModalOpen}
          onClose={handleCloseDetail}
          job={selectedJob}
        />
      )}

      {/* Edit Modal */}
      {selectedJob && isEditModalOpen && (
        <JobEditModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEdit}
          job={selectedJob}
        />
      )}
    </>
  );
}
