import { memo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import UserDetailComponent from "../../_components/UserDetailComponent";
import { Users } from "../action";

interface iAppProps {
  isOpen: boolean;
  onClose: () => void;
  user: Users;
}

export const UserDetailModal = memo(function UserDetailModal({
  isOpen,
  onClose,
  user,
}: iAppProps) {
  if (!isOpen) return;
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!w-[700px] !max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">User Detail Information</DialogTitle>
          <div className="my-10">
            <UserDetailComponent user={user} />
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
});
