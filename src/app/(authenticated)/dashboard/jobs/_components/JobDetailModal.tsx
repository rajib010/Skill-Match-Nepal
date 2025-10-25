import { memo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { JobsType } from "../action";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  IconBriefcase,
  IconBuilding,
  IconMapPin,
  IconCurrencyDollar,
  IconClock,
  IconCalendar,
  IconUsers,
  IconFileText,
} from "@tabler/icons-react";

interface iAppProps {
  isOpen: boolean;
  onClose: () => void;
  job: JobsType;
}

export type RequirementType = {
  id: string;
  skillName: string;
  required: boolean;
};

export const JobDetailModal = memo(function JobDetailModal({
  isOpen,
  onClose,
  job,
}: iAppProps) {
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!w-[700px] !max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">Job Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Header */}
          <div>
            <div className="flex items-start justify-between mb-2">
              <h2 className="text-2xl font-semibold text-gray-900">
                {job.title}
              </h2>
              <Badge variant={job.isActive ? "default" : "secondary"}>
                {job.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <IconBuilding className="w-5 h-5" />
              <span className="text-lg">{job.company}</span>
            </div>
          </div>

          <Separator />

          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <IconMapPin className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500">Location</p>
                <p className="text-sm font-medium text-gray-900">
                  {job.location}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <IconClock className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500">Job Type</p>
                <p className="text-sm font-medium text-gray-900 capitalize">
                  {job.jobType.replace("-", " ")}
                </p>
              </div>
            </div>

            {job.salary && (
              <div className="flex items-start gap-3">
                <IconCurrencyDollar className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Salary</p>
                  <p className="text-sm font-medium text-gray-900">
                    {job.salary}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <IconBriefcase className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500">Category</p>
                <p className="text-sm font-medium text-gray-900">
                  {job.category.name}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <IconCalendar className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500">Posted Date</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(job.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {job.expiresAt && (
              <div className="flex items-start gap-3">
                <IconCalendar className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Expires On</p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(job.expiresAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <IconUsers className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500">Applications</p>
                <p className="text-sm font-medium text-gray-900">
                  {job._count.applications}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Description */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <IconFileText className="w-5 h-5 text-gray-400" />
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                Job Description
              </h3>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
              {job.description}
            </p>
          </div>

          {/* Requirements */}
          {job.requirements.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
                  Skills Required ({job.requirements.length})
                </h3>
                <div className="space-y-2">
                  {job.requirements.map((req: RequirementType) => (
                    <div
                      key={req.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                    >
                      <span className="text-sm font-medium text-gray-900">
                        {req.skillName}
                      </span>
                      <Badge
                        variant={req.required ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {req.required ? "Required" : "Preferred"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
});
