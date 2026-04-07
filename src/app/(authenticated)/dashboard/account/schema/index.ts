import z from "zod";
import {
  PASSWORD_REGEX,
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_ERROR_MSG,
} from "@/lib/validation/password";
import { PHONE_REGEX, PHONE_ERROR_MSG } from "@/lib/validation/phone";

export const changePasswordSchema = z
  .object({
    id: z.string().optional(),
    oldPassword: z
      .string()
      .min(1, "Old Password is required.")
      .max(PASSWORD_MAX_LENGTH, `Max. ${PASSWORD_MAX_LENGTH} characters allowed.`),
    newPassword: z
      .string()
      .min(PASSWORD_MIN_LENGTH, "Password must be at least 8 characters.")
      .regex(PASSWORD_REGEX, PASSWORD_ERROR_MSG)
      .max(PASSWORD_MAX_LENGTH, `Max. ${PASSWORD_MAX_LENGTH} characters allowed.`),
    confirmPassword: z
      .string()
      .min(1, "Confirm password is required.")
      .max(PASSWORD_MAX_LENGTH, `Max. ${PASSWORD_MAX_LENGTH} characters allowed.`),
  })
  .superRefine(({ newPassword, confirmPassword }, ctx) => {
    if (newPassword !== confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords donot match.",
        path: ["confirmPassword"],
      });
    }
  });

export const updateUserSchema = z.object({
  id: z.string().trim().min(1, "Id is required."),
  name: z
    .string()
    .trim()
    .min(1, "Name is required.")
    .min(3, "Name should atleast be 3 characters.")
    .regex(/^[A-Za-z]{3,}(?: [A-Za-z]{3,})*\s*$/, "Please enter a valid name.")
    .max(25, "Max. 25 characters allowed."),
  email: z.email().trim().max(100, "Max. 100 characters allowed."),
  image: z.string().optional(),
  contactPhone: z
    .string()
    .trim()
    .regex(PHONE_REGEX, PHONE_ERROR_MSG)
    .optional()
    .or(z.literal("")),
});

export type ChangePasswordSchemaType = z.infer<typeof changePasswordSchema>;
export type UpdateUserDetailSchemaType = z.infer<typeof updateUserSchema>;
