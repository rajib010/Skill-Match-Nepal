import React from "react";
import UserImage from "./user-image";
import { Users } from "../users/action";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  IconMail,
  IconPhone,
  IconMapPin,
  IconBriefcase,
  IconSchool,
  IconFileText,
  IconCode,
} from "@tabler/icons-react";
import Link from "next/link";

interface iAppProps {
  user: Users;
}

type Skills = {
  id: string;
  skillName: string;
  level: string;
};

function UserDetailComponent({ user }: iAppProps) {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-start gap-6">
        <div className="flex-shrink-0">
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200">
            <UserImage
              src={user.image}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-semibold text-gray-900">{user.name}</h2>
          <p className="text-sm text-gray-500 mt-1">
            Member since {new Date(user.createdAt).toLocaleDateString()}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant={user.emailVerified ? "default" : "secondary"}>
              {user.emailVerified ? "Verified" : "Not Verified"}
            </Badge>
            <Badge variant="outline">{user.role}</Badge>
          </div>
        </div>
      </div>

      <Separator />

      {/* Contact Information */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
          Contact Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <IconMail className="w-4 h-4 text-gray-400 mt-0.5" />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-500">Email</p>
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.email}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <IconPhone className="w-4 h-4 text-gray-400 mt-0.5" />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-500">Phone</p>
              <p className="text-sm font-medium text-gray-900">
                {user.profile?.phone || "N/A"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <IconMapPin className="w-4 h-4 text-gray-400 mt-0.5" />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-500">Location</p>
              <p className="text-sm font-medium text-gray-900">
                {user.profile?.location || "N/A"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <IconBriefcase className="w-4 h-4 text-gray-400 mt-0.5" />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-500">Applications</p>
              <p className="text-sm font-medium text-gray-900">
                {user._count?.applications || 0} applications
              </p>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Professional Information */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
          Professional Information
        </h3>

        {user.profile?.bio && (
          <div className="flex items-start gap-3">
            <IconFileText className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-500">Bio</p>
              <p className="text-sm text-gray-700 leading-relaxed">
                {user.profile.bio}
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <IconBriefcase className="w-4 h-4 text-gray-400 mt-0.5" />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-500">Experience</p>
              <p className="text-sm font-medium text-gray-900">
                {user.profile?.experience || "N/A"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <IconSchool className="w-4 h-4 text-gray-400 mt-0.5" />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-500">Education</p>
              <p className="text-sm font-medium text-gray-900">
                {user.profile?.education || "N/A"}
              </p>
            </div>
          </div>
        </div>

        {user.profile?.cvUrl && (
          <div className="flex items-start gap-3">
            <IconFileText className="w-4 h-4 text-gray-400 mt-0.5" />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-500">CV</p>
              <Link
                href={user.profile.cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-blue-600 hover:underline"
              >
                View CV
              </Link>
              {user.profile.cvParsedAt && (
                <p className="text-xs text-gray-400 mt-1">
                  Parsed on{" "}
                  {new Date(user.profile.cvParsedAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Skills Section */}
      {user.profile?.skills && user.profile.skills.length > 0 && (
        <>
          <Separator />
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <IconCode className="w-4 h-4 text-gray-400" />
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                Skills ({user.profile.skills.length})
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {user.profile.skills.map((skill: Skills) => (
                <div
                  key={skill.id}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-md"
                >
                  <span className="text-sm font-medium text-gray-900">
                    {skill.skillName}
                  </span>
                  {skill.level && (
                    <Badge
                      variant="secondary"
                      className="text-xs h-5 px-1.5 capitalize"
                    >
                      {skill.level}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default UserDetailComponent;
