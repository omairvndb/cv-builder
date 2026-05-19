import type { Section } from "@/lib/schemas";
import CertificationsBlock from "./CertificationsBlock";
import EducationBlock from "./EducationBlock";
import ExperienceBlock from "./ExperienceBlock";
import LanguagesBlock from "./LanguagesBlock";
import ProjectsBlock from "./ProjectsBlock";
import SkillsBlock from "./SkillsBlock";

const DUTCH_SECTION_TITLES = {
  EDUCATION: "Opleiding",
  EXPERIENCE: "Werkervaring",
  SKILLS: "Technische vaardigheden",
  PROJECTS: "Projecten",
  LANGUAGES: "Talen",
  CERTIFICATIONS: "Certificaten",
} as const;

export default function SectionBlock({
  section,
  first = false,
}: {
  section: Section;
  first?: boolean;
}) {
  const localised = { ...section, title: DUTCH_SECTION_TITLES[section.type] };
  switch (section.type) {
    case "EXPERIENCE":
      return <ExperienceBlock section={localised} first={first} />;
    case "EDUCATION":
      return <EducationBlock section={localised} first={first} />;
    case "PROJECTS":
      return <ProjectsBlock section={localised} first={first} />;
    case "SKILLS":
      return <SkillsBlock section={localised} />;
    case "LANGUAGES":
      return <LanguagesBlock section={localised} />;
    case "CERTIFICATIONS":
      return <CertificationsBlock section={localised} />;
  }
}
