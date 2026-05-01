"use client";

import { useState } from "react";
import { XIcon } from "@phosphor-icons/react";
import type { CV, Section, SectionItem, SkillsData } from "@/lib/schemas";
import { addSectionItem, removeSectionItem, updateSectionItem } from "@/lib/cv-helpers";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type Props = { cv: CV; section: Section; onUpdate: (cv: CV) => void };

const empty: SkillsData = { category: "", items: [] };

function SkillsItem({
  item,
  onUpdate,
  onRemove,
}: {
  item: SectionItem;
  onUpdate: (data: SkillsData) => void;
  onRemove: () => void;
}) {
  const data = item.data as SkillsData;
  const [rawItems, setRawItems] = useState(() => data.items.join(", "));

  return (
    <div className="relative flex flex-col gap-3 rounded-md border p-3 pt-4">
      <Button variant="ghost" size="icon-xs" className="absolute top-2 right-2" onClick={onRemove}>
        <XIcon />
      </Button>
      <div className="flex flex-col gap-1.5">
        <Label>Category</Label>
        <Input
          value={data.category}
          onChange={(e) => onUpdate({ ...data, category: e.target.value })}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>Skills</Label>
        <Input
          value={rawItems}
          placeholder="React, TypeScript, Node.js"
          onChange={(e) => {
            setRawItems(e.target.value);
            onUpdate({
              ...data,
              items: e.target.value
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean),
            });
          }}
        />
      </div>
    </div>
  );
}

export default function SkillsSection({ cv, section, onUpdate }: Props) {
  const items = [...section.items].sort((a, b) => a.order - b.order);

  return (
    <div className="flex flex-col gap-4">
      {items.map((item) => (
        <SkillsItem
          key={item.id}
          item={item}
          onUpdate={(data) => onUpdate(updateSectionItem(cv, section.id, item.id, data))}
          onRemove={() => onUpdate(removeSectionItem(cv, section.id, item.id))}
        />
      ))}
      <Button
        variant="outline"
        className="w-full"
        onClick={() => onUpdate(addSectionItem(cv, section.id, empty))}
      >
        Add category
      </Button>
    </div>
  );
}
