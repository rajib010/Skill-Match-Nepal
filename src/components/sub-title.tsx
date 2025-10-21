"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type As = React.ElementType;

type SubTitleProps<T extends As = "div"> = {
  title: React.ReactNode;
  className?: string;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "children">;

export default function SubTitle<T extends As = "div">({
  title,
  className,
}: SubTitleProps<T>) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-4 py-2",
        "border-[#656565] text-[#656565] font-poppins",
        className
      )}
    >
      {title}
    </div>
  );
}
