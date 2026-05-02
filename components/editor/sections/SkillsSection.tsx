"use client";

import {
  emptySkills,
  type CV,
  type Section,
  type SectionItem,
  type SkillsData,
} from "@/lib/schemas";
import {
  addSectionItem,
  removeSectionItem,
  sortByOrder,
  updateSectionItem,
} from "@/lib/cv-helpers";
import { Input } from "@/components/ui/input";
import { PlusIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import ItemBlock from "../shared/ItemBlock";
import FormField from "../shared/FormField";
import TagInput from "../shared/TagInput";

type Props = { cv: CV; section: Section; onUpdate: (cv: CV) => void };

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

  return (
    <ItemBlock onRemove={onRemove}>
      <FormField label="Category">
        <Input
          value={data.category}
          onChange={(e) => onUpdate({ ...data, category: e.target.value })}
        />
      </FormField>
      <TagInput
        label="Skills"
        items={data.items}
        placeholder="Add a skill..."
        onChange={(items) => onUpdate({ ...data, items })}
      />
    </ItemBlock>
  );
}

export default function SkillsSection({ cv, section, onUpdate }: Props) {
  const items = sortByOrder(section.items);

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
      <Button
        className="w-full"
        onClick={() => onUpdate(addSectionItem(cv, section.id, emptySkills))}
      >
        <PlusIcon />
        Add category
      </Button>
    </div>
  );
}
