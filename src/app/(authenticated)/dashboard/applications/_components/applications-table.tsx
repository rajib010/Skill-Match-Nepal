"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { applicationTableHeaders } from "@/app/(authenticated)/config";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, NotebookTabs } from "lucide-react";
import { getValue } from "@/app/(authenticated)/utils";
import { useState } from "react";
import { AlertModal } from "../../_components/alert-modal";
import { ApplicationType, deleteApplication } from "../actions";

interface iAppProps {
  applications: ApplicationType[];
  limit: number;
  page: number;
  search?: string;
}

export function ApplicationTable({ applications, limit, page, search }: iAppProps) {
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<ApplicationType | null>(
    null
  );

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-200 pointer-events-none">
            {applicationTableHeaders.map((item, idx) => (
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
          {applications.length > 0 ? (
            applications.map((app: ApplicationType, idx: number) => (
              <TableRow key={idx + "-" + app.id}>
                {applicationTableHeaders.map((header) => {
                  let value: React.ReactNode;

                  if (header.key === "sn") {
                    value = (page - 1) * limit + (idx + 1);
                  } else if (header.key === "actions") {
                    value = (
                      <DropdownMenu
                        open={openDropdownId === app.id}
                        onOpenChange={(open) => {
                          setOpenDropdownId(open ? app.id : null);
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
                              setSelectedApplication(app);
                              setOpenDropdownId(null); // Close dropdown
                            }}
                          >
                            <NotebookTabs className="size-4" />
                            View Detail
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    );
                  } else {
                    value = getValue(app, header.key);
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
      {selectedApplication && showDeleteDialog && (
        <AlertModal
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          action={async () => {
            await deleteApplication(selectedApplication.id);
            setShowDeleteDialog(false);
            setSelectedApplication(null);
          }}
          description="This action cannot be undone. This will delete the application information completely from our records. You cannot retrieve it later."
          mainText="Are you sure you want to delete this application?"
        />
      )}
    </>
  );
}
