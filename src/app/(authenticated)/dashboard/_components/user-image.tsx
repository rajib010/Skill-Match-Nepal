import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { constructUrl } from "@/lib/cloudinary/utils";

import React from "react";

interface UserImageProps {
  src?: string;
  className?: string;
}

export default function UserImage({ src, className }: UserImageProps) {
  const imageUrl = src ?? "/logo.jpg"
  return (
    <Avatar className={`size-10 ${className}`}>
      <AvatarImage src={constructUrl(imageUrl)} />
      <AvatarFallback>UC</AvatarFallback>
    </Avatar>
  );
}
