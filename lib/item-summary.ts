import type {
  CertificationsData,
  EducationData,
  ExperienceData,
  LanguagesData,
  ProjectsData,
  ReferencesData,
  SectionItemData,
  SectionType,
  SkillsData,
} from "@/lib/schemas";

export type ItemSummary = { primary: string; secondary?: string };

export const FRIENDLY_TYPE: Record<SectionType, string> = {
  EXPERIENCE: "Experience",
  EDUCATION: "Education",
  SKILLS: "Skill group",
  PROJECTS: "Project",
  LANGUAGES: "Language",
  CERTIFICATIONS: "Certification",
  REFERENCES: "Reference",
};

function joinNonEmpty(parts: Array<string | undefined | null>, sep: string): string {
  return parts.filter((p): p is string => Boolean(p && p.trim())).join(sep);
}

function dateRange(start?: string, end?: string): string | undefined {
  const s = start?.trim();
  const e = end?.trim();
  if (s && e) return `${s} - ${e}`;
  return s || e || undefined;
}

function emptyOr(value: string | undefined): string | undefined {
  return value && value.length > 0 ? value : undefined;
}

function fallbackPrimary(type: SectionType, primary: string): string {
  return primary || `Untitled ${FRIENDLY_TYPE[type].toLowerCase()}`;
}

export function summarizeItem(type: SectionType, data: SectionItemData): ItemSummary {
  switch (type) {
    case "EXPERIENCE": {
      const d = data as ExperienceData;
      return {
        primary: fallbackPrimary(type, joinNonEmpty([d.role, d.company], " @ ")),
        secondary: dateRange(d.startDate, d.endDate),
      };
    }
    case "EDUCATION": {
      const d = data as EducationData;
      return {
        primary: fallbackPrimary(type, joinNonEmpty([d.degree, d.institution], " @ ")),
        secondary: dateRange(d.startDate, d.endDate),
      };
    }
    case "SKILLS": {
      const d = data as SkillsData;
      const count = d.items?.length ?? 0;
      return {
        primary: fallbackPrimary(type, d.category ?? ""),
        secondary: count > 0 ? `${count} ${count === 1 ? "skill" : "skills"}` : undefined,
      };
    }
    case "PROJECTS": {
      const d = data as ProjectsData;
      const tech = d.techStack && d.techStack.length > 0 ? d.techStack.join(", ") : undefined;
      return {
        primary: fallbackPrimary(type, d.title ?? ""),
        secondary: tech ?? emptyOr(d.description?.trim()),
      };
    }
    case "LANGUAGES": {
      const d = data as LanguagesData;
      return {
        primary: fallbackPrimary(type, d.language ?? ""),
        secondary: emptyOr(d.proficiency),
      };
    }
    case "CERTIFICATIONS": {
      const d = data as CertificationsData;
      return {
        primary: fallbackPrimary(type, d.name ?? ""),
        secondary: emptyOr(joinNonEmpty([d.issuer, d.date], ", ")),
      };
    }
    case "REFERENCES": {
      const d = data as ReferencesData;
      return {
        primary: fallbackPrimary(type, d.name ?? ""),
        secondary: emptyOr(joinNonEmpty([d.role, d.company], " @ ")),
      };
    }
  }
}
