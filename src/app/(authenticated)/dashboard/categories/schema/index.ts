import { z } from "zod";

export const categorySchema = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  description: z.string().trim().optional(),
});

export type CategorySchemaType = z.infer<typeof categorySchema>;
