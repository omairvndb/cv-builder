"use client";

import type { CV, Section } from "@/lib/schemas";
import ExperienceSection from "./ExperienceSection";
import EducationSection from "./EducationSection";
import SkillsSection from "./SkillsSection";
import ProjectsSection from "./ProjectsSection";
import LanguagesSection from "./LanguagesSection";

export default function SectionEditor({
  cv,
  section,
  onUpdate,
}: {
  cv: CV;
  section: Section;
  onUpdate: (cv: CV) => void;
}) {
  switch (section.type) {
    case "EXPERIENCE":
      return <ExperienceSection cv={cv} section={section} onUpdate={onUpdate} />;
    case "EDUCATION":
      return <EducationSection cv={cv} section={section} onUpdate={onUpdate} />;
    case "SKILLS":
      return <SkillsSection cv={cv} section={section} onUpdate={onUpdate} />;
    case "PROJECTS":
      return <ProjectsSection cv={cv} section={section} onUpdate={onUpdate} />;
    case "LANGUAGES":
      return <LanguagesSection cv={cv} section={section} onUpdate={onUpdate} />;
  }
}
