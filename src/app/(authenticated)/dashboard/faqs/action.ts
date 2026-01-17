"use server";

import { prisma } from "@/database/prisma";
import { getSignedInUser } from "@/lib/auth/server";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";
import { FaqSchemaType, faqsSchema } from "./schema";

interface ReorderFaqInput {
  ids: string[];
}

export async function getAllFaqs(
  page: number = 1,
  limit: number = 10,
  search?: string,
  sortField = "position",
  sortOrder = "asc"
): Promise<ApiResponse> {
  try {
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { question: { contains: search, mode: "insensitive" as const } },
            { answer: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {};

    const [faqs, totalCount] = await Promise.all([
      prisma.faq.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortField]: sortOrder },
      }),
      prisma.faq.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);
    const currentPage = page;
    const hasNextPage = currentPage < totalPages;
    const hasPreviousPage = currentPage > 1;

    return {
      success: true,
      message: "Faqs information fetched successfully.",
      data: {
        faqs,
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
          : "Failed to get faq information.",
    };
  }
}

export async function addNewFaq(data: FaqSchemaType): Promise<ApiResponse> {
  try {
    const user = await getSignedInUser();

    if (user && user.role !== "admin") {
      return notFound();
    }

    const validation = faqsSchema.safeParse(data);

    if (!validation.success) {
      return {
        success: false,
        message: "Invalid data provided.",
      };
    }

    const { question, answer } = validation.data;

    const count = await prisma.faq.count();

    await prisma.faq.create({
      data: {
        question,
        answer,
        position: count + 1,
      },
    });

    revalidatePath("/dashboard/faqs");
    revalidatePath("/");

    return {
      success: true,
      message: "Faqs information added successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to add new faq.",
    };
  }
}

export async function updateFaqInfo(data: FaqSchemaType): Promise<ApiResponse> {
  try {
    const user = await getSignedInUser();

    if (user && user.role !== "admin") {
      return notFound();
    }

    const validation = faqsSchema.safeParse(data);

    if (!validation.success) {
      return {
        success: false,
        message: "Invalid data provided.",
      };
    }

    const { id, question, answer } = validation.data;

    await prisma.faq.update({
      where: { id },
      data: {
        question: question ?? undefined,
        answer: answer ?? undefined,
      },
    });

    revalidatePath("/dashboard/faqs");

    return {
      success: true,
      message: "Faqs information updated successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to update faq info.",
    };
  }
}

export async function deleteFaq(id: string): Promise<ApiResponse> {
  try {
    const user = await getSignedInUser();

    if (user && user.role !== "admin") {
      return notFound();
    }

    const currentFaq = await prisma.faq.findFirst({
      where: { id },
    });

    if (!currentFaq) {
      return {
        success: false,
        message: "Faq not found.",
      };
    }

    await prisma.faq.delete({ where: { id } });

    revalidatePath("/dashboard/faq");
    revalidatePath("/");

    return {
      success: true,
      message: "Faq deleted successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to delete faq info.",
    };
  }
}

export async function reorderFaq({
  ids,
}: ReorderFaqInput): Promise<ApiResponse> {
  try {
    const user = await getSignedInUser();

    if (user && user.role !== "admin") {
      return {
        success: false,
        message: "Unauthorized request.",
      };
    }

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return {
        success: false,
        message: "No FAQ IDs provided for reordering.",
      };
    }

    // first temporary positions to avoid unique constraint conflicts
    await prisma.$transaction(
      ids.map((id, idx) =>
        prisma.faq.update({
          where: { id },
          data: { position: idx + 1000 }, // temporary safe positions
        })
      )
    );

    // sthen final positions
    await prisma.$transaction(
      ids.map((id, idx) =>
        prisma.faq.update({
          where: { id },
          data: { position: idx + 1 },
        })
      )
    );

    revalidatePath("/dashboard/faqs");
    revalidatePath("/");

    return {
      success: true,
      message: "Faqs reordered successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to reorder faqs.",
    };
  }
}

export type FaqType = Awaited<ReturnType<typeof getAllFaqs>>["data"]["faq"];
