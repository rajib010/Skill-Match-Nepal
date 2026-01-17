"use client";

import React, { useState } from "react";
import ShowFormButton from "../../_components/show-form-button";
import CategoryForm from "./category-form";

export default function AddCategoryButton() {
  const [showForm, setShowForm] = useState(false);

  return (
    <ShowFormButton
      name="Category"
      showForm={showForm}
      setShowForm={setShowForm}
      Component={CategoryForm}
      selectedItem={null}
    />
  );
}
