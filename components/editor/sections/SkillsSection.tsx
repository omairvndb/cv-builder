"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  addSectionItem,
  addSectionItems,
  isItemDirty,
  removeSectionItem,
  reorderSectionItems,
  sortByOrder,
  updateSectionItem,
} from "@/lib/cv-helpers";
import { emptySkills, type CV, type Preset, type Section, type SkillsData } from "@/lib/schemas";
import { PlusIcon } from "@phosphor-icons/react";
import { useState } from "react";
import AddItemDialog from "../shared/AddItemDialog";
import FormField from "../shared/FormField";
import ItemBlock from "../shared/ItemBlock";
import SortableItems from "../shared/SortableItems";
import TagInput from "../shared/TagInput";

type Props = {
  cv: CV;
  section: Section;
  savedSection: Section | null;
  onUpdate: (cv: CV) => void;
  presets: Preset[];
  activePresetId: string;
};

export default function SkillsSection({
  cv,
  section,
  savedSection,
  onUpdate,
  presets,
  activePresetId,
}: Props) {
  const items = sortByOrder(section.items);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<SkillsData>(emptySkills);

  return (
    <div className="flex flex-col gap-3">
      {/* Items */}
      <SortableItems
        items={items}
        onReorder={(orderedIds) => onUpdate(reorderSectionItems(cv, section.id, orderedIds))}
      >
        {(item, handleRef) => (
          <ItemBlock
            handleRef={handleRef}
            isDirty={isItemDirty(item, savedSection)}
            onRemove={() => onUpdate(removeSectionItem(cv, section.id, item.id))}
          >
            <SkillsFields
              data={item.data as SkillsData}
              onChange={(newData) => onUpdate(updateSectionItem(cv, section.id, item.id, newData))}
            />
          </ItemBlock>
        )}
      </SortableItems>

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
        copy={{
          presets,
          currentPresetId: activePresetId,
          sectionType: section.type,
          onCopy: (datas) => onUpdate(addSectionItems(cv, section.id, datas)),
        }}
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
