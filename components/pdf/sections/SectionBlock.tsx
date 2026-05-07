import type { Section } from "@/lib/schemas";
import EducationBlock from "./EducationBlock";
import ExperienceBlock from "./ExperienceBlock";
import LanguagesBlock from "./LanguagesBlock";
import ProjectsBlock from "./ProjectsBlock";
import SkillsBlock from "./SkillsBlock";

export default function SectionBlock({
  section,
  first = false,
}: {
  section: Section;
  first?: boolean;
}) {
  switch (section.type) {
    case "EXPERIENCE":
      return <ExperienceBlock section={section} first={first} />;
    case "EDUCATION":
      return <EducationBlock section={section} first={first} />;
    case "PROJECTS":
      return <ProjectsBlock section={section} first={first} />;
    case "SKILLS":
      return <SkillsBlock section={section} />;
    case "LANGUAGES":
      return <LanguagesBlock section={section} />;
  }
}
