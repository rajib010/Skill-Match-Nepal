"use server";

import { prisma } from "@/database/prisma";
import { getSignedInUser } from "@/lib/auth/server";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";
import { contactSchema, ContactSchemaType } from "./schema";
import { Prisma } from "@prisma/client";
import { GOOGLE_RECAPTCHA_SECRET_KEY, MAIL } from "@/config";
import { sendMail } from "@/lib/mailer";
import VisitorMessage from "@/mail/visitor-message";

export async function getAllContacts(
  page: number = 1,
  limit: number = 10,
  search?: string,
  sortField: "name" | "createdAt" = "name",
  sortOrder: "asc" | "desc" = "asc",
): Promise<ApiResponse> {
  try {
    const user = await getSignedInUser();

    if (!user || user.role !== "admin") {
      return notFound();
    }

    const skip = (page - 1) * limit;

    const whereClause: Prisma.ContactWhereInput = {
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { email: { contains: search, mode: "insensitive" as const } },
        ],
      }),
    };

    const [contacts, totalCount] = await Promise.all([
      prisma.contact.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { [sortField]: sortOrder },
      }),
      prisma.contact.count({ where: whereClause }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      success: true,
      message: "Contact information fetched successfull.",
      data: {
        contacts,
        totalPages,
        currentPage: page,
        hasPreviousPage: page > 1,
        hasNextPage: page < totalPages,
      },
    };
  } catch {
    return {
      success: false,
      message: "Failed to get contact information.",
    };
  }
}

export async function sendContactMessage(
  data: ContactSchemaType,
  captchaToken: string,
): Promise<ApiResponse> {
  try {
    //validate captcha first

    const secret = GOOGLE_RECAPTCHA_SECRET_KEY;

    const captchaResponse = await fetch(
      `https://www.google.com/recaptcha/api/siteverify`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `secret=${secret}&response=${captchaToken}`,
      },
    );

    const resData = await captchaResponse.json();

    if (!resData.success) {
      return {
        success: false,
        message: "Invalid captcha key.",
      };
    }

    const validation = contactSchema.safeParse(data);

    if (!validation.success) {
      return {
        success: false,
        message: "Invalid data provided.",
      };
    }

    const { email, message, name } = validation.data;

    await prisma.contact.create({ data: { email, message, name } });

    await sendMail({
      from: email,
      to: MAIL.FROM_ADDRESS,
      subject: "Visitor's Message",
      content: {
        template: VisitorMessage,
        props: {
          user: name,
          message,
        },
      },
    });

    revalidatePath("/dashboard/contact");

    return {
      success: true,
      message: "Thank you for contacting us. We'll reach you soon.",
    };
  } catch (error) {
    console.log("🚀 ~ sendContactMessage ~ error:", error);
    return {
      success: false,
      message: "Failed to send message. Please try again later.",
    };
  }
}

export async function deleteContact(id: string): Promise<ApiResponse> {
  try {
    if (!id || id.trim() === "") {
      return {
        success: false,
        message: "Invalid data provided.",
      };
    }

    await prisma.contact.delete({ where: { id } });
    revalidatePath("/dashboard/contact");

    return {
      success: true,
      message: "Contact information deleted successfully.",
    };
  } catch {
    return {
      success: false,
      message: "Failed to delete contact.",
    };
  }
}

export type ContactType = Awaited<
  ReturnType<typeof getAllContacts>
>["data"]["contact"];
