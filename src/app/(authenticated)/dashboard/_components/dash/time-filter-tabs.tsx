"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface TimeFilterTabsProps {
  currentFilter: string;
}

export default function TimeFilterTabs({ currentFilter }: TimeFilterTabsProps) {
  const pathname = usePathname();

  const filters = [
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
    { value: "yearly", label: "Yearly" },
  ];

  return (
    <div className="flex gap-3 mb-6">
      {filters.map((filter) => (
        <Link
          key={filter.value}
          href={`${pathname}?filter=${filter.value}`}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${
            currentFilter === filter.value
              ? "bg-blue-600 text-white shadow-md"
              : "bg-white text-gray-700 hover:bg-gray-100 shadow"
          }`}
        >
          {filter.label}
        </Link>
      ))}
    </div>
  );
}
