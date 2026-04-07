import z from "zod";

export const jobSchema = z.object({
  id: z.string().optional(),
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(5000, "Description must be less than 5000 characters"),
  company: z
    .string()
    .min(2, "Company name is required")
    .max(100, "Company name must be less than 100 characters"),
  location: z
    .string()
    .min(2, "Location is required")
    .max(100, "Location must be less than 100 characters"),
  salary: z
    .string()
    .max(50, "Salary must be less than 50 characters")
    .optional()
    .or(z.literal("")),
  jobType: z.string().min(1, "Please select the job type."),
  isActive: z.boolean(),
  categoryId: z
    .string()
    .trim()
    .min(1, "Please select a category.")
    .max(100, "Max. 100 characters allowed."),
  requirements: z
    .array(
      z.object({
        skillName: z
          .string()
          .min(1, "Skill name is required.")
          .max(50, "Skill name must be less than 50 characters."),
        required: z.boolean(),
      })
    )
    .min(1, "At least one skill is required."),
  expiresAt: z
    .string()
    .min(1, "Expiry Date is required")
    .max(100, "Max. 100 characters allowed."),
});

export type JobSchemaType = z.infer<typeof jobSchema>;
