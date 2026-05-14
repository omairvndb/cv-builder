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
import { Badge } from "../ui/badge";

const metaFields = (cv: CV) =>
  Object.fromEntries(Object.entries(cv).filter(([k]) => k !== "sections"));

export default function EditorPanel({
  cv,
  savedCV,
  onUpdate,
}: {
  cv: CV;
  savedCV: CV | null;
  onUpdate: (cv: CV) => void;
}) {
  const sortedSections = sortByOrder(cv.sections);
  const sidebarSections = sortedSections.filter((s) => getSectionLayout(s.type) === "sidebar");
  const mainSections = sortedSections.filter((s) => getSectionLayout(s.type) === "main");

  const isPersonalInfoDirty =
    JSON.stringify(metaFields(cv)) !== JSON.stringify(metaFields(savedCV ?? cv));

  return (
    <div className="w-105 shrink-0 border-r overflow-y-auto p-4 space-y-6">
      <Accordion type="multiple">
        <AccordionItem value="personal-info">
          <AccordionTrigger>
            <span className="flex items-center gap-2">
              Personal Info
              {isPersonalInfoDirty && <Badge variant="secondary">Modified</Badge>}
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <PersonalInfoSection cv={cv} onUpdate={onUpdate} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <SectionGroup
        label="Sidebar"
        sections={sidebarSections}
        cv={cv}
        savedCV={savedCV}
        onUpdate={onUpdate}
      />
      <SectionGroup
        label="Main"
        sections={mainSections}
        cv={cv}
        savedCV={savedCV}
        onUpdate={onUpdate}
      />
    </div>
  );
}
