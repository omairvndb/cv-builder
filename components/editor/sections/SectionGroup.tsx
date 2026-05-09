"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { reorderSections } from "@/lib/cv-helpers";
import type { CV, Section } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { move } from "@dnd-kit/helpers";
import { DragDropProvider, DragOverlay, useDragOperation, type DragEndEvent } from "@dnd-kit/react";
import { useSortable } from "@dnd-kit/react/sortable";
import { DotsSixVerticalIcon } from "@phosphor-icons/react";
import { useState } from "react";
import SectionEditor from "./SectionEditor";

type SectionGroupProps = {
  label: string;
  sections: Section[];
  cv: CV;
  onUpdate: (cv: CV) => void;
};

type SortableSectionItemProps = {
  cv: CV;
  section: Section;
  index: number;
  onUpdate: (cv: CV) => void;
};

export default function SectionGroup({ label, sections, cv, onUpdate }: SectionGroupProps) {
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
              onUpdate={onUpdate}
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

function SortableSectionItem({ cv, section, index, onUpdate }: SortableSectionItemProps) {
  const { ref, handleRef, isDragSource } = useSortable({
    id: section.id,
    index,
    data: { title: section.title },
  });
  const { source } = useDragOperation();

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
          <AccordionTrigger className="pl-7">{section.title}</AccordionTrigger>
        </div>

        {/* Unmount content during drag instead of letting Radix animate close —
            otherwise the close animation plays while the item is being dragged
            and the layout shifts visibly under the pointer. */}
        {!source && (
          <AccordionContent>
            <SectionEditor cv={cv} section={section} onUpdate={onUpdate} />
          </AccordionContent>
        )}
      </AccordionItem>
    </div>
  );
}
