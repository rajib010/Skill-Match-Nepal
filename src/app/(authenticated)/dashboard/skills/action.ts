"use server";

import { prisma } from "@/database/prisma";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function getAllSkills(
  page: number = 1,
  limit: number = 10,
  search?: string,
  sortField?: "skillName" | "level" | "createdAt",
  sortOrder?: "asc" | "desc",
): Promise<ApiResponse> {
  try {
    const skip = (page - 1) * limit;

    const whereClause: Prisma.UserSkillWhereInput = {};

    if (search) {
      whereClause.skillName = {
        contains: search,
        mode: "insensitive" as const,
      };
    }

    const orderByClause = sortField
      ? { [sortField]: sortOrder || "desc" }
      : { createdAt: "desc" as const };

    const [skills, totalCount] = await Promise.all([
      prisma.userSkill.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: orderByClause,
        include: {
          profile: {
            select: {
              id: true,
              userId: true,
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
        },
      }),
      prisma.userSkill.count({ where: whereClause }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      success: true,
      message: "Skills fetched successfully.",
      data: {
        skills,
        currentPage: page,
        totalPages,
        limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  } catch (error: unknown) {
    let message = "Failed to fetch skills.";
    if (error instanceof Error) message = error.message;

    return { success: false, message, data: null };
  }
}

export async function getSkillById(id: string): Promise<ApiResponse> {
  try {
    const skill = await prisma.userSkill.findUnique({
      where: { id },
      include: {
        profile: {
          select: {
            id: true,
            userId: true,
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
      },
    });

    if (!skill) {
      return {
        success: false,
        message: "Skill not found.",
        data: null,
      };
    }

    return {
      success: true,
      message: "Skill fetched successfully.",
      data: skill,
    };
  } catch (error: unknown) {
    let message = "Failed to fetch skill.";
    if (error instanceof Error) message = error.message;

    return { success: false, message, data: null };
  }
}

export async function getUserSkills(userId: string): Promise<ApiResponse> {
  try {
    // First, get the user's profile
    const profile = await prisma.userProfile.findUnique({
      where: { userId },
      include: {
        skills: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!profile) {
      return {
        success: false,
        message: "User profile not found.",
        data: null,
      };
    }

    return {
      success: true,
      message: "User skills fetched successfully.",
      data: profile.skills,
    };
  } catch (error: unknown) {
    let message = "Failed to fetch user skills.";
    if (error instanceof Error) message = error.message;

    return { success: false, message, data: null };
  }
}

export async function createSkill(data: {
  profileId: string;
  skillName: string;
  level?: string;
}): Promise<ApiResponse> {
  try {
    // Check if profile exists
    const profile = await prisma.userProfile.findUnique({
      where: { id: data.profileId },
    });

    if (!profile) {
      return {
        success: false,
        message: "User profile not found.",
        data: null,
      };
    }

    // Check if skill already exists for this profile
    const existingSkill = await prisma.userSkill.findUnique({
      where: {
        profileId_skillName: {
          profileId: data.profileId,
          skillName: data.skillName,
        },
      },
    });

    if (existingSkill) {
      return {
        success: false,
        message: "Skill already exists for this profile.",
        data: null,
      };
    }

    const skill = await prisma.userSkill.create({
      data,
      include: {
        profile: {
          select: {
            id: true,
            userId: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    revalidatePath("/profile");
    revalidatePath(`/profile/${profile.userId}`);

    return {
      success: true,
      message: "Skill created successfully.",
      data: skill,
    };
  } catch (error: unknown) {
    let message = "Failed to create skill.";
    if (error instanceof Error) message = error.message;

    return { success: false, message, data: null };
  }
}

export async function updateSkill(
  id: string,
  data: {
    skillName?: string;
    level?: string;
  }
): Promise<ApiResponse> {
  try {
    // Check if skill exists
    const existingSkill = await prisma.userSkill.findUnique({
      where: { id },
      include: {
        profile: true,
      },
    });

    if (!existingSkill) {
      return {
        success: false,
        message: "Skill not found.",
        data: null,
      };
    }

    // If updating skillName, check for duplicates
    if (data.skillName && data.skillName !== existingSkill.skillName) {
      const duplicate = await prisma.userSkill.findUnique({
        where: {
          profileId_skillName: {
            profileId: existingSkill.profileId,
            skillName: data.skillName,
          },
        },
      });

      if (duplicate) {
        return {
          success: false,
          message: "A skill with this name already exists for this profile.",
          data: null,
        };
      }
    }

    const updatedSkill = await prisma.userSkill.update({
      where: { id },
      data,
      include: {
        profile: {
          select: {
            id: true,
            userId: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    revalidatePath("/profile");
    revalidatePath(`/profile/${existingSkill.profile.userId}`);

    return {
      success: true,
      message: "Skill updated successfully.",
      data: updatedSkill,
    };
  } catch (error: unknown) {
    let message = "Failed to update skill.";
    if (error instanceof Error) message = error.message;

    return { success: false, message, data: null };
  }
}

export async function deleteSkill(id: string): Promise<ApiResponse> {
  try {
    // Check if skill exists
    const skill = await prisma.userSkill.findUnique({
      where: { id },
      include: {
        profile: true,
      },
    });

    if (!skill) {
      return {
        success: false,
        message: "Skill not found.",
        data: null,
      };
    }

    await prisma.userSkill.delete({
      where: { id },
    });

    revalidatePath("/profile");
    revalidatePath(`/profile/${skill.profile.userId}`);

    return {
      success: true,
      message: "Skill deleted successfully.",
      data: null,
    };
  } catch (error: unknown) {
    let message = "Failed to delete skill.";
    if (error instanceof Error) message = error.message;

    return { success: false, message, data: null };
  }
}

export async function createMultipleSkills(
  profileId: string,
  skills: Array<{ skillName: string; level?: string }>
): Promise<ApiResponse> {
  try {
    // Check if profile exists
    const profile = await prisma.userProfile.findUnique({
      where: { id: profileId },
    });

    if (!profile) {
      return {
        success: false,
        message: "User profile not found.",
        data: null,
      };
    }

    // Get existing skills to avoid duplicates
    const existingSkills = await prisma.userSkill.findMany({
      where: {
        profileId,
        skillName: {
          in: skills.map((s) => s.skillName),
        },
      },
      select: {
        skillName: true,
      },
    });

    const existingSkillNames = new Set(
      existingSkills.map((s) => s.skillName)
    );

    // Filter out duplicates
    const newSkills = skills.filter(
      (skill) => !existingSkillNames.has(skill.skillName)
    );

    if (newSkills.length === 0) {
      return {
        success: false,
        message: "All skills already exist for this profile.",
        data: null,
      };
    }

    // Create multiple skills
    const createdSkills = await prisma.userSkill.createMany({
      data: newSkills.map((skill) => ({
        profileId,
        skillName: skill.skillName,
        level: skill.level,
      })),
    });

    revalidatePath("/profile");
    revalidatePath(`/profile/${profile.userId}`);

    return {
      success: true,
      message: `${createdSkills.count} skill(s) created successfully.${
        existingSkills.length > 0
          ? ` ${existingSkills.length} duplicate(s) skipped.`
          : ""
      }`,
      data: { count: createdSkills.count },
    };
  } catch (error: unknown) {
    let message = "Failed to create skills.";
    if (error instanceof Error) message = error.message;

    return { success: false, message, data: null };
  }
}

export async function deleteAllUserSkills(
  profileId: string
): Promise<ApiResponse> {
  try {
    // Check if profile exists
    const profile = await prisma.userProfile.findUnique({
      where: { id: profileId },
      include: {
        _count: {
          select: {
            skills: true,
          },
        },
      },
    });

    if (!profile) {
      return {
        success: false,
        message: "User profile not found.",
        data: null,
      };
    }

    const deletedCount = await prisma.userSkill.deleteMany({
      where: { profileId },
    });

    revalidatePath("/profile");
    revalidatePath(`/profile/${profile.userId}`);

    return {
      success: true,
      message: `${deletedCount.count} skill(s) deleted successfully.`,
      data: { count: deletedCount.count },
    };
  } catch (error: unknown) {
    let message = "Failed to delete skills.";
    if (error instanceof Error) message = error.message;

    return { success: false, message, data: null };
  }
}

// Type exports
export type SkillsType = Awaited<
  ReturnType<typeof getAllSkills>
>["data"]["skills"];
export type SkillType = Awaited<ReturnType<typeof getSkillById>>["data"];
export type UserSkillsType = Awaited<ReturnType<typeof getUserSkills>>["data"];