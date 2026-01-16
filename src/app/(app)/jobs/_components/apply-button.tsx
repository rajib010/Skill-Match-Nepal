"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { IconSend, IconCheck } from "@tabler/icons-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { applyForJob } from "../actions";

interface iAppProps {
  jobId: string;
  userId: string;
  hasApplied?: boolean;
}

export function ApplyButton({ jobId, userId, hasApplied = false }: iAppProps) {
  const [isApplying, setIsApplying] = useState(false);
  const [applied, setApplied] = useState(hasApplied);
  const router = useRouter();

  const handleApply = async () => {
    setIsApplying(true);

    try {
      const result = await applyForJob(jobId, userId);

      if (result.success) {
        toast.success(result.message);
        setApplied(true);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setIsApplying(false);
    }
  };

  if (applied) {
    return (
      <Button size="lg" disabled className="w-full">
        <IconCheck className="w-4 h-4 mr-2" />
        Application Submitted
      </Button>
    );
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="lg" className="w-full" disabled={isApplying}>
          <IconSend className="w-4 h-4 mr-2" />
          {isApplying ? "Applying..." : "Apply Now"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Application</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to apply for this job? Your profile
            information and skills will be submitted to the employer. You can
            only apply once per job posting.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleApply} disabled={isApplying}>
            {isApplying ? "Submitting..." : "Confirm Application"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
