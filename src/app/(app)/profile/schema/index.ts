import z from "zod";
import {
  PASSWORD_REGEX,
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_ERROR_MSG,
} from "@/lib/validation/password";
import { PHONE_REGEX, PHONE_ERROR_MSG } from "@/lib/validation/phone";

export const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name should be at least 3 characters.")
    .max(50, "Max. 50 characters allowed."),
  phone: z
    .string()
    .trim()
    .regex(PHONE_REGEX, PHONE_ERROR_MSG)
    .optional()
    .or(z.literal("")),
  location: z
    .string()
    .trim()
    .max(100, "Max. 100 characters allowed.")
    .optional()
    .or(z.literal("")),
  bio: z
    .string()
    .trim()
    .max(500, "Max. 500 characters allowed.")
    .optional()
    .or(z.literal("")),
  experience: z
    .string()
    .trim()
    .max(1000, "Max. 1000 characters allowed.")
    .optional()
    .or(z.literal("")),
  education: z
    .string()
    .trim()
    .max(500, "Max. 500 characters allowed.")
    .optional()
    .or(z.literal("")),
});

export type ProfileSchemaType = z.infer<typeof profileSchema>;

export const skillSchema = z.object({
  skillName: z
    .string()
    .trim()
    .min(1, "Skill name is required.")
    .max(50, "Skill name must be less than 50 characters.")
    .regex(/^[a-zA-Z0-9\s\-_.+#/]+$/, "Skill name contains invalid characters."),
  level: z.enum(["beginner", "intermediate", "expert"]),
});

export type SkillSchemaType = z.infer<typeof skillSchema>;

export const changeProfilePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, "Current password is required.")
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
        message: "Passwords do not match.",
        path: ["confirmPassword"],
      });
    }
  });

export type ChangeProfilePasswordSchemaType = z.infer<
  typeof changeProfilePasswordSchema
>;
