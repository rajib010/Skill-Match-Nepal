import { z } from "zod";

export const faqsSchema = z.object({
  id: z.string().optional(),
  question: z
    .string()
    .trim()
    .min(1, "Question is required")
    .min(5, "Question must be at least 5 characters")
    .max(100, "Question must be less than 100 characters"),
  answer: z
    .string()
    .trim()
    .min(1, "Answer is required.")
    .min(5, "Answer must be at least 5 characters.")
    .max(400, "Max. 400 characters allowed."),
});

export type FaqSchemaType = z.infer<typeof faqsSchema>;
