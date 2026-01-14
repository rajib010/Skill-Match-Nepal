"use client";

import React, { useState } from "react";
import ShowFormButton from "../../_components/show-form-button";

export default function AddFaqButton() {
  const [showFaqForm, setShowFaqForm] = useState(false);
  return (
    <ShowFormButton
      name="FAQ"
      showForm={showFaqForm}
      setShowForm={setShowFaqForm}
      Component={}
      selectedItem={null}
    />
  );
}
