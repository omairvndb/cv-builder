import type { Language, SectionType } from "@/lib/schemas";

type PdfLabels = {
  sectionTitles: Record<SectionType, string>;
  personalInfo: string;
  profile: string;
  driverLicense: string; // prefix, rendered as `${driverLicense}: ${value}`
};

export const PDF_LABELS: Record<Language, PdfLabels> = {
  NL: {
    sectionTitles: {
      EDUCATION: "Opleiding",
      EXPERIENCE: "Werkervaring",
      SKILLS: "Technische vaardigheden",
      PROJECTS: "Projecten",
      LANGUAGES: "Talen",
      CERTIFICATIONS: "Certificaten",
      REFERENCES: "Referenties",
    },
    personalInfo: "Persoonlijke Info",
    profile: "Profiel",
    driverLicense: "Rijbewijs",
  },
  EN: {
    sectionTitles: {
      EDUCATION: "Education",
      EXPERIENCE: "Work Experience",
      SKILLS: "Technical Skills",
      PROJECTS: "Projects",
      LANGUAGES: "Languages",
      CERTIFICATIONS: "Certifications",
      REFERENCES: "References",
    },
    personalInfo: "Personal Info",
    profile: "Profile",
    driverLicense: "Driver's License",
  },
};
