import React from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { UserJobCards } from "../../jobs/_components/user-job-cards";
import { UserJobsType } from "../../jobs/actions";

export default function TopJobs({ jobs }: { jobs: UserJobsType }) {
  return (
    <section className="py-8 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center  max-w-2xl mx-auto">
          <h1 className="section-heading mt-4">
            Top <span className="italic-heading">Jobs</span>
          </h1>{" "}
          <p className="text-header mt-2 font-poppins">
            Here&apos;s are the top jobs, available now matching your profile.
            If you don&apos;t see the suitable ones, try updating your profile.
          </p>
        </div>

        <div className="w-full flex justify-end">
          <Link
            href={"/jobs"}
            className={buttonVariants({ variant: "outline" })}
          >
            View More
          </Link>
        </div>

        <UserJobCards jobs={jobs} />
      </div>
    </section>
  );
}
