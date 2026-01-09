"use server";

import { prisma } from "@/database/prisma";
import { getSignedInUser } from "@/lib/auth/server";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";
import { testimonialSchema, TestimonialSchemaType } from "./schema";

export async function getAllTestimonials(
  page: number = 1,
  limit: number = 10,
  search?: string,
  sortField: "name" | "createdAt" = "name",
  sortOrder: "asc" | "desc" = "asc"
): Promise<ApiResponse> {
  try {
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { address: { contains: search, mode: "insensitive" as const } },
            { message: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {};

    const [testimonials, totalCount] = await Promise.all([
      prisma.testimonial.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortField]: sortOrder },
      }),
      prisma.testimonial.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);
    const currentPage = page;
    const hasNextPage = currentPage < totalPages;
    const hasPreviousPage = currentPage > 1;

    return {
      success: true,
      message: "Testimonial fetched successfully.",
      data: {
        testimonials,
        totalPages,
        currentPage,
        hasNextPage,
        hasPreviousPage,
      },
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to get testimonial information.",
    };
  }
}

export async function addNewTestimonial(
  data: TestimonialSchemaType
): Promise<ApiResponse> {
  try {
    const user = await getSignedInUser();

    if (user.role !== "admin") {
      return notFound();
    }

    const validation = testimonialSchema.safeParse(data);

    if (!validation.success) {
      return {
        success: false,
        message: "Invalid data provided.",
      };
    }

    const { address, message, name, rating } = validation.data;

    await prisma.testimonial.create({
      data: {
        address: address,
        message: message,
        name: name,
        rating: Number(rating) || 1,
      },
    });

    revalidatePath("/dashboard/testimonials");
    revalidatePath("/");

    return {
      success: true,
      message: "Testimonial information added successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to add new testimonial.",
    };
  }
}

export async function updateTestimonialInfo(
  data: TestimonialSchemaType
): Promise<ApiResponse> {
  try {
    const user = await getSignedInUser();

    if (user.role !== "admin") {
      return notFound();
    }

    const validation = testimonialSchema.safeParse(data);

    if (!validation.success) {
      return {
        success: false,
        message: "Invalid data provided.",
      };
    }

    const { id, name, address, message, rating } = validation.data;

    await prisma.testimonial.update({
      where: { id },
      data: {
        name: name ?? undefined,
        address: address ?? undefined,
        message: message ?? undefined,
        rating: Number(rating) ?? undefined,
      },
    });

    revalidatePath("/dashboard/testimonials");

    return {
      success: true,
      message: "Testimonial information updated successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update testimonial info.",
    };
  }
}

export async function deleteTestimonial(id: string): Promise<ApiResponse> {
  try {
    const user = await getSignedInUser();

    if (user.role !== "admin") {
      return notFound();
    }

    const testimonial = await prisma.testimonial.findFirst({
      where: { id },
    });

    if (!testimonial) {
      return {
        success: false,
        message: "Testimonial not found.",
      };
    }

    await prisma.testimonial.delete({ where: { id } });

    revalidatePath("/dashboard/testimonail");
    revalidatePath("/");

    return {
      success: true,
      message: "Testimonial deleted successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to delete testimonial info.",
    };
  }
}

export type TestimonialType = Awaited<
  ReturnType<typeof getAllTestimonials>
>["data"]["testimonials"];
