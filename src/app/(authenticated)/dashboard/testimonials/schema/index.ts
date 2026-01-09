import { z } from "zod";

export const testimonialSchema = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name must be less than 25 characters"),
  address: z
    .string()
    .trim()
    .min(1, "Address is required")
    .min(3, "Address must be at least 3 characters")
    .max(100, "Address must be less than 25 characters"),
  message: z
    .string()
    .trim()
    .min(1, "Message is required")
    .min(10, "Message must be at least 10 characters")
    .max(150, "Message must be less than 170 characters"),
  rating: z
    .string()
    .trim()
    .min(1, "Rating is required")
    .refine((val) => Number(val) > 0, "Rating should be greater than 0")
    .refine((val) => Number(val) < 6, "Rating cannot be greater than 5"),
});

export type TestimonialSchemaType = z.infer<typeof testimonialSchema>;
