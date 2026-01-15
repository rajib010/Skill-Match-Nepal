import z from "zod";

export const changePasswordSchema = z
  .object({
    id: z.string().optional(),
    oldPassword: z
      .string()
      .trim()
      .min(1, "Old Password is required.")
      .max(100, "Max. 100 characters allowed."),
    newPassword: z
      .string()
      .trim()
      .min(1, "New password is required.")
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).+$/,
        "Password must contain letters, numbers, and special characters."
      )
      .max(100, "Max. 100 characters allowed."),
    confirmPassword: z
      .string()
      .trim()
      .min(1, "Confirm password is required.")
      .max(100, "Max. 100 characters allowed."),
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
    .refine(
      (val) => /^\d{10}$/.test(val),
      "Contact number must be exactly 10 digits."
    ),
});

export type ChangePasswordSchemaType = z.infer<typeof changePasswordSchema>;
export type UpdateUserDetailSchemaType = z.infer<typeof updateUserSchema>;
