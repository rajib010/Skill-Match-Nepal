"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown, Clock, Eye, X } from "lucide-react";
import { updateApplicationStatus } from "../actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface StatusUpdateDropdownProps {
  applicationId: string;
  currentStatus: string;
}

const statusOptions = [
  {
    value: "pending",
    label: "Pending",
    icon: Clock,
  },
  {
    value: "reviewed",
    label: "Reviewed",
    icon: Eye,
  },
  {
    value: "accepted",
    label: "Accepted",
    icon: Check,
  },
  {
    value: "rejected",
    label: "Rejected",
    icon: X,
  },
];

export default function StatusUpdateDropdown({
  applicationId,
  currentStatus,
}: StatusUpdateDropdownProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  const currentStatusOption = statusOptions.find(
    (option) => option.value === currentStatus.toLowerCase(),
  );

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === currentStatus.toLowerCase()) {
      return;
    }

    setIsUpdating(true);

    try {
      const result = await updateApplicationStatus(applicationId, newStatus);

      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("An error occurred while updating the status");
    } finally {
      setIsUpdating(false);
    }
  };

  const CurrentIcon = currentStatusOption?.icon || Clock;
  const isAccepted = currentStatus.toLowerCase() === "accepted";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          disabled={isUpdating || isAccepted}
          className={`min-w-[180px] justify-between ${isAccepted ? "opacity-60 cursor-not-allowed" : ""}`}
          title={isAccepted ? "Status locked - Application accepted" : ""}
        >
          <span className="flex items-center gap-2">
            <CurrentIcon className={`h-4 w-4`} />
            <span>
              {isUpdating
                ? "Updating..."
                : isAccepted
                  ? "Accepted"
                  : currentStatusOption?.label || "Update Status"}
            </span>
          </span>
          {!isAccepted && <ChevronDown className="h-4 w-4 ml-2" />}
        </Button>
      </DropdownMenuTrigger>
      {!isAccepted && (
        <DropdownMenuContent align="end" className="w-[180px]">
          {statusOptions.map((option) => {
            const Icon = option.icon;
            const isCurrentStatus = option.value === currentStatus.toLowerCase();

            return (
              <DropdownMenuItem
                key={option.value}
                onClick={() => handleStatusChange(option.value)}
                className={`${
                  isCurrentStatus ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isCurrentStatus}
              >
                <Icon className={`h-4 w-4 mr-2 `} />
                <span>{option.label}</span>
                {isCurrentStatus && (
                  <Check className="h-4 w-4 ml-auto text-gray-600" />
                )}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  );
}
