import React from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { UserJobCards } from "../../jobs/_components/user-job-cards";
import { UserJobsType } from "../../jobs/actions";

interface TopJobsProps {
  jobs: UserJobsType;
  isLoggedIn: boolean;
  userHasSkills?: boolean;
  userSkillsCount?: number;
}

export default function TopJobs({
  jobs,
  isLoggedIn,
  userHasSkills = true,
  userSkillsCount = 0,
}: TopJobsProps) {
  const getDescription = () => {
    if (isLoggedIn && !userHasSkills) {
      return "Add skills to your profile to see personalized job recommendations based on your expertise.";
    }
    if (isLoggedIn) {
      return "Here are the top jobs matching your profile. If you don't see suitable ones, try updating your skills.";
    }
    return "Here are the recently added jobs. Login to the system and keep your profile updated to see personalized recommendations.";
  };

  return (
    <section className="py-8 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="section-heading mt-4">
            {isLoggedIn ? "Top" : "Recent"}{" "}
            <span className="italic-heading">Jobs</span>
          </h1>{" "}
          <p className="text-header mt-2 font-poppins">{getDescription()}</p>
        </div>

        <div className="w-full flex justify-end">
          <Link
            href={"/jobs"}
            className={buttonVariants({ variant: "outline" })}
          >
            View More
          </Link>
        </div>

        <UserJobCards
          jobs={jobs}
          isLoggedIn={isLoggedIn}
          userHasSkills={userHasSkills}
          userSkillsCount={userSkillsCount}
        />
      </div>
    </section>
  );
}
