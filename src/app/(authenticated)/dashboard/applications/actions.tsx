"use server";

import { prisma } from "@/database/prisma";
import { getSignedInUser } from "@/lib/auth/server";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

export async function getAllApplications(
  page: number = 1,
  limit: number = 10,
  search?: string,
  sortField = "createdAt",
  sortOrder: Prisma.SortOrder = "desc",
): Promise<ApiResponse> {
  try {
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            {
              user: {
                name: { contains: search, mode: "insensitive" as const },
              },
            },
            {
              user: {
                email: { contains: search, mode: "insensitive" as const },
              },
            },
            {
              job: {
                title: { contains: search, mode: "insensitive" as const },
              },
            },
            {
              job: {
                company: { contains: search, mode: "insensitive" as const },
              },
            },
            { status: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {};

    const [applications, totalCount] = await Promise.all([
      prisma.jobApplication.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              createdAt: true,
              role: true,
              profile: {
                select: {
                  experience: true,
                  education: true,
                  location: true,
                  bio: true,
                  phone: true,
                  skills: true,
                },
              },
              _count: {
                select: { applications: true },
              },
            },
          },
          job: {
            select: {
              id: true,
              title: true,
              company: true,
              location: true,
              jobType: true,
              salary: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { [sortField]: sortOrder },
      }),
      prisma.jobApplication.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);
    const currentPage = page;
    const hasNextPage = currentPage < totalPages;
    const hasPreviousPage = currentPage > 1;

    return {
      success: true,
      message: "Applications fetched successfully.",
      data: {
        applications,
        totalPages,
        currentPage,
        hasNextPage,
        hasPreviousPage,
        totalCount,
      },
    };
  } catch (error) {
    console.log("🚀 ~ Get all applications ~ error:", error);
    return {
      success: false,
      message: "Failed to get application information.",
    };
  }
}

export async function deleteApplication(id: string): Promise<ApiResponse> {
  try {
    const user = await getSignedInUser();

    if (!user) {
      return {
        success: false,
        message: "Unauthorized. Please sign in.",
      };
    }

    if (user.role !== "admin") {
      return {
        success: false,
        message: "Unauthorized. Admin access required.",
      };
    }

    const application = await prisma.jobApplication.findUnique({
      where: { id },
    });

    if (!application) {
      return {
        success: false,
        message: "Application not found.",
      };
    }

    await prisma.jobApplication.delete({ where: { id } });

    revalidatePath("/dashboard/applications");
    revalidatePath("/jobs/applied");

    return {
      success: true,
      message: "Job application deleted successfully.",
    };
  } catch (error) {
    console.log("🚀 ~ deleteApplication ~ error:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to delete application.",
    };
  }
}

export async function getApplicationDetail(
  applicationId: string,
): Promise<ApiResponse> {
  try {
    const application = await prisma.jobApplication.findUnique({
      where: {
        id: applicationId,
      },
      include: {
        job: {
          include: {
            category: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
            requirements: {
              select: {
                id: true,
                skillName: true,
                required: true,
              },
            },
          },
        },
        user: {
          include: {
            profile: {
              include: {
                skills: {
                  select: {
                    id: true,
                    skillName: true,
                    level: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!application) {
      return {
        success: false,
        message: "No Application found.",
      };
    }

    return {
      success: true,
      message: "Application information fetched successfull.",
      data: application,
    };
  } catch (error) {
    console.error("Error fetching application detail:", error);
    return {
      success: false,
      message: "Failed to get applications.",
    };
  }
}

export async function updateApplicationStatus(
  applicationId: string,
  status: string,
): Promise<ApiResponse> {
  try {
    const validStatuses = ["pending", "reviewed", "accepted", "rejected"];

    if (!validStatuses.includes(status)) {
      return {
        success: false,
        message: "Invalid status value",
      };
    }

    await prisma.jobApplication.update({
      where: {
        id: applicationId,
      },
      data: {
        status,
        updatedAt: new Date(),
      },
    });

    revalidatePath(`/applications/${applicationId}`);
    revalidatePath("/applications");

    return {
      success: true,
      message: `Application status updated to ${status}`,
    };
  } catch (error) {
    console.error("Error updating application status:", error);
    return {
      success: false,
      message: "Failed to update application status",
    };
  }
}

export type ApplicationType = NonNullable<
  Awaited<ReturnType<typeof getAllApplications>>
>["data"];
