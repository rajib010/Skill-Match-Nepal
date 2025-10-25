"use server";

import { prisma } from "@/database/prisma";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function getAllJobs(
  page: number = 1,
  limit: number = 10,
  search?: string,
  sortField?: "title" | "company" | "createdAt",
  sortOrder?: "asc" | "desc",
  categoryId?: string,
  isActive?: boolean
): Promise<ApiResponse> {
  try {
    const skip = (page - 1) * limit;

    const whereClause: Prisma.JobWhereInput = {};

    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: "insensitive" as const } },
        { company: { contains: search, mode: "insensitive" as const } },
        { location: { contains: search, mode: "insensitive" as const } },
        { description: { contains: search, mode: "insensitive" as const } },
      ];
    }

    if (categoryId) {
      whereClause.categoryId = categoryId;
    }

    if (isActive !== undefined) {
      whereClause.isActive = isActive;
    }

    const orderByClause = sortField
      ? { [sortField]: sortOrder || "desc" }
      : { createdAt: "desc" as const };

    const [jobs, totalCount] = await Promise.all([
      prisma.job.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: orderByClause,
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
          _count: {
            select: {
              applications: true,
            },
          },
        },
      }),
      prisma.job.count({ where: whereClause }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      success: true,
      message: "Jobs fetched successfully.",
      data: {
        jobs,
        currentPage: page,
        totalPages,
        limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  } catch (error: unknown) {
    let message = "Failed to fetch jobs.";
    if (error instanceof Error) message = error.message;

    return { success: false, message, data: null };
  }
}

export async function deleteJob(id: string): Promise<ApiResponse> {
  try {
    // Check if job exists
    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            applications: true,
          },
        },
      },
    });

    if (!job) {
      return {
        success: false,
        message: "Job not found.",
        data: null,
      };
    }

    // Delete job (cascade will handle requirements and applications)
    await prisma.job.delete({
      where: { id },
    });

    revalidatePath("/jobs");

    return {
      success: true,
      message: "Job deleted successfully.",
      data: null,
    };
  } catch (error: unknown) {
    let message = "Failed to delete job.";
    if (error instanceof Error) message = error.message;

    return { success: false, message, data: null };
  }
}

export async function updateJob(
  id: string,
  data: {
    title?: string;
    description?: string;
    company?: string;
    location?: string;
    salary?: string;
    jobType?: string;
    categoryId?: string;
    isActive?: boolean;
    expiresAt?: Date | null;
    requirements?: Array<{ skillName: string; required: boolean }>;
  }
): Promise<ApiResponse> {
  try {
    // Check if job exists
    const existingJob = await prisma.job.findUnique({
      where: { id },
    });

    if (!existingJob) {
      return {
        success: false,
        message: "Job not found.",
        data: null,
      };
    }

    // Extract requirements from data
    const { requirements, ...jobData } = data;

    // Update job
    const updatedJob = await prisma.job.update({
      where: { id },
      data: jobData,
      include: {
        category: true,
        requirements: true,
      },
    });

    // If requirements are provided, update them
    if (requirements && requirements.length > 0) {
      // Delete existing requirements
      await prisma.jobRequirement.deleteMany({
        where: { jobId: id },
      });

      // Create new requirements
      await prisma.jobRequirement.createMany({
        data: requirements.map((req) => ({
          jobId: id,
          skillName: req.skillName,
          required: req.required,
        })),
      });
    }

    revalidatePath("/jobs");

    return {
      success: true,
      message: "Job updated successfully.",
      data: updatedJob,
    };
  } catch (error: unknown) {
    let message = "Failed to update job.";
    if (error instanceof Error) message = error.message;

    return { success: false, message, data: null };
  }
}

export async function createJob(data: {
  title: string;
  description: string;
  company: string;
  location: string;
  salary?: string;
  jobType: string;
  categoryId: string;
  postedById: string;
  isActive?: boolean;
  expiresAt?: Date;
  requirements: Array<{ skillName: string; required: boolean }>;
}): Promise<ApiResponse> {
  try {
    const { requirements, ...jobData } = data;

    const job = await prisma.job.create({
      data: {
        ...jobData,
        requirements: {
          create: requirements,
        },
      },
      include: {
        category: true,
        requirements: true,
      },
    });

    revalidatePath("/jobs");

    return {
      success: true,
      message: "Job created successfully.",
      data: job,
    };
  } catch (error: unknown) {
    let message = "Failed to create job.";
    if (error instanceof Error) message = error.message;

    return { success: false, message, data: null };
  }
}

export async function toggleJobStatus(id: string): Promise<ApiResponse> {
  try {
    const job = await prisma.job.findUnique({
      where: { id },
      select: { isActive: true },
    });

    if (!job) {
      return {
        success: false,
        message: "Job not found.",
        data: null,
      };
    }

    const updatedJob = await prisma.job.update({
      where: { id },
      data: { isActive: !job.isActive },
    });

    revalidatePath("/jobs");

    return {
      success: true,
      message: `Job ${
        updatedJob.isActive ? "activated" : "deactivated"
      } successfully.`,
      data: updatedJob,
    };
  } catch (error: unknown) {
    let message = "Failed to toggle job status.";
    if (error instanceof Error) message = error.message;

    return { success: false, message, data: null };
  }
}

export async function getJobById(id: string): Promise<ApiResponse> {
  try {
    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        category: true,
        requirements: true,
        applications: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
        _count: {
          select: {
            applications: true,
          },
        },
      },
    });

    if (!job) {
      return {
        success: false,
        message: "Job not found.",
        data: null,
      };
    }

    return {
      success: true,
      message: "Job fetched successfully.",
      data: job,
    };
  } catch (error: unknown) {
    let message = "Failed to fetch job.";
    if (error instanceof Error) message = error.message;

    return { success: false, message, data: null };
  }
}

export type JobsType = Awaited<ReturnType<typeof getAllJobs>>["data"]["jobs"];
export type JobType = Awaited<ReturnType<typeof getJobById>>["data"];
