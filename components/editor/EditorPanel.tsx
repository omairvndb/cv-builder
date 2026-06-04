"use client";

import type { CV, Preset } from "@/lib/schemas";
import { getSectionLayout, sortByOrder } from "@/lib/cv-helpers";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowsInSimpleIcon, MoonIcon, SunIcon } from "@phosphor-icons/react";
import { useTheme } from "next-themes";
import { useState } from "react";
import PersonalInfoSection from "./sections/PersonalInfoSection";
import SectionGroup from "./sections/SectionGroup";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

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
  const [personalInfoOpen, setPersonalInfoOpen] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState<string[]>([]);
  const [mainOpen, setMainOpen] = useState<string[]>([]);

  const sortedSections = sortByOrder(cv.sections);
  const sidebarSections = sortedSections.filter((s) => getSectionLayout(s.type) === "sidebar");
  const mainSections = sortedSections.filter((s) => getSectionLayout(s.type) === "main");

  const isPersonalInfoDirty =
    JSON.stringify(metaFields(cv)) !== JSON.stringify(metaFields(savedCV ?? cv));

  return (
    <div className="w-105 shrink-0 border-r flex flex-col">
      {/* Header Bar */}
      <div className="border-b p-3">
        <div className="flex gap-2">
          {/* Theme toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                type="button"
                aria-label="Toggle theme"
                onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              >
                <SunIcon className="hidden dark:block" />
                <MoonIcon className="block dark:hidden" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Toggle theme</TooltipContent>
          </Tooltip>

          {/* Collapse all */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                type="button"
                aria-label="Collapse all sections"
                onClick={() => {
                  setPersonalInfoOpen([]);
                  setSidebarOpen([]);
                  setMainOpen([]);
                }}
              >
                <ArrowsInSimpleIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Collapse all sections</TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Editor Content */}
      <div className="p-4 space-y-6 overflow-y-auto flex-1">
        {/* Personal Info */}
        <Accordion type="multiple" value={personalInfoOpen} onValueChange={setPersonalInfoOpen}>
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
          openItems={sidebarOpen}
          onOpenItemsChange={setSidebarOpen}
        />
        <SectionGroup
          label="Main"
          sections={mainSections}
          cv={cv}
          savedCV={savedCV}
          onUpdate={onUpdate}
          presets={presets}
          activePresetId={activePresetId}
          openItems={mainOpen}
          onOpenItemsChange={setMainOpen}
        />
      </div>
    </div>
  );
}
