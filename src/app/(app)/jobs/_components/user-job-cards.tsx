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
} from "@tabler/icons-react";

import Link from "next/link";
import { UserJobsType } from "../actions";
import { formatDate } from "@/lib/utils";

interface iAppProps {
  jobs: UserJobsType[];
  search?: string;
}

export function UserJobCards({ jobs, search }: iAppProps) {
  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <IconBriefcase className="w-12 h-12 text-gray-400 mb-3" />
        <p className="text-gray-600 text-lg font-medium">No jobs found</p>
        {search && (
          <p className="text-gray-400 text-sm mt-1">
            Try adjusting your search or filters
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {jobs.map((job) => (
        <div
          key={job.id}
          className="bg-white rounded-lg p-5 hover:shadow-lg transition-all duration-200 flex flex-col"
        >
          {/* Category Badge */}
          <div className="mb-3">
            <Badge variant="default" className="text-xs text-white">
              {job.category.name}
            </Badge>
          </div>

          {/* Job Title & Company */}
          <Link href={`/jobs/${job.id}`} className="group">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
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

          {/* Description Preview */}
          <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-grow">
            {job.description}
          </p>

          {/* Requirements */}
          {job.requirements.length > 0 && (
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-2">Required Skills:</p>
              <div className="flex flex-wrap gap-1.5">
                {job.requirements.slice(0, 3).map((req) => (
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
      ))}
    </div>
  );
}
