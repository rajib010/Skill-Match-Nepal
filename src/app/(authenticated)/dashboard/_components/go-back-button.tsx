import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

function GoBackButton({ url }: { url: string }) {
  return (
    <div>
      <Link
        href={url}
        className={buttonVariants({ variant: "outline"})}
      >
        <ArrowLeft />
        Go Back
      </Link>
    </div>
  );
}

export default GoBackButton;
