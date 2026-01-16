// app/profile/actions.ts
"use server";

import { revalidatePath } from "next/cache";

import bcrypt from "bcryptjs";
import { getSignedInUser } from "@/lib/auth/server";
import { prisma } from "@/database/prisma";

export async function getUserDetail(id: string): Promise<ApiResponse> {
  try {
    if (!id) {
      return { success: false, message: "Id is required." };
    }
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        profile: {
          select: {
            id: true,
            phone: true,
            location: true,
            bio: true,
            experience: true,
            education: true,
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
    });

    if (!user) {
      return { success: false, message: "User doesnot exits." };
    }

    return { success: true, message: "Fetched successfull.", data: user };
  } catch (error) {
    console.log("🚀 ~ getUserDetail ~ error:", error);
    return { success: false, message: "Failed to get user details." };
  }
}

// Update user profile
export async function updateProfile(data: {
  name: string;
  phone: string;
  location: string;
  bio: string;
  experience: string;
  education: string;
}): Promise<ApiResponse> {
  try {
    const session = await getSignedInUser();

    if (!session?.id) {
      return { success: false, message: "Unauthorized" };
    }

    const { name, phone, location, bio, experience, education } = data;

    // Update user name
    await prisma.user.update({
      where: { id: session.id },
      data: { name, updatedAt: new Date() },
    });

    // Upsert user profile
    await prisma.userProfile.upsert({
      where: { userId: session.id },
      update: {
        phone: phone || null,
        location: location || null,
        bio: bio || null,
        experience: experience || null,
        education: education || null,
        updatedAt: new Date(),
      },
      create: {
        userId: session.id,
        phone: phone || null,
        location: location || null,
        bio: bio || null,
        experience: experience || null,
        education: education || null,
      },
    });

    revalidatePath("/profile");
    return { success: true, message: "Logged in successfull." };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { success: false, message: "Failed to update profile" };
  }
}

// Add skill to user profile
export async function addSkill(
  skillName: string,
  level: string
): Promise<ApiResponse> {
  try {
    const session = await getSignedInUser();

    if (!session?.id) {
      return { success: false, message: "Unauthorized" };
    }

    if (!skillName.trim()) {
      return { success: false, message: "Skill name is required" };
    }

    // Get or create user profile
    const profile = await prisma.userProfile.upsert({
      where: { userId: session.id },
      update: {},
      create: { userId: session.id },
    });

    // Add skill
    await prisma.userSkill.create({
      data: {
        profileId: profile.id,
        skillName: skillName.trim(),
        level: level || "intermediate",
      },
    });

    revalidatePath("/profile");
    return { success: true, message: "Successfull" };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // Handle unique constraint violation
    if (error.code === "P2002") {
      return { success: false, message: "Skill already exists" };
    }
    console.error("Error adding skill:", error);
    return { success: false, message: "Failed to add skill" };
  }
}

// Delete skill from user profile
export async function deleteSkill(skillId: string): Promise<ApiResponse> {
  try {
    const session = await getSignedInUser();

    if (!session?.id) {
      return { success: false, message: "Unauthorized" };
    }

    // Verify skill belongs to user
    const skill = await prisma.userSkill.findUnique({
      where: { id: skillId },
      include: { profile: true },
    });

    if (!skill || skill.profile.userId !== session.id) {
      return { success: false, message: "Skill not found or unauthorized" };
    }

    // Delete skill
    await prisma.userSkill.delete({
      where: { id: skillId },
    });

    revalidatePath("/profile");
    return { success: true, message: "Skill Deleted successfull." };
  } catch (error) {
    console.error("Error deleting skill:", error);
    return { success: false, message: "Failed to delete skill" };
  }
}

// Delete user account
export async function deleteAccount(password: string): Promise<ApiResponse> {
  try {
    const session = await getSignedInUser();

    if (!session?.id) {
      return { success: false, message: "Unauthorized" };
    }

    if (!password) {
      return { success: false, message: "Password is required" };
    }

    // Get user account with password
    const account = await prisma.account.findFirst({
      where: {
        userId: session.id,
        providerId: "credential", // Adjust based on your auth provider
      },
    });

    if (!account?.password) {
      return {
        success: false,
        message: "Account not found or password not set",
      };
    }

    // Verify password
    const isValid = await bcrypt.compare(password, account.password);
    if (!isValid) {
      return { success: false, message: "Incorrect password" };
    }

    // Delete user
    await prisma.user.delete({
      where: { id: session.id },
    });

    revalidatePath("/profile");
    return { success: true, message: "Account deleted successfull." };
  } catch (error) {
    console.error("Error deleting account:", error);
    return { success: false, message: "Failed to delete account" };
  }
}
