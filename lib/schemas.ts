import { z } from "zod";

export const SectionTypeSchema = z.enum([
  "EXPERIENCE",
  "EDUCATION",
  "SKILLS",
  "PROJECTS",
  "LANGUAGES",
]);
export type SectionType = z.infer<typeof SectionTypeSchema>;

export const ExperienceDataSchema = z.object({
  company: z.string().optional(),
  location: z.string().optional(),
  role: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  description: z.string().optional(),
  bullets: z.array(z.string()).optional(),
  techStack: z.array(z.string()).optional(),
});

export const EducationDataSchema = z.object({
  institution: z.string().optional(),
  location: z.string().optional(),
  degree: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  description: z.string().optional(),
  bullets: z.array(z.string()).optional(),
});

export const SkillsDataSchema = z.object({
  category: z.string().optional(),
  items: z.array(z.string()).optional(),
});

export const ProjectsDataSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  techStack: z.array(z.string()).optional(),
  link: z.string().optional(),
  bullets: z.array(z.string()).optional(),
});

export const LanguagesDataSchema = z.object({
  language: z.string().optional(),
  proficiency: z.string().optional(),
});

export const SectionItemDataSchema = z.union([
  ExperienceDataSchema,
  EducationDataSchema,
  SkillsDataSchema,
  ProjectsDataSchema,
  LanguagesDataSchema,
]);

export const SectionItemSchema = z.object({
  id: z.string(),
  sectionId: z.string(),
  order: z.number(),
  data: SectionItemDataSchema,
});

export const SectionSchema = z.object({
  id: z.string(),
  cvId: z.string(),
  type: SectionTypeSchema,
  title: z.string(),
  order: z.number(),
  visible: z.boolean(),
  items: z.array(SectionItemSchema),
});

export const CVSchema = z.object({
  id: z.string(),
  presetId: z.string(),
  name: z.string().optional(),
  title: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  linkedin: z.string().optional(),
  github: z.string().optional(),
  website: z.string().optional(),
  driverLicense: z.string().optional(),
  dateOfBirth: z.string().optional(),
  summary: z.string().optional(),
  sections: z.array(SectionSchema),
});

export const PresetSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  isDefault: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  cv: CVSchema.optional(),
});

export type ExperienceData = z.infer<typeof ExperienceDataSchema>;
export type EducationData = z.infer<typeof EducationDataSchema>;
export type SkillsData = z.infer<typeof SkillsDataSchema>;
export type ProjectsData = z.infer<typeof ProjectsDataSchema>;
export type LanguagesData = z.infer<typeof LanguagesDataSchema>;
export type SectionItemData = z.infer<typeof SectionItemDataSchema>;
export type SectionItem = z.infer<typeof SectionItemSchema>;
export type Section = z.infer<typeof SectionSchema>;
export type CV = z.infer<typeof CVSchema>;
export type Preset = z.infer<typeof PresetSchema>;

export const emptyExperience: ExperienceData = { bullets: [], techStack: [] };
export const emptyEducation: EducationData = { bullets: [] };
export const emptySkills: SkillsData = { items: [] };
export const emptyProjects: ProjectsData = { techStack: [], bullets: [] };
export const emptyLanguage: LanguagesData = {};

export type NewPresetCreateArgs =
  | { source: "blank"; name: string }
  | { source: "duplicate"; name: string; fromPresetId: string };
