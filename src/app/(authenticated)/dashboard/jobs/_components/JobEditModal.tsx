"use client";

import { memo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { JobsType, updateJob } from "../action";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { IconPlus, IconX } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { RequirementType } from "./JobDetailModal";
import { jobSchema, JobSchemaType } from "../schema";

interface Requirement {
  skillName: string;
  required: boolean;
}

interface iAppProps {
  isOpen: boolean;
  onClose: () => void;
  job: JobsType;
}

export const JobEditModal = memo(function JobEditModal({
  isOpen,
  onClose,
  job,
}: iAppProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requirements, setRequirements] = useState<Requirement[]>(
    job.requirements.map((r:RequirementType) => ({
      skillName: r.skillName,
      required: r.required,
    }))
  );
  const [newSkill, setNewSkill] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<JobSchemaType>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: job.title,
      description: job.description,
      company: job.company,
      location: job.location,
      salary: job.salary || "",
      jobType: job.jobType,
      isActive: job.isActive,
    },
  });

  const jobType = watch("jobType");
  const isActive = watch("isActive");

  const addRequirement = () => {
    if (
      newSkill.trim() &&
      !requirements.find((r) => r.skillName === newSkill.trim())
    ) {
      setRequirements([
        ...requirements,
        { skillName: newSkill.trim(), required: true },
      ]);
      setNewSkill("");
    }
  };

  const removeRequirement = (skillName: string) => {
    setRequirements(requirements.filter((r) => r.skillName !== skillName));
  };

  const toggleRequired = (skillName: string) => {
    setRequirements(
      requirements.map((r) =>
        r.skillName === skillName ? { ...r, required: !r.required } : r
      )
    );
  };

  const onSubmit = async (data: JobSchemaType) => {
    if (requirements.length === 0) {
      toast.error("Please add at least one skill requirement");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await updateJob(job.id, {
        ...data,
        requirements,
      });

      if (result.success) {
        toast.success("Job updated successfully");
        onClose();
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Failed to update job");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!w-[700px] !max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Job</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Title */}
          <div className="space-y-4">
            <Label htmlFor="title">
              Job Title <span className="required-field">*</span>
            </Label>
            <Input
              id="title"
              {...register("title")}
              placeholder="e.g. Senior Frontend Developer"
            />
            {errors.title && (
              <p className="text-xs text-red-600 mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Company */}
          <div className="space-y-4">
            {" "}
            <Label htmlFor="company">
              Company <span className="required-field">*</span>
            </Label>
            <Input
              id="company"
              {...register("company")}
              placeholder="e.g. Tech Corp"
            />
            {errors.company && (
              <p className="text-xs text-red-600 mt-1">
                {errors.company.message}
              </p>
            )}
          </div>

          {/* Location & Job Type */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              {" "}
              <Label htmlFor="location">
                Location <span className="required-field">*</span>
              </Label>
              <Input
                id="location"
                {...register("location")}
                placeholder="e.g. Kathmandu"
              />
              {errors.location && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.location.message}
                </p>
              )}
            </div>

            <div className="space-y-4">
              {" "}
              <Label htmlFor="jobType">
                Job Type <span className="required-field">*</span>
              </Label>
              <Select
                value={jobType}
                onValueChange={(value) => setValue("jobType", value as string)}
              >
                <SelectTrigger className="w-full cursor-pointer">
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full Time</SelectItem>
                  <SelectItem value="part-time">Part Time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Salary */}
          <div className="space-y-4">
            {" "}
            <Label htmlFor="salary">Salary (Optional)</Label>
            <Input
              id="salary"
              {...register("salary")}
              placeholder="e.g. Rs. 50,000 - 80,000"
            />
          </div>

          {/* Description */}
          <div className="space-y-4">
            {" "}
            <Label htmlFor="description">
              Description <span className="required-field">*</span>
            </Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Job description..."
              rows={5}
            />
            {errors.description && (
              <p className="text-xs text-red-600 mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Status */}
          <div className="flex items-center justify-between">
            <div className="space-y-4">
              {" "}
              <Label htmlFor="isActive">
                Job Status <span className="required-field">*</span>
              </Label>
              <p className="text-xs text-gray-500">
                Active jobs are visible to candidates
              </p>
            </div>
            <Switch
              id="isActive"
              checked={isActive}
              onCheckedChange={(checked) => setValue("isActive", checked)}
            />
          </div>

          {/* Requirements */}
          <div className="space-y-4">
            {" "}
            <Label>
              Skills Required <span className="required-field">*</span>
            </Label>
            <div className="flex gap-2 mt-2">
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add a skill..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addRequirement();
                  }
                }}
              />
              <Button type="button" onClick={addRequirement} size="icon">
                <IconPlus className="h-4 w-4" />
              </Button>
            </div>
            {requirements.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {requirements.map((req) => (
                  <div
                    key={req.skillName}
                    className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border rounded-md"
                  >
                    <span className="text-sm">{req.skillName}</span>
                    <Badge
                      variant={req.required ? "default" : "secondary"}
                      className="text-xs cursor-pointer"
                      onClick={() => toggleRequired(req.skillName)}
                    >
                      {req.required ? "Required" : "Preferred"}
                    </Badge>
                    <button
                      type="button"
                      onClick={() => removeRequirement(req.skillName)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <IconX className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Job"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
});
