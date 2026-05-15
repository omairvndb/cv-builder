"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  addSectionItem,
  isItemDirty,
  removeSectionItem,
  sortByOrder,
  updateSectionItem,
} from "@/lib/cv-helpers";
import { emptyLanguage, type CV, type LanguagesData, type Section } from "@/lib/schemas";
import { PlusIcon } from "@phosphor-icons/react";
import { useState } from "react";
import AddItemDialog from "../shared/AddItemDialog";
import FormField from "../shared/FormField";
import ItemBlock from "../shared/ItemBlock";

type Props = { cv: CV; section: Section; savedSection: Section | null; onUpdate: (cv: CV) => void };

export default function LanguagesSection({ cv, section, savedSection, onUpdate }: Props) {
  const items = sortByOrder(section.items);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<LanguagesData>(emptyLanguage);

  return (
    <div className="flex flex-col gap-3">
      {/* Items */}
      {items.map((item) => {
        const data = item.data as LanguagesData;
        const isDirty = isItemDirty(item, savedSection);
        return (
          <ItemBlock
            key={item.id}
            isDirty={isDirty}
            onRemove={() => onUpdate(removeSectionItem(cv, section.id, item.id))}
          >
            <LanguageFields
              data={data}
              onChange={(newData) => onUpdate(updateSectionItem(cv, section.id, item.id, newData))}
            />
          </ItemBlock>
        );
      })}

      {/* Add button */}
      <Button
        className="w-full"
        onClick={() => {
          setDraft(emptyLanguage);
          setOpen(true);
        }}
      >
        <PlusIcon />
        Add language
      </Button>

      {/* Add dialog */}
      <AddItemDialog
        title="Add language"
        open={open}
        onOpenChange={setOpen}
        onConfirm={() => onUpdate(addSectionItem(cv, section.id, draft))}
      >
        <LanguageFields data={draft} onChange={setDraft} />
      </AddItemDialog>
    </div>
  );
}

function LanguageFields({
  data,
  onChange,
}: {
  data: LanguagesData;
  onChange: (data: LanguagesData) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <FormField label="Language">
        <Input
          value={data.language ?? ""}
          onChange={(e) => onChange({ ...data, language: e.target.value || undefined })}
        />
      </FormField>
      <FormField label="Proficiency">
        <Input
          value={data.proficiency ?? ""}
          onChange={(e) => onChange({ ...data, proficiency: e.target.value || undefined })}
        />
      </FormField>
    </div>
  );
}
