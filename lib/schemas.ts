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
  company: z.string(),
  location: z.string(),
  role: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  description: z.string(),
  bullets: z.array(z.string()).optional(),
  techStack: z.array(z.string()).optional(),
});

export const EducationDataSchema = z.object({
  institution: z.string(),
  location: z.string().optional(),
  degree: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  description: z.string().optional(),
  bullets: z.array(z.string()).optional(),
});

export const SkillsDataSchema = z.object({
  category: z.string(),
  items: z.array(z.string()),
});

export const ProjectsDataSchema = z.object({
  title: z.string(),
  description: z.string(),
  techStack: z.array(z.string()),
  link: z.string().optional(),
  bullets: z.array(z.string()).optional(),
});

export const LanguagesDataSchema = z.object({
  language: z.string(),
  proficiency: z.string(),
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
  name: z.string().min(1),
  title: z.string().optional(),
  email: z.string(),
  phone: z.string(),
  location: z.string(),
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

export const emptyExperience: ExperienceData = {
  company: "",
  location: "",
  role: "",
  startDate: "",
  endDate: "",
  description: "",
  bullets: [],
};

export const emptyEducation: EducationData = {
  institution: "",
  degree: "",
  startDate: "",
  endDate: "",
};

export const emptySkills: SkillsData = { category: "", items: [] };

export const emptyProjects: ProjectsData = {
  title: "",
  description: "",
  techStack: [],
  link: undefined,
  bullets: [],
};

export const emptyLanguage: LanguagesData = { language: "", proficiency: "" };

export type NewPresetCreateArgs =
  | { source: "blank"; name: string }
  | { source: "duplicate"; name: string; fromPresetId: string };
