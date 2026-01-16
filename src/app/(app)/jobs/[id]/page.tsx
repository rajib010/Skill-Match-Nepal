import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  IconBriefcase,
  IconMapPin,
  IconCurrencyDollar,
  IconBuilding,
  IconCalendar,
  IconArrowLeft,
  IconCheck,
  IconAlertCircle,
} from "@tabler/icons-react";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { getSignedInUser } from "@/lib/auth/server";
import { getJobDetails } from "../actions";
import { ErrorDisplay } from "@/app/(authenticated)/dashboard/_components/error-display";
import { ApplyButton } from "../_components/apply-button";

interface iAppProps {
  params: Promise<{ id: string }>;
}

export default async function JobDetailPage({ params }: iAppProps) {
  const { id } = await params;

  // Get current user (adjust based on your auth implementation)
  const session = await getSignedInUser();
  const userId = session?.id;

  const res = await getJobDetails(id, userId);

  if (!res.success || !res.data) {
    return (
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <ErrorDisplay message={res.message} />
          <div className="mt-6 text-center">
            <Link href="/jobs">
              <Button variant="outline">
                <IconArrowLeft className="w-4 h-4 mr-2" />
                Back to Jobs
              </Button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const job = res.data;

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <Link href="/jobs">
            <Button variant="ghost" size="sm" className="mb-4">
              <IconArrowLeft className="w-4 h-4 mr-2" />
              Back to Jobs
            </Button>
          </Link>

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <Badge variant="outline">{job.category.name}</Badge>
                <Badge variant="secondary" className="capitalize">
                  {job.jobType.replace("-", " ")}
                </Badge>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {job.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-gray-600">
                <div className="flex items-center gap-2">
                  <IconBuilding className="w-5 h-5" />
                  <span className="font-medium">{job.company}</span>
                </div>
                <div className="flex items-center gap-2">
                  <IconMapPin className="w-5 h-5" />
                  <span>{job.location}</span>
                </div>
                {job.salary && (
                  <div className="flex items-center gap-2">
                    <IconCurrencyDollar className="w-5 h-5" />
                    <span>{job.salary}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Apply Button */}
            <div className="flex flex-col gap-3">
              {userId ? (
                <>
                  <ApplyButton
                    jobId={job.id}
                    userId={userId}
                    hasApplied={job.hasApplied}
                  />
                  {job.hasApplied && (
                    <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-md">
                      <IconCheck className="w-4 h-4" />
                      <span>Already Applied</span>
                    </div>
                  )}
                </>
              ) : (
                <Link href={"/login?callbackUrl=/jobs/" + job.id}>
                  <Button size="lg" className="w-full">
                    Sign in to Apply
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Job Description */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Job Description
                </h2>
                <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
                  {job.description}
                </div>
              </div>

              {/* Requirements */}
              {job.requirements.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Required Skills
                  </h2>
                  <div className="space-y-3">
                    {job.requirements.map((req) => (
                      <div
                        key={req.id}
                        className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <div
                          className={`mt-0.5 ${
                            req.required ? "text-blue-600" : "text-gray-400"
                          }`}
                        >
                          {req.required ? (
                            <IconAlertCircle className="w-5 h-5" />
                          ) : (
                            <IconCheck className="w-5 h-5" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">
                              {req.skillName}
                            </span>
                            <Badge
                              variant={req.required ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {req.required ? "Required" : "Preferred"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Job Info Card */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Job Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                      <IconCalendar className="w-4 h-4" />
                      <span>Posted</span>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      {formatDate(job.createdAt)}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                      <IconBriefcase className="w-4 h-4" />
                      <span>Job Type</span>
                    </div>
                    <p className="text-sm font-medium text-gray-900 capitalize">
                      {job.jobType.replace("-", " ")}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                      <IconMapPin className="w-4 h-4" />
                      <span>Location</span>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      {job.location}
                    </p>
                  </div>

                  {job.salary && (
                    <div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                        <IconCurrencyDollar className="w-4 h-4" />
                        <span>Salary</span>
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        {job.salary}
                      </p>
                    </div>
                  )}

                  <div className="pt-4 border-t">
                    <p className="text-xs text-gray-500 text-center">
                      {job._count.applications} applicant
                      {job._count.applications !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Company Info Card */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-2">
                About {job.company}
              </h3>
              <p className="text-sm text-gray-600">
                Learn more about this opportunity at {job.company}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
