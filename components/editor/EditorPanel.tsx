"use client";

import type { CV, Preset } from "@/lib/schemas";
import { getSectionLayout, sortByOrder } from "@/lib/cv-helpers";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MoonIcon, SunIcon } from "@phosphor-icons/react";
import { useTheme } from "next-themes";
import PersonalInfoSection from "./sections/PersonalInfoSection";
import SectionGroup from "./sections/SectionGroup";
import { Button } from "../ui/button";

const metaFields = (cv: CV) =>
  Object.fromEntries(Object.entries(cv).filter(([k]) => k !== "sections"));

export default function EditorPanel({
  cv,
  savedCV,
  onUpdate,
  presets,
  activePresetId,
}: {
  cv: CV;
  savedCV: CV | null;
  onUpdate: (cv: CV) => void;
  presets: Preset[];
  activePresetId: string;
}) {
  const { resolvedTheme, setTheme } = useTheme();

  const sortedSections = sortByOrder(cv.sections);
  const sidebarSections = sortedSections.filter((s) => getSectionLayout(s.type) === "sidebar");
  const mainSections = sortedSections.filter((s) => getSectionLayout(s.type) === "main");

  const isPersonalInfoDirty =
    JSON.stringify(metaFields(cv)) !== JSON.stringify(metaFields(savedCV ?? cv));

  return (
    <div className="w-105 shrink-0 border-r overflow-y-auto">
      {/* Header Bar */}
      <div className="border-b p-3">
        {/* Theme toggle */}
        <Button
          variant="outline"
          size="icon"
          type="button"
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        >
          <SunIcon className="hidden dark:block" />
          <MoonIcon className="block dark:hidden" />
        </Button>
      </div>

      {/* Editor Content */}
      <div className="p-4 space-y-6">
        {/* Personal Info */}
        <Accordion type="multiple">
          <AccordionItem value="personal-info">
            <AccordionTrigger>
              <span className="flex items-center gap-2">
                Personal Info
                {isPersonalInfoDirty && (
                  <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
                )}
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <PersonalInfoSection cv={cv} onUpdate={onUpdate} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Sections */}
        <SectionGroup
          label="Sidebar"
          sections={sidebarSections}
          cv={cv}
          savedCV={savedCV}
          onUpdate={onUpdate}
          presets={presets}
          activePresetId={activePresetId}
        />
        <SectionGroup
          label="Main"
          sections={mainSections}
          cv={cv}
          savedCV={savedCV}
          onUpdate={onUpdate}
          presets={presets}
          activePresetId={activePresetId}
        />
      </div>
    </div>
  );
}
