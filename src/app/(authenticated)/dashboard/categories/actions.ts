"use server";

import { prisma } from "@/database/prisma";
import { getSignedInUser } from "@/lib/auth/server";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";
import { categorySchema, CategorySchemaType } from "./schema";
import slugify from "slugify";
import { uuidv4 } from "zod";
import { Prisma } from "@prisma/client";

export async function getAllCategory(
  page: number = 1,
  limit: number = 10,
  search?: string,
  sortField: "name" | "createdAt" | "jobs._count" = "createdAt",
  sortOrder: Prisma.SortOrder = "asc"
): Promise<ApiResponse> {
  try {
    const skip = (page - 1) * limit;
    const orderBy =
      sortField === "jobs._count"
        ? {
            jobs: {
              _count: sortOrder,
            },
          }
        : {
            [sortField]: sortOrder,
          };

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { description: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {};

    const [categories, totalCount] = await Promise.all([
      prisma.category.findMany({
        where,
        select: {
          name: true,
          description: true,
          _count: { select: { jobs: true } },
        },
        skip,
        take: limit,
        orderBy: orderBy,
      }),
      prisma.category.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);
    const currentPage = page;
    const hasNextPage = currentPage < totalPages;
    const hasPreviousPage = currentPage > 1;

    return {
      success: true,
      message: "Category information fetched successfully.",
      data: {
        categories,
        totalPages,
        currentPage,
        hasNextPage,
        hasPreviousPage,
      },
    };
  } catch (error) {
    console.log("🚀 ~ getAllCategory ~ error:", error);
    return {
      success: false,
      message: "Failed to get category information.",
    };
  }
}

export async function addNewCategory(
  data: CategorySchemaType
): Promise<ApiResponse> {
  try {
    const user = await getSignedInUser();

    if (user && user.role !== "admin") {
      return notFound();
    }

    const validation = categorySchema.safeParse(data);

    if (!validation.success) {
      return {
        success: false,
        message: "Invalid data provided.",
      };
    }

    const { name, description } = validation.data;

    const existingCategory = await prisma.category.findFirst({
      where: { name: { name, mode: "insensitive" as const } },
    });

    if (existingCategory) {
      return {
        success: false,
        message: "Category already exists.",
      };
    }

    let slug = slugify(name.toLowerCase());
    slug = slug.replace(/[^a-z0-9]+/g, "-");
    slug = slug.replace(/^-+|-+$/g, "");
    slug = `${slug}-${uuidv4()}`;

    await prisma.category.create({
      data: {
        name,
        description,
        slug,
      },
    });

    revalidatePath("/dashboard/category");

    return {
      success: true,
      message: "Category information added successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to add new category.",
    };
  }
}

export async function updateCategoryInfo(
  data: CategorySchemaType
): Promise<ApiResponse> {
  try {
    const user = await getSignedInUser();

    if (user && user.role !== "admin") {
      return notFound();
    }

    const validation = categorySchema.safeParse(data);

    if (!validation.success) {
      return {
        success: false,
        message: "Invalid data provided.",
      };
    }

    const { id, name, description } = validation.data;

    await prisma.category.update({
      where: { id },
      data: {
        name: name ?? undefined,
        description: description ?? undefined,
      },
    });

    revalidatePath("/dashboard/jobs");
    revalidatePath("/jobs");

    return {
      success: true,
      message: "Category information updated successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update category info.",
    };
  }
}

export async function deleteCategory(id: string): Promise<ApiResponse> {
  try {
    const user = await getSignedInUser();

    if (user && user.role !== "admin") {
      return notFound();
    }

    await prisma.category.delete({ where: { id } });

    revalidatePath("/dashboard/category");
    revalidatePath("/");

    return {
      success: true,
      message: "Category deleted successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to delete category info.",
    };
  }
}

export type CategoryType = NonNullable<
  Awaited<ReturnType<typeof getAllCategory>>
>["data"];
