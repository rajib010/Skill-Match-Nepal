import { Briefcase } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function Logo({
  logoClass,
  textClass,
}: {
  logoClass?: string;
  textClass?: string;
}) {
  return (
    <Link href={"/"}>
      <div className="flex items-center space-x-2">
        <div className="bg-primary p-2 rounded-lg">
          <Briefcase className={`size-6 ${logoClass}`} />
        </div>
        <span className={`text-sm font-bold text-black ${textClass}`}>
          SM Nepal
        </span>
      </div>
    </Link>
  );
}
