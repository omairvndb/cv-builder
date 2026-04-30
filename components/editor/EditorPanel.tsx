"use client";

import type { CV } from "@/lib/schemas";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function EditorPanel({ cv, onUpdate }: { cv: CV; onUpdate: (cv: CV) => void }) {
  const sortedSections = [...cv.sections].sort((a, b) => a.order - b.order);

  return (
    <div className="w-105 shrink-0 border-r bg-background overflow-y-auto">
      <Accordion type="multiple" className="px-4">
        <AccordionItem value="personal-info">
          <AccordionTrigger>Personal Info</AccordionTrigger>
          <AccordionContent>
            <p className="text-muted-foreground">Form fields coming in Step 5</p>
          </AccordionContent>
        </AccordionItem>

        {sortedSections.map((section) => (
          <AccordionItem key={section.id} value={section.id}>
            <AccordionTrigger>{section.title}</AccordionTrigger>
            <AccordionContent>
              <p className="text-muted-foreground">Form fields coming in Step 5</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
