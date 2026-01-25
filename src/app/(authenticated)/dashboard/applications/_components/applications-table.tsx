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
import { MoreHorizontal, Trash2Icon, User2Icon } from "lucide-react";
import { getValue } from "@/app/(authenticated)/utils";
import { useState } from "react";
import { AlertModal } from "../../_components/alert-modal";
import { ApplicationType, deleteApplication } from "../actions";
import { UserDetailModal } from "../../users/_components/UserDetailModal";
import { useRouter } from "next/navigation";

interface iAppProps {
  applications: ApplicationType[];
  limit: number;
  page: number;
  search?: string;
}

type DialogState = {
  type: "detail" | "delete" | null;
  open: boolean;
};

export function ApplicationTable({
  applications,
  limit,
  page,
  search,
}: iAppProps) {
  const router = useRouter();
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState<DialogState>({
    type: null,
    open: false,
  });
  const [selectedApplication, setSelectedApplication] =
    useState<ApplicationType | null>(null);

  const handleCloseModal = () => {
    setOpenModal({ type: null, open: false });
    setSelectedApplication(null);
  };

  const handleOpenDetailModal = (app: ApplicationType, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedApplication(app);
    setOpenModal({ type: "detail", open: true });
    setOpenDropdownId(null);
  };

  const handleOpenDeleteModal = (app: ApplicationType, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedApplication(app);
    setOpenModal({ type: "delete", open: true });
    setOpenDropdownId(null);
  };

  const handleDeleteConfirm = async () => {
    if (selectedApplication) {
      await deleteApplication(selectedApplication.id);
      handleCloseModal();
    }
  };

  const handleApplicationNavigate = (id: string) => {
    if (!id) return;
    return router.replace(`/dashboard/applications/${id}`);
  };

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
              <TableRow
                key={idx + "-" + app.id}
                onClick={() => handleApplicationNavigate(app.id)}
                className="cursor-pointer"
              >
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
                          <Button
                            onClick={(e) => e.stopPropagation()}
                            variant="ghost"
                            className="size-8 p-0"
                          >
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <DropdownMenuItem
                            onClick={(e) => {
                              handleOpenDetailModal(app, e); // Close dropdown
                            }}
                          >
                            <User2Icon className="size-4" />
                            User Detail
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              handleOpenDeleteModal(app, e);
                            }}
                          >
                            <Trash2Icon className="size-4" /> Delete
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
      {selectedApplication && openModal.type === "delete" && (
        <AlertModal
          open={openModal.open}
          onOpenChange={(open) => {
            if (!open) handleCloseModal();
          }}
          action={handleDeleteConfirm}
          description="This action cannot be undone. This will delete the application information completely from our records. You cannot retrieve it later."
          mainText="Are you sure you want to delete this application?"
        />
      )}

      {/* Show user detail */}
      {selectedApplication?.user && openModal.type === "detail" && (
        <UserDetailModal
          isOpen={openModal.open}
          onClose={handleCloseModal}
          user={selectedApplication?.user}
        />
      )}
    </>
  );
}
