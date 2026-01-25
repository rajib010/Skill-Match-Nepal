"use server";

import { prisma } from "@/database/prisma";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { isSkillMatch } from "./algorithm";

export async function getActiveJobs(
  page: number = 1,
  limit: number = 12,
  search?: string,
  sortField?: "createdAt" | "matchScore",
  sortOrder?: "asc" | "desc",
  categoryId?: string,
  jobType?: string,
  location?: string,
  userId?: string,
): Promise<ApiResponse> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const whereClause: Prisma.JobWhereInput | any = {
      isActive: true,
      OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
    };

    if (search) {
      whereClause.AND = [
        whereClause.AND || {},
        {
          OR: [
            { title: { contains: search, mode: "insensitive" as const } },
            { location: { contains: search, mode: "insensitive" as const } },
            { description: { contains: search, mode: "insensitive" as const } },
            { company: { contains: search, mode: "insensitive" as const } },
          ],
        },
      ];
    }

    if (categoryId) {
      whereClause.categoryId = categoryId;
    }

    if (jobType) {
      whereClause.jobType = jobType;
    }

    if (location) {
      whereClause.location = {
        contains: location,
        mode: "insensitive" as const,
      };
    }

    // Get user skills if userId is provided
    let userSkills: string[] = [];
    if (userId) {
      const userProfile = await prisma.userProfile.findUnique({
        where: { userId },
        include: {
          skills: true,
        },
      });

      if (userProfile) {
        userSkills = userProfile.skills.map((s) => s.skillName);
      }
    }

    // If sorting by matchScore, fetch ALL jobs to calculate and sort properly
    const shouldFetchAll = sortField === "matchScore" && userId;

    const skip = shouldFetchAll ? undefined : (page - 1) * limit;
    const take = shouldFetchAll ? undefined : limit;

    const [jobs, totalCount] = await Promise.all([
      prisma.job.findMany({
        where: whereClause,
        skip,
        take,
        orderBy:
          !shouldFetchAll && sortField === "createdAt"
            ? { createdAt: sortOrder || "desc" }
            : undefined,
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
          applications: userId
            ? {
                where: { userId },
                select: {
                  id: true,
                  status: true,
                  matchScore: true,
                  createdAt: true,
                },
              }
            : false,
        },
      }),
      prisma.job.count({ where: whereClause }),
    ]);

    // Calculate match scores for each job using Levenshtein algorithm
    const jobsWithMatchScore = jobs.map((job) => {
      let matchScore = 0;

      if (userId && userSkills.length > 0 && job.requirements.length > 0) {
        const requiredSkills = job.requirements.filter((r) => r.required);
        const preferredSkills = job.requirements.filter((r) => !r.required);

        let matchedRequired = 0;
        let matchedPreferred = 0;

        // Check required skills with Levenshtein fuzzy matching
        requiredSkills.forEach((req) => {
          const hasMatch = userSkills.some(
            (userSkill) => isSkillMatch(userSkill, req.skillName, 2), // threshold = 2
          );
          if (hasMatch) {
            matchedRequired++;
          }
        });

        // Check preferred skills with Levenshtein fuzzy matching
        preferredSkills.forEach((req) => {
          const hasMatch = userSkills.some(
            (userSkill) => isSkillMatch(userSkill, req.skillName, 2), // threshold = 2
          );
          if (hasMatch) {
            matchedPreferred++;
          }
        });

        // Calculate weighted score: 70% for required skills, 30% for preferred skills
        const requiredScore =
          requiredSkills.length > 0
            ? (matchedRequired / requiredSkills.length) * 70
            : 70; // Full score if no required skills

        const preferredScore =
          preferredSkills.length > 0
            ? (matchedPreferred / preferredSkills.length) * 30
            : 30; // Full score if no preferred skills

        matchScore = Math.round(requiredScore + preferredScore);
      }

      return {
        ...job,
        matchScore,
        hasApplied: userId ? job.applications.length > 0 : false,
        applicationStatus:
          userId && job.applications.length > 0
            ? job.applications[0].status
            : null,
      };
    });

    // Sort and apply sliding window pagination
    let finalJobs = jobsWithMatchScore;

    if (sortField === "matchScore" && userId) {
      // Sort all jobs by match score
      finalJobs = jobsWithMatchScore.sort((a, b) => {
        return sortOrder === "asc"
          ? a.matchScore - b.matchScore
          : b.matchScore - a.matchScore;
      });

      // Apply sliding window pagination AFTER sorting
      const windowStart = (page - 1) * limit;
      const windowEnd = windowStart + limit;
      finalJobs = finalJobs.slice(windowStart, windowEnd);
    }
    // If sortField is "createdAt", jobs are already sorted and paginated by database

    const totalPages = Math.ceil(totalCount / limit);

    return {
      success: true,
      message: "Jobs fetched successfully.",
      data: {
        jobs: finalJobs,
        currentPage: page,
        totalPages,
        totalCount,
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

export async function getJobDetails(
  id: string,
  userId?: string,
): Promise<ApiResponse> {
  try {
    const job = await prisma.job.findUnique({
      where: { id, isActive: true },
      include: {
        category: true,
        requirements: {
          orderBy: {
            required: "desc", // Show required skills first
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
        message: "Job not found or no longer active.",
        data: null,
      };
    }

    // Check if user has already applied
    let hasApplied = false;
    let status: string | undefined = "pending";
    if (userId) {
      const application = await prisma.jobApplication.findUnique({
        where: {
          jobId_userId: {
            jobId: id,
            userId: userId,
          },
        },
      });
      hasApplied = !!application;
      status = application?.status;
    }

    return {
      success: true,
      message: "Job details fetched successfully.",
      data: {
        ...job,
        hasApplied,
        status,
      },
    };
  } catch (error: unknown) {
    let message = "Failed to fetch job details.";
    if (error instanceof Error) message = error.message;

    return { success: false, message, data: null };
  }
}

export async function applyForJob(
  jobId: string,
  userId: string,
): Promise<ApiResponse> {
  try {
    // Check if job exists and is active
    const job = await prisma.job.findUnique({
      where: { id: jobId, isActive: true },
      include: {
        requirements: true,
      },
    });

    if (!job) {
      return {
        success: false,
        message: "Job not found or no longer active.",
        data: null,
      };
    }

    // Check if already applied
    const existingApplication = await prisma.jobApplication.findUnique({
      where: {
        jobId_userId: {
          jobId,
          userId,
        },
      },
    });

    if (existingApplication) {
      return {
        success: false,
        message: "You have already applied for this job.",
        data: null,
      };
    }

    // Get user profile and skills
    const userProfile = await prisma.userProfile.findUnique({
      where: { userId },
      include: {
        skills: true,
      },
    });

    // Calculate match score based on skills using Levenshtein algorithm
    let matchScore = 0;
    if (userProfile && job.requirements.length > 0) {
      const userSkills = userProfile.skills.map((s) => s.skillName);
      const requiredSkills = job.requirements.filter((r) => r.required);
      const preferredSkills = job.requirements.filter((r) => !r.required);

      let matchedRequired = 0;
      let matchedPreferred = 0;

      // Check required skills with Levenshtein fuzzy matching
      requiredSkills.forEach((req) => {
        const hasMatch = userSkills.some(
          (userSkill) => isSkillMatch(userSkill, req.skillName, 2), // threshold = 2
        );
        if (hasMatch) {
          matchedRequired++;
        }
      });

      // Check preferred skills with Levenshtein fuzzy matching
      preferredSkills.forEach((req) => {
        const hasMatch = userSkills.some(
          (userSkill) => isSkillMatch(userSkill, req.skillName, 2), // threshold = 2
        );
        if (hasMatch) {
          matchedPreferred++;
        }
      });

      // Calculate weighted score: 70% for required skills, 30% for preferred skills
      const requiredScore =
        requiredSkills.length > 0
          ? (matchedRequired / requiredSkills.length) * 70
          : 70; // Full score if no required skills

      const preferredScore =
        preferredSkills.length > 0
          ? (matchedPreferred / preferredSkills.length) * 30
          : 30; // Full score if no preferred skills

      matchScore = Math.round(requiredScore + preferredScore);
    }

    // Create application
    const application = await prisma.jobApplication.create({
      data: {
        jobId,
        userId,
        matchScore,
        status: "pending",
      },
      include: {
        job: {
          select: {
            title: true,
            company: true,
          },
        },
      },
    });

    revalidatePath("/jobs");
    revalidatePath(`/jobs/${jobId}`);

    return {
      success: true,
      message: `Successfully applied for ${application.job.title} at ${application.job.company}! Match score: ${matchScore}%`,
      data: application,
    };
  } catch (error: unknown) {
    let message = "Failed to submit application.";
    if (error instanceof Error) message = error.message;

    return { success: false, message, data: null };
  }
}

export async function getCategories(): Promise<ApiResponse> {
  try {
    const categories = await prisma.category.findMany({
      where: {
        jobs: {
          some: {
            isActive: true, //categories with at least one job
          },
        },
      },
      orderBy: {
        name: "asc",
      },
      include: {
        _count: {
          select: {
            jobs: {
              where: {
                isActive: true,
              },
            },
          },
        },
      },
    });

    return {
      success: true,
      message: "Categories fetched successfully.",
      data: categories,
    };
  } catch (error: unknown) {
    let message = "Failed to fetch categories.";
    if (error instanceof Error) message = error.message;

    return { success: false, message, data: null };
  }
}

export async function getUserApplications(
  userId: string,
  page: number = 1,
  limit: number = 10,
  status?: string,
): Promise<ApiResponse> {
  try {
    const skip = (page - 1) * limit;

    const whereClause: Prisma.JobApplicationWhereInput = {
      userId,
    };

    if (status && status !== "all") {
      whereClause.status = status;
    }

    const [applications, totalCount] = await Promise.all([
      prisma.jobApplication.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          job: {
            include: {
              category: true,
            },
          },
        },
      }),
      prisma.jobApplication.count({ where: whereClause }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      success: true,
      message: "Applications fetched successfully.",
      data: {
        applications,
        currentPage: page,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  } catch (error: unknown) {
    let message = "Failed to fetch applications.";
    if (error instanceof Error) message = error.message;

    return { success: false, message, data: null };
  }
}

export async function trackSearchQuery(query: string) {
  try {
    const existingRecord = await prisma.searchQuery.findFirst({
      where: {
        query: { equals: query, mode: "insensitive" },
      },
      select: {
        id: true,
      },
    });

    if (existingRecord) {
      await prisma.searchQuery.update({
        where: { id: existingRecord.id },
        data: {
          resultsCount: {
            increment: 1,
          },
        },
      });
    } else {
      await prisma.searchQuery.create({
        data: {
          query,
          resultsCount: 1,
        },
      });
    }
  } catch (error) {
    console.error("Error tracking search query:", error);
  }
}

export async function getTopSearches(limit: number = 10, days: number = 30) {
  try {
    const dateFrom = new Date();
    dateFrom.setDate(dateFrom.getDate() - days);

    // Group by query and count occurrences
    const topSearches = await prisma.searchQuery.groupBy({
      by: ["query"],
      where: {
        createdAt: {
          gte: dateFrom,
        },
      },
      _count: {
        query: true,
      },
      orderBy: {
        _count: {
          query: "desc",
        },
      },
      take: limit,
    });

    return topSearches.map((search) => ({
      query: search.query,
      searchCount: search._count.query,
    }));
  } catch (error) {
    console.error("Error fetching top searches:", error);
    return [];
  }
}

export async function getTrendingSearches(limit: number = 10) {
  try {
    const now = new Date();
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const previous7Days = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    // Get searches from last 7 days
    const recentSearches = await prisma.searchQuery.groupBy({
      by: ["query"],
      where: {
        createdAt: {
          gte: last7Days,
        },
      },
      _count: {
        query: true,
      },
    });

    // Get searches from previous 7 days
    const previousSearches = await prisma.searchQuery.groupBy({
      by: ["query"],
      where: {
        createdAt: {
          gte: previous7Days,
          lt: last7Days,
        },
      },
      _count: {
        query: true,
      },
    });

    // Calculate growth rate
    const previousMap = new Map(
      previousSearches.map((s) => [s.query, s._count.query]),
    );

    const trending = recentSearches
      .map((recent) => {
        const recentCount = recent._count.query;
        const previousCount = previousMap.get(recent.query) || 0;
        const growthRate =
          previousCount === 0
            ? recentCount
            : ((recentCount - previousCount) / previousCount) * 100;

        return {
          query: recent.query,
          searchCount: recentCount,
          growthRate,
        };
      })
      .filter((item) => item.growthRate > 0)
      .sort((a, b) => b.growthRate - a.growthRate)
      .slice(0, limit);

    return trending;
  } catch (error) {
    console.error("Error fetching trending searches:", error);
    return [];
  }
}

export async function getAppliedJobs(
  userId: string,
  page: number = 1,
  limit: number = 12,
  search?: string,
  sortField?: "title" | "createdAt" | "salary",
  sortOrder?: "asc" | "desc",
): Promise<ApiResponse> {
  try {
    if (!userId) {
      return {
        success: false,
        message: "User id is required",
      };
    }

    const user = await prisma.user.findFirst({ where: { id: userId } });

    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    const skip = (page - 1) * limit;

    // Build where clause for search
    const whereClause = {
      userId,
      job: search
        ? {
            OR: [
              { title: { contains: search, mode: "insensitive" as const } },
              { company: { contains: search, mode: "insensitive" as const } },
              { location: { contains: search, mode: "insensitive" as const } },
            ],
          }
        : undefined,
    };

    // Build orderBy clause
    const orderBy =
      sortField === "title" || sortField === "salary"
        ? { job: { [sortField]: sortOrder || "desc" } }
        : { [sortField || "createdAt"]: sortOrder || "desc" };

    // Get total count for pagination
    const totalCount = await prisma.jobApplication.count({
      where: whereClause,
    });

    // Get applied jobs with pagination, search, and sorting
    const appliedJobs = await prisma.jobApplication.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy,
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
      },
    });

    const totalPages = Math.ceil(totalCount / limit);

    return {
      success: true,
      message: "User's applied jobs fetched successfully.",
      data: {
        appliedJobs,
        total: totalCount,
        page,
        limit,
        totalPages,
        hasMore: page < totalPages,
      },
    };
  } catch (error) {
    console.log("🚀 ~ getAppliedJobs ~ error:", error);
    return {
      success: false,
      message: "Failed to get user applied jobs.",
    };
  }
}

export type UserJobsType = Awaited<
  ReturnType<typeof getActiveJobs>
>["data"]["jobs"];
export type UserJobType = Awaited<ReturnType<typeof getJobDetails>>["data"];
export type CategoriesType = Awaited<ReturnType<typeof getCategories>>["data"];
export type UserApplicationsType = Awaited<
  ReturnType<typeof getUserApplications>
>["data"]["applications"];
export type AppliedJobType = NonNullable<
  Awaited<ReturnType<typeof getAppliedJobs>>
>["data"];
