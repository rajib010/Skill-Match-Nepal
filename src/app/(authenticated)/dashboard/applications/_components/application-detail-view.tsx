"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Briefcase,
  Building2,
  Calendar,
  Mail,
  MapPin,
  Phone,
  User,
  Award,
  Clock,
} from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";
import StatusUpdateDropdown from "./status-update-dropdown";
import { ApplicationType } from "../actions";
import { JobRequirement, UserSkill } from "@prisma/client";
import { cn, getStatusColor } from "@/lib/utils";

interface ApplicationDetailViewProps {
  application: ApplicationType;
}


export default function ApplicationDetailView({
  application,
}: ApplicationDetailViewProps) {
  const statusColor = getStatusColor(application.status);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Application Details
            </h1>
            <p className="text-gray-600 mt-1">
              Application ID: {application.id}
            </p>
          </div>
        </div>
        <StatusUpdateDropdown
          applicationId={application.id}
          currentStatus={application.status}
        />
      </div>

      {/* Status and Match Score Banner */}
      <Card className="border-l-4 border-l-blue-500">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-2">Current Status</p>
              <Badge
                className={cn(
                  "text-lg px-4 py-2 border",
                  statusColor.text,
                  statusColor.bg,
                )}
              >
                {application.status.toUpperCase()}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Match Score</p>
              <div className="flex items-center gap-2">
                <div className="text-3xl font-bold text-primary">
                  {application.matchScore.toFixed(1)}%
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-primary h-3 rounded-full transition-all"
                    style={{ width: `${application.matchScore}%` }}
                  />
                </div>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Applied On</p>
              <div className="flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5 text-gray-500" />
                {format(new Date(application.createdAt), "PPP")}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Job Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Job Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                {application.job.title}
              </h3>
              <div className="flex items-center gap-2 mt-2 text-gray-600">
                <Building2 className="h-4 w-4" />
                {application.job.company}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-700">
                <MapPin className="h-4 w-4" />
                <span>{application.job.location}</span>
              </div>

              {application.job.salary && (
                <div className="flex items-center gap-2 text-gray-700">
                  <span>{application.job.salary}</span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Badge variant="outline">{application.job.jobType}</Badge>
                <Badge
                  variant={application.job.isActive ? "default" : "secondary"}
                  className={`${application.job.isActive ? "text-white" : "text-gray-900"}`}
                >
                  {application.job.isActive ? "Active" : "Inactive"}
                </Badge>
                <Badge variant="outline">{application.job.category.name}</Badge>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
              <p className="text-gray-700 whitespace-pre-wrap">
                {application.job.description}
              </p>
            </div>

            {application.job.requirements.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Requirements
                </h4>
                <div className="flex flex-wrap gap-2">
                  {application.job.requirements.map((req: JobRequirement) => (
                    <Badge
                      key={req.id}
                      variant={req.required ? "default" : "outline"}
                      className={`flex items-center gap-1 ${req.required ? "text-white" : "text-gray-900"}`}
                    >
                      {req.skillName}
                      {req.required && <span className="text-xs">*</span>}
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">* Required skills</p>
              </div>
            )}

            {application.job.expiresAt && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                Expires: {format(new Date(application.job.expiresAt), "PPP")}
              </div>
            )}
          </CardContent>
        </Card>

        {/* User Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Applicant Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              {application.user.image ? (
                <Image
                  src={application.user.image}
                  alt={application.user.name}
                  width={45}
                  height={45}
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center">
                  <User className="h-10 w-10 text-white" />
                </div>
              )}
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {application.user.name}
                </h3>
                <Badge variant="outline" className="mt-1">
                  {application.user.role}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-700">
                <Mail className="h-4 w-4" />
                <a
                  href={`mailto:${application.user.email}`}
                  className="text-primary hover:underline"
                >
                  {application.user.email}
                </a>
              </div>

              {application.user.profile?.phone && (
                <div className="flex items-center gap-2 text-gray-700">
                  <Phone className="h-4 w-4" />
                  <a
                    href={`tel:${application.user.profile.phone}`}
                    className="text-primary hover:underline"
                  >
                    {application.user.profile.phone}
                  </a>
                </div>
              )}

              {application.user.profile?.location && (
                <div className="flex items-center gap-2 text-gray-700">
                  <MapPin className="h-4 w-4" />
                  <span>{application.user.profile.location}</span>
                </div>
              )}

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                Member since{" "}
                {format(new Date(application.user.createdAt), "PP")}
              </div>
            </div>

            {application.user.profile?.bio && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Bio</h4>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {application.user.profile.bio}
                </p>
              </div>
            )}

            {application.user.profile?.experience && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Experience</h4>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {application.user.profile.experience}
                </p>
              </div>
            )}

            {application.user.profile?.education && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Education</h4>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {application.user.profile.education}
                </p>
              </div>
            )}

            {application.user.profile?.skills &&
              application.user.profile.skills.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {application.user.profile.skills.map((skill: UserSkill) => (
                      <Badge key={skill.id} className={"text-white"}>
                        {skill.skillName}
                        {skill.level && (
                          <span className="ml-1 text-xs">({skill.level})</span>
                        )}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
          </CardContent>
        </Card>
      </div>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Application Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <div className="w-0.5 h-full bg-gray-300" />
              </div>
              <div className="pb-4">
                <p className="font-semibold text-gray-900">Applied</p>
                <p className="text-sm text-gray-600">
                  {format(new Date(application.createdAt), "PPP 'at' p")}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-primary" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Last Updated</p>
                <p className="text-sm text-gray-600">
                  {format(new Date(application.updatedAt), "PPP 'at' p")}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
