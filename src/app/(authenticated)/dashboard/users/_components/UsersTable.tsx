"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { blockUser, Users } from "../action";
import { userTableHeaders } from "@/app/(authenticated)/config";
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
import UserImage from "../../_components/UserImage";
import { useCallback, useState } from "react";
import { AlertModal } from "../../_components/AlertModal";
import { UserDetailModal } from "./UserDetailModal";

interface iAppProps {
  users: Users[];
  limit: number;
  page: number;
  search?: string;
}

export function UserTable({ users, limit, page, search }: iAppProps) {
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [isBlockDialogOpen, setIsBlockDialogOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleCloseDetail = useCallback(() => {
    setIsDetailModalOpen(false);
  }, []);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-200 pointer-events-none">
            {userTableHeaders.map((item, idx) => (
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
          {users.length > 0 ? (
            users.map((usr: Users, idx: number) => (
              <TableRow key={idx + "-" + usr.id}>
                {userTableHeaders.map((header) => {
                  let value: React.ReactNode;

                  if (header.key === "sn") {
                    value = (page - 1) * limit + (idx + 1);
                  } else if (header.key === "actions") {
                    value = (
                      <DropdownMenu
                        open={openDropdownId === usr.id}
                        onOpenChange={(open) => {
                          setOpenDropdownId(open ? usr.id : null);
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
                              setSelectedUser(usr);
                              setOpenDropdownId(null); // Close dropdown
                              setIsDetailModalOpen(true);
                            }}
                          >
                            <NotebookTabs className="size-4" />
                            View Detail
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onSelect={(e) => {
                              e.preventDefault();
                              setSelectedUser(usr);
                              setOpenDropdownId(null); // Close dropdown
                              setIsBlockDialogOpen(true);
                            }}
                          >
                            <Ban className="size-4" />
                            Block
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    );
                  } else if (header.key === "image") {
                    value = <UserImage src={getValue(usr, header.key)} />;
                  } else {
                    value = getValue(usr, header.key);
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
      {selectedUser && isBlockDialogOpen && (
        <AlertModal
          open={isBlockDialogOpen}
          onOpenChange={setIsBlockDialogOpen}
          action={async () => {
            await blockUser(selectedUser.id);
            setIsBlockDialogOpen(false);
            setSelectedUser(null);
          }}
          description="This action cannot be undone. This will block the user from using this system. You can unblock this user later."
          mainText="Are you sure you want to block this user?"
        />
      )}

      {/* Detail Modal */}
      {selectedUser && isDetailModalOpen && (
        <UserDetailModal
          isOpen={isDetailModalOpen}
          onClose={handleCloseDetail}
          user={selectedUser}
        />
      )}
    </>
  );
}
