"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface iAppProps {
  isOpen: boolean;
  onOpenChange: () => void;
  noAutoClose: boolean; //don't close on outside interaction
  title: string;
  children: React.ReactNode;
  description?:string
}

function DialogWrapper({
  isOpen,
  onOpenChange,
  noAutoClose,
  title,
  description,
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
          {description && <DialogDescription>{description}</DialogDescription>}
          {children}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default DialogWrapper;
