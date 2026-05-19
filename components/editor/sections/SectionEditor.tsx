"use client";

import type { CV, Section } from "@/lib/schemas";
import ExperienceSection from "./ExperienceSection";
import EducationSection from "./EducationSection";
import SkillsSection from "./SkillsSection";
import ProjectsSection from "./ProjectsSection";
import LanguagesSection from "./LanguagesSection";
import CertificationsSection from "./CertificationsSection";

export default function SectionEditor({
  cv,
  section,
  savedSection,
  onUpdate,
}: {
  cv: CV;
  section: Section;
  savedSection: Section | null;
  onUpdate: (cv: CV) => void;
}) {
  switch (section.type) {
    case "EXPERIENCE":
      return (
        <ExperienceSection
          cv={cv}
          section={section}
          savedSection={savedSection}
          onUpdate={onUpdate}
        />
      );
    case "EDUCATION":
      return (
        <EducationSection
          cv={cv}
          section={section}
          savedSection={savedSection}
          onUpdate={onUpdate}
        />
      );
    case "SKILLS":
      return (
        <SkillsSection cv={cv} section={section} savedSection={savedSection} onUpdate={onUpdate} />
      );
    case "PROJECTS":
      return (
        <ProjectsSection
          cv={cv}
          section={section}
          savedSection={savedSection}
          onUpdate={onUpdate}
        />
      );
    case "LANGUAGES":
      return (
        <LanguagesSection
          cv={cv}
          section={section}
          savedSection={savedSection}
          onUpdate={onUpdate}
        />
      );
    case "CERTIFICATIONS":
      return (
        <CertificationsSection
          cv={cv}
          section={section}
          savedSection={savedSection}
          onUpdate={onUpdate}
        />
      );
  }
}
