import React from "react";

//extract values for table headers
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getValue(obj: any, path: string) {
  return path.split(".").reduce((acc, part) => acc?.[part], obj);
}

export const handleNumberScroll: React.WheelEventHandler<HTMLInputElement> = (e) => {
  // Prevent value from changing on scroll
  e.currentTarget.blur();
};