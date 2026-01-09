"use client";

import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import React, { useState } from "react";
import ManageTestimonialForm from "./TestimonialForm";

export default function AddTestimonialButton() {
  const [showTestimonailForm, setShowTestimonialForm] = useState(false);
  return (
    <>
      <Button onClick={() => setShowTestimonialForm(true)}>
        <PlusIcon />
        Add Testimonial
      </Button>

      {showTestimonailForm && (
        <ManageTestimonialForm
          open={showTestimonailForm}
          onClose={() => setShowTestimonialForm((p) => !p)}
          selectedTestimonial={null}
        />
      )}
    </>
  );
}
