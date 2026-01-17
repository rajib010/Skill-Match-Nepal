"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";

interface AlertModalProps {
  className?: string;
  children?: React.ReactNode;
  mainText: string;
  description: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action: (params?: any) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  actionText?: string;
  cancelText?: string;
}

export function AlertModal({
  mainText,
  description,
  action,
  open,
  onOpenChange,
  variant = "destructive",
  actionText = "Continue",
  cancelText = "Cancel",
}: AlertModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await action();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog
      open={open}
      onOpenChange={(isOpen) => {
        if (isLoading) return;
        if (onOpenChange) {
          onOpenChange(isOpen);
        }
      }}
    >
      <AlertDialogContent
        onEscapeKeyDown={(e) => isLoading && e.preventDefault()}
      >
        <AlertDialogHeader>
          <AlertDialogTitle>{mainText}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading} className="cursor-pointer">
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            className={buttonVariants({ variant })}
            disabled={isLoading}
            onClick={handleAction}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              actionText
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
