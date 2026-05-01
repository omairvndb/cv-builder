"use client";

import type { CV } from "@/lib/schemas";
import { sortByOrder } from "@/lib/cv-helpers";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import PersonalInfo from "./sections/PersonalInfo";
import ExperienceSection from "./sections/ExperienceSection";
import EducationSection from "./sections/EducationSection";
import SkillsSection from "./sections/SkillsSection";
import ProjectsSection from "./sections/ProjectsSection";
import CustomSection from "./sections/CustomSection";

export default function EditorPanel({ cv, onUpdate }: { cv: CV; onUpdate: (cv: CV) => void }) {
  const sortedSections = sortByOrder(cv.sections);

  return (
    <div className="w-105 shrink-0 border-r overflow-y-auto p-4">
      <Accordion type="multiple">
        <AccordionItem value="personal-info">
          <AccordionTrigger>Personal Info</AccordionTrigger>
          <AccordionContent>
            <PersonalInfo key={cv.presetId} cv={cv} onUpdate={onUpdate} />
          </AccordionContent>
        </AccordionItem>

        {sortedSections.map((section) => (
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
                <SkillsSection key={section.id} cv={cv} section={section} onUpdate={onUpdate} />
              )}
              {section.type === "PROJECTS" && (
                <ProjectsSection key={section.id} cv={cv} section={section} onUpdate={onUpdate} />
              )}
              {section.type === "CUSTOM" && (
                <CustomSection cv={cv} section={section} onUpdate={onUpdate} />
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
