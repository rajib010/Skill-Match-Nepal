import z from "zod";

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .min(3, "Name should be atleast 3 characters.")
    .max(100, "Max. 100 characters allowed."),
  email: z
    .email("Please enter a valid email address.")
    .trim()
    .max(100, "Max. 100 charactes allowed."),
  message: z
    .string()
    .trim()
    .min(1, "Message is required")
    .min(5, "Message should be atleast 5 characters.")
    .max(300, "Max. 300 characters allowed."),
});

export type ContactSchemaType = z.infer<typeof contactSchema>;
