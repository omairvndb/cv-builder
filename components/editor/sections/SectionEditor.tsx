"use client";

import type { CV, Preset, Section } from "@/lib/schemas";
import ExperienceSection from "./ExperienceSection";
import EducationSection from "./EducationSection";
import SkillsSection from "./SkillsSection";
import ProjectsSection from "./ProjectsSection";
import LanguagesSection from "./LanguagesSection";
import CertificationsSection from "./CertificationsSection";
import ReferencesSection from "./ReferencesSection";

type Props = {
  cv: CV;
  section: Section;
  savedSection: Section | null;
  onUpdate: (cv: CV) => void;
  presets: Preset[];
  activePresetId: string;
};

export default function SectionEditor(props: Props) {
  switch (props.section.type) {
    case "EXPERIENCE":
      return <ExperienceSection {...props} />;
    case "EDUCATION":
      return <EducationSection {...props} />;
    case "SKILLS":
      return <SkillsSection {...props} />;
    case "PROJECTS":
      return <ProjectsSection {...props} />;
    case "LANGUAGES":
      return <LanguagesSection {...props} />;
    case "CERTIFICATIONS":
      return <CertificationsSection {...props} />;
    case "REFERENCES":
      return <ReferencesSection {...props} />;
  }
}
