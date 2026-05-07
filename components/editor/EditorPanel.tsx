"use client";

import type { CV, Section } from "@/lib/schemas";
import { getSectionLayout, sortByOrder } from "@/lib/cv-helpers";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import PersonalInfoSection from "./sections/PersonalInfoSection";
import ExperienceSection from "./sections/ExperienceSection";
import EducationSection from "./sections/EducationSection";
import SkillsSection from "./sections/SkillsSection";
import ProjectsSection from "./sections/ProjectsSection";
import LanguagesSection from "./sections/LanguagesSection";

export default function EditorPanel({ cv, onUpdate }: { cv: CV; onUpdate: (cv: CV) => void }) {
  const sortedSections = sortByOrder(cv.sections);
  const sidebarSections = sortedSections.filter((s) => getSectionLayout(s.type) === "sidebar");
  const mainSections = sortedSections.filter((s) => getSectionLayout(s.type) === "main");

  return (
    <div className="w-105 shrink-0 border-r overflow-y-auto p-4 space-y-6">
      <Accordion type="multiple">
        <AccordionItem value="personal-info">
          <AccordionTrigger>Personal Info</AccordionTrigger>
          <AccordionContent>
            <PersonalInfoSection cv={cv} onUpdate={onUpdate} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <SectionGroup label="Sidebar" sections={sidebarSections} cv={cv} onUpdate={onUpdate} />
      <SectionGroup label="Main" sections={mainSections} cv={cv} onUpdate={onUpdate} />
    </div>
  );
}

function SectionGroup({
  label,
  sections,
  cv,
  onUpdate,
}: {
  label: string;
  sections: Section[];
  cv: CV;
  onUpdate: (cv: CV) => void;
}) {
  return (
    <div className="space-y-2">
      <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</h2>
      <Accordion type="multiple">
        {sections.map((section) => (
          <AccordionItem key={section.id} value={section.id}>
            <AccordionTrigger>{section.title}</AccordionTrigger>
            <AccordionContent>
              {section.type === "EXPERIENCE" && (
                <ExperienceSection cv={cv} section={section} onUpdate={onUpdate} />
              )}
              {section.type === "EDUCATION" && (
                <EducationSection cv={cv} section={section} onUpdate={onUpdate} />
              )}
              {section.type === "SKILLS" && (
                <SkillsSection cv={cv} section={section} onUpdate={onUpdate} />
              )}
              {section.type === "PROJECTS" && (
                <ProjectsSection cv={cv} section={section} onUpdate={onUpdate} />
              )}
              {section.type === "LANGUAGES" && (
                <LanguagesSection cv={cv} section={section} onUpdate={onUpdate} />
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
