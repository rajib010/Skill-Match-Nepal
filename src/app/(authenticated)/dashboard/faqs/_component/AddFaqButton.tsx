"use client";

import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import React, { useState } from "react";
import ManageFaqForm from "./ManageFaqForm";

export default function AddFaqButton() {
  const [showFaqForm, setShowFaqForm] = useState(false);
  return (
    <>
      <Button onClick={() => setShowFaqForm(true)}>
        <PlusIcon />
        Add Faq
      </Button>

      {showFaqForm && (
        <ManageFaqForm
          open={showFaqForm}
          onClose={() => setShowFaqForm((p) => !p)}
          selectedFaq={null}
        />
      )}
    </>
  );
}
