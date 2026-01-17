"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { categoryTableHeaders } from "@/app/(authenticated)/config";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Ban, MoreHorizontal, NotebookTabs } from "lucide-react";
import { getValue } from "@/app/(authenticated)/utils";
import { useState } from "react";
import { AlertModal } from "../../_components/alert-modal";
import { CategoryType, deleteCategory } from "../actions";

interface iAppProps {
  categories: CategoryType[];
  limit: number;
  page: number;
  search?: string;
}

export function CategoryTable({ categories, limit, page, search }: iAppProps) {
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(
    null
  );

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-200 pointer-events-none">
            {categoryTableHeaders.map((item, idx) => (
              <TableHead
                key={item.label + "-" + idx}
                className={cn("", item.classname)}
              >
                {item.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.length > 0 ? (
            categories.map((cat: CategoryType, idx: number) => (
              <TableRow key={idx + "-" + cat.id}>
                {categoryTableHeaders.map((header) => {
                  let value: React.ReactNode;

                  if (header.key === "sn") {
                    value = (page - 1) * limit + (idx + 1);
                  } else if (header.key === "actions") {
                    value = (
                      <DropdownMenu
                        open={openDropdownId === cat.id}
                        onOpenChange={(open) => {
                          setOpenDropdownId(open ? cat.id : null);
                        }}
                      >
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="size-8 p-0">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onSelect={(e) => {
                              e.preventDefault();
                              setSelectedCategory(cat);
                              setOpenDropdownId(null); // Close dropdown
                            }}
                          >
                            <NotebookTabs className="size-4" />
                            View Detail
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onSelect={(e) => {
                              e.preventDefault();
                              setSelectedCategory(cat);
                              setOpenDropdownId(null); // Close dropdown
                              setShowDeleteDialog(true);
                            }}
                          >
                            <Ban className="size-4" />
                            Block
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    );
                  } else {
                    value = getValue(cat, header.key);
                  }

                  return (
                    <TableCell
                      key={header.key + "-" + idx}
                      className={cn("text-left", header.classname)}
                    >
                      {value || "-"}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell className="p-4 italic" colSpan={5}>
                No result found for {search}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Delete Dialog */}
      {selectedCategory && showDeleteDialog && (
        <AlertModal
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          action={async () => {
            await deleteCategory(selectedCategory.id);
            setShowDeleteDialog(false);
            setSelectedCategory(null);
          }}
          description="This action cannot be undone. This will delete the category information completely from our records. You cannot retrieve it later."
          mainText="Are you sure you want to delete this category?"
        />
      )}
    </>
  );
}
