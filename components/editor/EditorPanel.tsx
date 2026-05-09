"use client";

import type { CV } from "@/lib/schemas";
import { getSectionLayout, sortByOrder } from "@/lib/cv-helpers";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import PersonalInfoSection from "./sections/PersonalInfoSection";
import SectionGroup from "./sections/SectionGroup";

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
