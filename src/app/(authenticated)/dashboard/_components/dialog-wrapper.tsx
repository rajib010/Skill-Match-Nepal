"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface iAppProps {
  isOpen: boolean;
  onOpenChange: () => void;
  noAutoClose: boolean; //don't close on outside interaction
  title: string;
  children: React.ReactNode;
}

function DialogWrapper({
  isOpen,
  onOpenChange,
  noAutoClose,
  title,
  children,
}: iAppProps) {
  return (
    <Dialog open={isOpen} modal onOpenChange={onOpenChange}>
      <DialogContent
        onInteractOutside={(e) => {
          if (noAutoClose) {
            e.preventDefault();
            return;
          }
        }}
        onEscapeKeyDown={(e) => {
          if (noAutoClose) {
            e.preventDefault();
            return;
          }
        }}
        className="!w-[700px] !max-w-[700px] max-h-[90vh] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {children}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default DialogWrapper;
