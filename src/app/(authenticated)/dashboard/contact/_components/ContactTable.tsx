"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { getValue } from "@/app/(authenticated)/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { contactTableHeaders } from "@/app/(authenticated)/config";
import { ContactType, deleteContact } from "../actions";
import { AlertModal } from "../../_components/alert-modal";

interface iAppProps {
  contacts: ContactType[];
  limit: number;
  page: number;
  search?: string;
}

function ContactTable({ contacts, limit, page, search }: iAppProps) {
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [selectedContact, setSelectedContact] = useState<ContactType | null>(
    null
  );
  const [openRemoveModal, setOpenRemoveModal] = useState(false);

  return (
    <>
      <div className="table-wrapper">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-200 pointer-events-none">
              {contactTableHeaders.map((item, idx) => (
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
            {contacts.length > 0 ? (
              contacts.map((item, idx) => (
                <TableRow
                  key={idx + "-" + item.id}
                  className={cn(
                    item.isDeleted && "bg-red-100 hover:bg-red-200",
                    "cursor-pointer"
                  )}
                >
                  {contactTableHeaders.map((header) => {
                    let value: React.ReactNode;

                    if (header.key === "sn") {
                      value = (page - 1) * limit + (idx + 1);
                    } else if (header.key === "actions") {
                      value = (
                        <DropdownMenu
                          open={openDropdownId === item.id}
                          onOpenChange={(open) => {
                            setOpenDropdownId(open ? item.id : null);
                          }}
                        >
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="size-8 p-0">
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setOpenRemoveModal(true);
                                setSelectedContact(item);
                              }}
                            >
                              <Trash2 className="mr-2 size-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      );
                    } else {
                      value = getValue(item, header.key);
                    }

                    return (
                      <TableCell
                        key={header.key + "-" + idx}
                        className={cn(
                          "text-left overflow-x-auto pl-2",
                          header.classname
                        )}
                      >
                        {value ?? "-"}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell className="empty-cell" colSpan={5}>
                  No result found {search ? `for "${search}"` : "."}{" "}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* delete modal */}
      <AlertModal
        open={openRemoveModal}
        onOpenChange={setOpenRemoveModal}
        action={async () => {
          if (!selectedContact?.id) return;

          const res = await deleteContact(selectedContact.id);

          if (!res.success) {
            toast.error(res.message);
            return;
          }
          toast.success(res.message);

          setOpenRemoveModal(false);
          setSelectedContact(null);
        }}
        description="This action cannot be undone. This will delete the contact information permanently and cannot be recovered later."
        mainText="Are you sure you want to delete this contact message?"
      />
    </>
  );
}

export default ContactTable;
