"use client";

import { Card, CardContent } from "@/components/ui/card";
import React from "react";

interface EmptyStateProps {
  search?: string;
  AddButton: React.FC;
}

export default function EmptyState({ search, AddButton }: EmptyStateProps) {
  return (
    <Card className="flex flex-col items-center justify-center p-10 text-center space-y-4 border-dashed border-gray-300">
      <CardContent className="flex flex-col items-center justify-center space-y-4">
        <p className="text-lg font-medium text-gray-700">
          No entries found{search ? ` for "${search}".` : "."}
        </p>
        <p className="text-sm text-gray-500">
          Start by adding a new entry to get things going.
        </p>
        <AddButton />
      </CardContent>
    </Card>
  );
}
