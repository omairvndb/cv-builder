"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { reorderSections, updateSection } from "@/lib/cv-helpers";
import type { CV, Preset, Section } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { move } from "@dnd-kit/helpers";
import { DragDropProvider, DragOverlay, useDragOperation, type DragEndEvent } from "@dnd-kit/react";
import { useSortable } from "@dnd-kit/react/sortable";
import { DotsSixVerticalIcon, EyeIcon, EyeSlashIcon } from "@phosphor-icons/react";
import { useState } from "react";
import SectionEditor from "./SectionEditor";
type SectionGroupProps = {
  label: string;
  sections: Section[];
  cv: CV;
  savedCV: CV | null;
  onUpdate: (cv: CV) => void;
  presets: Preset[];
  activePresetId: string;
};

type SortableSectionItemProps = {
  cv: CV;
  section: Section;
  index: number;
  savedCV: CV | null;
  onUpdate: (cv: CV) => void;
  presets: Preset[];
  activePresetId: string;
};

export default function SectionGroup({
  label,
  sections,
  cv,
  savedCV,
  onUpdate,
  presets,
  activePresetId,
}: SectionGroupProps) {
  const sectionIds = sections.map((s) => s.id);
  const [isDragging, setIsDragging] = useState(false);
  const [openItems, setOpenItems] = useState<string[]>([]);
  const accordionValue = isDragging ? [] : openItems;

  function handleDragEnd(event: DragEndEvent) {
    setIsDragging(false);
    const reordered = move(sectionIds, event);
    if (reordered !== sectionIds) {
      onUpdate(reorderSections(cv, reordered));
    }
  }

  return (
    <div className="space-y-2">
      <h2 className="text-xs font-medium uppercase tracking-wide">{label}</h2>
      <DragDropProvider onDragStart={() => setIsDragging(true)} onDragEnd={handleDragEnd}>
        <Accordion type="multiple" value={accordionValue} onValueChange={setOpenItems}>
          {sections.map((section, index) => (
            <SortableSectionItem
              key={section.id}
              cv={cv}
              section={section}
              index={index}
              savedCV={savedCV}
              onUpdate={onUpdate}
              presets={presets}
              activePresetId={activePresetId}
            />
          ))}
        </Accordion>
        <DragOverlay>
          {(source) => (
            <div className="flex items-center gap-3 border bg-card px-1.5 py-2.5 text-xs font-medium">
              <DotsSixVerticalIcon weight="bold" />
              {String(source.data?.title ?? "")}
            </div>
          )}
        </DragOverlay>
      </DragDropProvider>
    </div>
  );
}

function SortableSectionItem({
  cv,
  section,
  index,
  savedCV,
  onUpdate,
  presets,
  activePresetId,
}: SortableSectionItemProps) {
  const { ref, handleRef, isDragSource } = useSortable({
    id: section.id,
    index,
    data: { title: section.title },
  });
  const { source } = useDragOperation();
  const savedSection = savedCV?.sections.find((s) => s.id === section.id) ?? null;
  const isSectionDirty = JSON.stringify(section) !== JSON.stringify(savedSection);

  return (
    <div ref={ref} className={cn(isDragSource && "opacity-0")}>
      <AccordionItem value={section.id}>
        <div className="relative">
          <Button
            ref={handleRef}
            type="button"
            variant="ghost"
            size="icon-xs"
            aria-label="Drag to reorder"
            className={cn(
              "absolute inset-y-0 h-auto z-10 touch-none",
              isDragSource ? "cursor-grabbing" : "cursor-grab"
            )}
          >
            <DotsSixVerticalIcon weight="bold" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            aria-label={section.visible ? "Hide section" : "Show section"}
            onClick={(e) => {
              e.stopPropagation();
              onUpdate(updateSection(cv, section.id, (s) => ({ ...s, visible: !s.visible })));
            }}
            className="absolute inset-y-0 h-auto z-10 touch-none right-6 cursor-pointer"
          >
            {section.visible ? <EyeIcon /> : <EyeSlashIcon />}
          </Button>
          <AccordionTrigger className="pl-7">
            <span className="flex items-center gap-2">
              {section.visible ? (
                section.title
              ) : (
                <span className="text-muted-foreground">{section.title}</span>
              )}
              {isSectionDirty && (
                <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
              )}
            </span>
          </AccordionTrigger>
        </div>

        {/* Unmount content during drag instead of letting Radix animate close —
            otherwise the close animation plays while the item is being dragged
            and the layout shifts visibly under the pointer. */}
        {!source && (
          <AccordionContent>
            <SectionEditor
              cv={cv}
              section={section}
              savedSection={savedSection}
              onUpdate={onUpdate}
              presets={presets}
              activePresetId={activePresetId}
            />
          </AccordionContent>
        )}
      </AccordionItem>
    </div>
  );
}
