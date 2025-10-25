"use server"

import { prisma } from "@/database/prisma";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function getAllUsers(
  page: number = 1,
  limit: number = 10,
  search?: string,
  sortField?: string,
  sortOrder?: "asc" | "desc"
): Promise<ApiResponse> {
  try {
    const skip = (page - 1) * limit;

    const whereClause: Prisma.UserWhereInput = {};

    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: "insensitive" as const } },
        { email: { contains: search, mode: "insensitive" as const } },
        {
          profile: {
            phone: { contains: search, mode: "insensitive" as const },
          },
        },
        {
          profile: {
            location: { contains: search, mode: "insensitive" as const },
          },
        },
      ];
    }

    whereClause.role = "user";

    // Build orderBy clause
    const orderByClause = sortField
      ? { [sortField]: sortOrder || "desc" }
      : { createdAt: "desc" as const };

    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: orderByClause,
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
          _count: {
            select: {
              applications: true,
            },
          },
        },
      }),
      prisma.user.count({ where: whereClause }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      success: true,
      message: "Users fetched successfully.",
      data: {
        users,
        currentPage: page,
        totalPages,
        limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  } catch (error: unknown) {
    let message = "Failed to fetch users.";
    if (error instanceof Error) message = error.message;

    return { success: false, message, data: null };
  }
}

export async function blockUser(id: string): Promise<ApiResponse> {
  try {
    await prisma.user.update({
      where: { id },
      data: {
        banned: true,
        banReason: "Banned by the admin.",
      },
    });
    revalidatePath("/dashboard/users");
    return { success: true, message: "User blocked successfully." };
  } catch (error) {
    let message = "Failed to block the user.";
    if (error instanceof Error) message = error.message;

    return { success: false, message, data: null };
  }
}

export type Users = Awaited<ReturnType<typeof getAllUsers>>["data"]["users"];
