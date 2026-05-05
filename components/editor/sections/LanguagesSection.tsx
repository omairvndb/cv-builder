"use client";

import {
  emptyLanguage,
  type CV,
  type Section,
  type SectionItem,
  type LanguagesData,
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

type Props = { cv: CV; section: Section; onUpdate: (cv: CV) => void };

function LanguageItem({
  item,
  onUpdate,
  onRemove,
}: {
  item: SectionItem;
  onUpdate: (data: LanguagesData) => void;
  onRemove: () => void;
}) {
  const data = item.data as LanguagesData;

  return (
    <ItemBlock onRemove={onRemove}>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Language">
          <Input
            value={data.language}
            onChange={(e) => onUpdate({ ...data, language: e.target.value })}
          />
        </FormField>
        <FormField label="Proficiency">
          <Input
            value={data.proficiency}
            onChange={(e) => onUpdate({ ...data, proficiency: e.target.value })}
          />
        </FormField>
      </div>
    </ItemBlock>
  );
}

export default function LanguagesSection({ cv, section, onUpdate }: Props) {
  const items = sortByOrder(section.items);

  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => (
        <LanguageItem
          key={item.id}
          item={item}
          onUpdate={(data) => onUpdate(updateSectionItem(cv, section.id, item.id, data))}
          onRemove={() => onUpdate(removeSectionItem(cv, section.id, item.id))}
        />
      ))}
      <Button
        className="w-full"
        onClick={() => onUpdate(addSectionItem(cv, section.id, emptyLanguage))}
      >
        <PlusIcon />
        Add language
      </Button>
    </div>
  );
}
