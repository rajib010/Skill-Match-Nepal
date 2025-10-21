import React from "react";

export function formatDate(dateInput: string | Date) {
  const date = new Date(dateInput);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); //month starts from 0
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

//extract values for table headers
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getValue(obj: any, path: string) {
  return path.split(".").reduce((acc, part) => acc?.[part], obj);
}

export const handleNumberScroll: React.WheelEventHandler<HTMLInputElement> = (e) => {
  // Prevent value from changing on scroll
  e.currentTarget.blur();
};