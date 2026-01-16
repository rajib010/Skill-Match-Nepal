import { z } from "zod";

export const skillSchema = z.object({
  id: z.string().optional(),
  profileId: z.string().min(1, "Profile is required"),
  skillName: z.string().min(2, "Skill name must be at least 2 characters"),
  level: z.enum(["beginner", "intermediate", "expert"]).optional(),
});

export type SkillSchemaType = z.infer<typeof skillSchema>;

export const multipleSkillsSchema = z.object({
  profileId: z.string().min(1, "Profile is required"),
  skills: z
    .array(
      z.object({
        skillName: z.string().min(2, "Skill name is required"),
        level: z.enum(["beginner", "intermediate", "expert"]).optional(),
      })
    )
    .min(1, "At least one skill is required"),
});

export type MultipleSkillsSchemaType = z.infer<typeof multipleSkillsSchema>;
