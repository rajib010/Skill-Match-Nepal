"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CategoriesType } from "../actions";

interface iAppProps {
  categories: CategoriesType;
}

export function CategoryFilter({ categories }: iAppProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") || "all";

  const handleCategoryChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === "all") {
      params.delete("category");
    } else {
      params.set("category", value);
    }

    // Reset to page 1 when filtering
    params.set("page", "1");

    router.push(`?${params.toString()}`);
  };

  return (
    <Select value={currentCategory} onValueChange={handleCategoryChange}>
      <SelectTrigger className="w-full md:w-[200px] cursor-pointer">
        <SelectValue placeholder="All Categories" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Categories</SelectItem>
        {categories?.map((category) => (
          <SelectItem key={category.id} value={category.id}>
            {category.name} ({category._count.jobs})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
