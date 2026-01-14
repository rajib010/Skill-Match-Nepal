"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ListFilter } from "lucide-react";
import Link from "next/link";

type SortField = {
  label: string; 
  key: string; 
  options?: {
    asc?: string; // custom label for ascending
    desc?: string; // custom label for descending
  };
};



type DropDownFilterProps = {
  search?: string;
  sortField?: string;
  sortOrder?: "asc" | "desc";
  fields: SortField[];
};

export default function DropDownFilter({
  search,
  sortField,
  sortOrder = "desc",
  fields,
}: DropDownFilterProps) {
  const buildHref = (key: string, order: "asc" | "desc") =>
    `?sortField=${key}&sort=${order}${search ? `&search=${search}` : ""}`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <ListFilter className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48" align="center">
        <DropdownMenuLabel className="text-center">Sort By</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {fields.map((field) => (
            <div key={field.key}>
              {/* Ascending */}
              <Link href={buildHref(field.key, "asc")}>
                <DropdownMenuItem>
                  {field.options?.asc ?? `${field.label} Asc`}
                  {sortField === field.key && sortOrder === "asc" && " ✓"}
                </DropdownMenuItem>
              </Link>

              {/* Descending */}
              <Link href={buildHref(field.key, "desc")}>
                <DropdownMenuItem>
                  {field.options?.desc ?? `${field.label} Desc`}
                  {sortField === field.key && sortOrder === "desc" && " ✓"}
                </DropdownMenuItem>
              </Link>

              <DropdownMenuSeparator />
            </div>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
