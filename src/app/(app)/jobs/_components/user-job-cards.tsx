"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  IconBriefcase,
  IconMapPin,
  IconCurrencyDollar,
  IconClock,
  IconBuilding,
  IconCalendar,
  IconArrowRight,
  IconTarget,
  IconSearch,
} from "@tabler/icons-react";

import Link from "next/link";
import { UserJobsType } from "../actions";
import { formatDate } from "@/lib/utils";
import { RequirementType } from "@/app/(authenticated)/dashboard/jobs/_components/job-detail-modal";
import { JobEmptyState } from "./job-empty-state";

interface iAppProps {
  jobs: UserJobsType[];
  search?: string;
  isLoggedIn?: boolean;
  userHasSkills?: boolean;
  userSkillsCount?: number;
}

function getMatchScoreColor(score: number) {
  if (score >= 80) return "bg-green-100 text-green-800";
  if (score >= 60) return "bg-blue-100 text-blue-800";
  if (score >= 40) return "bg-amber-100 text-amber-800";
  return "bg-gray-100 text-gray-600";
}

export function UserJobCards({ 
  jobs, 
  search, 
  isLoggedIn, 
  userHasSkills = true,
  userSkillsCount = 0 
}: iAppProps) {
  if (jobs.length === 0) {
    if (isLoggedIn && !userHasSkills) {
      return (
        <JobEmptyState
          icon={IconTarget}
          title="Add Your Skills"
          description="You haven't added any skills to your profile yet. Add skills to see personalized job matches and get better recommendations."
          actionLabel="Go to Profile"
          actionHref="/profile"
        />
      );
    }

    if (isLoggedIn && userHasSkills) {
      return (
        <JobEmptyState
          icon={IconSearch}
          title="No Matching Jobs Found"
          description={`No jobs match your current skills. You have ${userSkillsCount} skill${userSkillsCount !== 1 ? 's' : ''} in your profile. Try adding more skills or adjusting your search filters.`}
          actionLabel="Update Profile"
          actionHref="/profile"
        />
      );
    }

    return (
      <JobEmptyState
        icon={IconBriefcase}
        title="No Jobs Found"
        description={
          search
            ? `No jobs found for "${search}". Try adjusting your search or filters.`
            : "No jobs are available at the moment. Check back later."
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {jobs.map((job) => {
        return (
          <div
            key={job.id}
            className="bg-white rounded-lg p-5 hover:shadow-lg transition-all duration-200 flex flex-col"
          >
            {/* Category Badge */}
            <div className="mb-3 flex items-center justify-between">
              <Badge variant="default" className="text-xs text-white">
                {job.category.name}
              </Badge>
              {isLoggedIn && (
                <>
                  {!userHasSkills ? (
                    <Link href="/profile">
                      <Badge
                        variant="outline"
                        className="text-xs font-medium flex items-center gap-1 bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100 cursor-pointer"
                      >
                        <IconTarget className="w-3 h-3" />
                        Add skills to see match
                      </Badge>
                    </Link>
                  ) : job.matchScore === 0 ? (
                    <Badge
                      variant="outline"
                      className="text-xs font-medium flex items-center gap-1 bg-red-50 text-red-700 border-red-200"
                    >
                      <IconTarget className="w-3 h-3" />
                      0% Match
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className={`text-xs font-medium flex items-center gap-1 ${getMatchScoreColor(job.matchScore)}`}
                    >
                      <IconTarget className="w-3 h-3" />
                      {job.matchScore}% Match
                    </Badge>
                  )}
                </>
              )}
            </div>

            {/* Job Title & Company */}
            <Link href={`/jobs/${job.id}`} className="group">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                {job.title}
              </h3>
            </Link>

            <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
              <IconBuilding className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{job.company}</span>
            </div>

            {/* Location & Job Type */}
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <div className="flex items-center gap-1.5 text-sm text-gray-600">
                <IconMapPin className="w-4 h-4 flex-shrink-0" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-gray-600">
                <IconClock className="w-4 h-4 flex-shrink-0" />
                <span className="capitalize">
                  {job.jobType.replace("-", " ")}
                </span>
              </div>
            </div>

            {/* Salary */}
            {job.salary && (
              <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-3">
                <IconCurrencyDollar className="w-4 h-4 flex-shrink-0" />
                <span>{job.salary}</span>
              </div>
            )}

            {/* Requirements */}
            {job.requirements.length > 0 && (
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2">Required Skills:</p>
                <div className="flex flex-wrap gap-1.5">
                  {job.requirements.slice(0, 3).map((req: RequirementType) => (
                    <Badge
                      key={req.id}
                      variant="secondary"
                      className="text-xs px-2 py-0.5"
                    >
                      {req.skillName}
                    </Badge>
                  ))}
                  {job.requirements.length > 3 && (
                    <Badge variant="secondary" className="text-xs px-2 py-0.5">
                      +{job.requirements.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t mt-auto">
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <IconCalendar className="w-3.5 h-3.5" />
                <span>{formatDate(job.createdAt)}</span>
              </div>
              <Link href={`/jobs/${job.id}`}>
                <Button size="sm" variant="default" className="group">
                  View Details
                  <IconArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            {/* Application Count */}
            <div className="text-xs text-gray-500 text-center mt-2">
              {job._count.applications} applicant
              {job._count.applications !== 1 ? "s" : ""}
            </div>
          </div>
        );
      })}
    </div>
  );
}
