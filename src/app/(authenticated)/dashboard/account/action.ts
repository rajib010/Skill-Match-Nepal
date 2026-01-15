"use server";

import { prisma } from "@/database/prisma";
import { getSignedInUser } from "@/lib/auth/server";
import { UpdateUserDetailSchemaType, updateUserSchema } from "./schema";
import { revalidatePath } from "next/cache";

export async function getUserDetail(): Promise<ApiResponse> {
  try {
    const user = await getSignedInUser();

    if (!user) {
      return {
        success: false,
        message: "Unauthorized request.",
      };
    }

    const data = await prisma.user.findUnique({
      where: { id: user.id },
    });

    return {
      success: true,
      message: "User data fetched successfull.",
      data,
    };
  } catch {
    return {
      success: false,
      message: "Failed to get user data.",
    };
  }
}

export async function updateUserDetail(
  data: UpdateUserDetailSchemaType
): Promise<ApiResponse> {
  try {
    const validation = updateUserSchema.safeParse(data);

    if (!validation.success) {
      return {
        success: false,
        message: "Invalid data provided.",
      };
    }

    const { id, name, image } = validation.data;

    const user = await getSignedInUser();

    if (!user) {
      return {
        success: false,
        message: "Unauthorized request.",
      };
    }

    if (user.id !== id) {
      return {
        success: false,
        message: "Unauthorized: Cannot update another user's profile.",
      };
    }

    //atomic update
    await prisma.$transaction(async (tx) => {
      const updateData: Record<string, string | null> = {};
      if (name) updateData.name = name;
      if (image !== undefined) updateData.image = image;

      if (Object.keys(updateData).length > 0) {
        await tx.user.update({
          where: { id },
          data: updateData,
        });
      }
    });

    revalidatePath("/dashboard/account");

    return {
      success: true,
      message: "User information updated successfully.",
    };
  } catch {
    return {
      success: false,
      message: "Failed to update user information.",
    };
  }
}

export type UserDetailType = NonNullable<
  Awaited<ReturnType<typeof getUserDetail>>["data"]
>;
