import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(dateObj);
}

type ApplicationStatus = "pending" | "reviewed" | "accepted" | "rejected";

export function getStatusColor(status: ApplicationStatus) {
  switch (status) {
    case "pending":
      return {
        text: "text-gray-600",
        bg: "bg-gray-100",
      };

    case "reviewed":
      return {
        text: "text-primary",
        bg: "bg-primary/10",
      };

    case "accepted":
      return {
        text: "text-green-600",
        bg: "bg-green-100",
      };

    case "rejected":
      return {
        text: "text-red-600",
        bg: "bg-red-100",
      };

    default:
      return {
        text: "text-gray-600",
        bg: "bg-gray-100",
      };
  }
}