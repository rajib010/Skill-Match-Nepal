"use client";

import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import React from "react";

type FormComponentProps<T> = {
  open: boolean;
  onClose: () => void;
  selectedItem: T | null;
};

interface iAppProps<T> {
  name: string;
  Component: React.ComponentType<FormComponentProps<T>>;
  showForm: boolean;
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
  selectedItem: T | null;
}

export default function ShowFormButton<T>({
  name,
  Component,
  showForm,
  setShowForm,
  selectedItem,
}: iAppProps<T>) {
  return (
    <>
      <Button onClick={() => setShowForm(true)}>
        <PlusIcon />
        Add {name}
      </Button>

      {showForm && (
        <Component
          open={showForm}
          onClose={() => setShowForm((p) => !p)}
          selectedItem={selectedItem}
        />
      )}
    </>
  );
}
