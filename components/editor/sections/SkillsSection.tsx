"use client";

import { useState } from "react";
import type { CV, Section, SectionItem, SkillsData } from "@/lib/schemas";
import { addSectionItem, removeSectionItem, updateSectionItem } from "@/lib/cv-helpers";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import ItemBlock from "../shared/ItemBlock";

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
    <ItemBlock onRemove={onRemove}>
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
    </ItemBlock>
  );
}

export default function SkillsSection({ cv, section, onUpdate }: Props) {
  const items = [...section.items].sort((a, b) => a.order - b.order);

  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => (
        <SkillsItem
          key={item.id}
          item={item}
          onUpdate={(data) => onUpdate(updateSectionItem(cv, section.id, item.id, data))}
          onRemove={() => onUpdate(removeSectionItem(cv, section.id, item.id))}
        />
      ))}
      <Button className="w-full" onClick={() => onUpdate(addSectionItem(cv, section.id, empty))}>
        Add category
      </Button>
    </div>
  );
}
