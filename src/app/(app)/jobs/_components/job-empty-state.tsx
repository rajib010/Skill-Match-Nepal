"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Icon } from "@tabler/icons-react";

interface JobEmptyStateProps {
  icon: Icon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

export function JobEmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
}: JobEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 max-w-md mb-4">{description}</p>
      {actionLabel && actionHref && (
        <Button asChild>
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      )}
    </div>
  );
}
