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
import { emptySkills, type CV, type Section, type SkillsData } from "@/lib/schemas";
import { PlusIcon } from "@phosphor-icons/react";
import { useState } from "react";
import AddItemDialog from "../shared/AddItemDialog";
import FormField from "../shared/FormField";
import ItemBlock from "../shared/ItemBlock";
import TagInput from "../shared/TagInput";

type Props = { cv: CV; section: Section; savedSection: Section | null; onUpdate: (cv: CV) => void };

export default function SkillsSection({ cv, section, savedSection, onUpdate }: Props) {
  const items = sortByOrder(section.items);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<SkillsData>(emptySkills);

  return (
    <div className="flex flex-col gap-3">
      {/* Items */}
      {items.map((item) => {
        const data = item.data as SkillsData;
        const isDirty = isItemDirty(item, savedSection);
        return (
          <ItemBlock
            key={item.id}
            isDirty={isDirty}
            onRemove={() => onUpdate(removeSectionItem(cv, section.id, item.id))}
          >
            <SkillsFields
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
          setDraft(emptySkills);
          setOpen(true);
        }}
      >
        <PlusIcon />
        Add category
      </Button>

      {/* Add dialog */}
      <AddItemDialog
        title="Add category"
        open={open}
        onOpenChange={setOpen}
        onConfirm={() => onUpdate(addSectionItem(cv, section.id, draft))}
      >
        <SkillsFields data={draft} onChange={setDraft} />
      </AddItemDialog>
    </div>
  );
}

function SkillsFields({
  data,
  onChange,
}: {
  data: SkillsData;
  onChange: (data: SkillsData) => void;
}) {
  return (
    <>
      <FormField label="Category">
        <Input
          value={data.category ?? ""}
          onChange={(e) => onChange({ ...data, category: e.target.value || undefined })}
        />
      </FormField>
      <TagInput
        label="Skills"
        items={data.items ?? []}
        placeholder="Add a skill..."
        onChange={(items) => onChange({ ...data, items })}
      />
    </>
  );
}
