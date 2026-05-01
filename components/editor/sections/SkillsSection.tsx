"use client";

import { useState } from "react";
import type { CV, Section, SectionItem, SkillsData } from "@/lib/schemas";
import { addSectionItem, removeSectionItem, updateSectionItem } from "@/lib/cv-helpers";
import { Input } from "@/components/ui/input";
import { PlusIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import ItemBlock from "../shared/ItemBlock";
import FormField from "../shared/FormField";

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
      <FormField label="Category">
        <Input
          value={data.category}
          onChange={(e) => onUpdate({ ...data, category: e.target.value })}
        />
      </FormField>
      <FormField label="Skills">
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
      </FormField>
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
        <PlusIcon />Add category
      </Button>
    </div>
  );
}
