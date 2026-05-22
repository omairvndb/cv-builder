"use client";

import { useState } from "react";
import {
  emptyEducation,
  type CV,
  type EducationData,
  type Preset,
  type Section,
} from "@/lib/schemas";
import {
  addSectionItem,
  addSectionItems,
  isItemDirty,
  removeSectionItem,
  reorderSectionItems,
  sortByOrder,
  updateSectionItem,
} from "@/lib/cv-helpers";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PlusIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import ItemBlock from "../shared/ItemBlock";
import FormField from "../shared/FormField";
import BulletListEditor from "../shared/BulletListEditor";
import AddItemDialog from "../shared/AddItemDialog";
import SortableItems from "../shared/SortableItems";

type Props = {
  cv: CV;
  section: Section;
  savedSection: Section | null;
  onUpdate: (cv: CV) => void;
  presets: Preset[];
  activePresetId: string;
};

export default function EducationSection({
  cv,
  section,
  savedSection,
  onUpdate,
  presets,
  activePresetId,
}: Props) {
  const items = sortByOrder(section.items);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<EducationData>(emptyEducation);

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
            <EducationFields
              data={item.data as EducationData}
              onChange={(newData) => onUpdate(updateSectionItem(cv, section.id, item.id, newData))}
            />
          </ItemBlock>
        )}
      </SortableItems>

      {/* Add button */}
      <Button
        className="w-full"
        onClick={() => {
          setDraft(emptyEducation);
          setOpen(true);
        }}
      >
        <PlusIcon />
        Add education
      </Button>

      {/* Add dialog */}
      <AddItemDialog
        title="Add education"
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
        <EducationFields data={draft} onChange={setDraft} />
      </AddItemDialog>
    </div>
  );
}

function EducationFields({
  data,
  onChange,
}: {
  data: EducationData;
  onChange: (data: EducationData) => void;
}) {
  const set =
    (field: keyof EducationData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      onChange({ ...data, [field]: value || undefined });
    };

  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Degree" className="col-span-2">
          <Input value={data.degree ?? ""} onChange={set("degree")} />
        </FormField>
        <FormField label="Institution">
          <Input value={data.institution ?? ""} onChange={set("institution")} />
        </FormField>
        <FormField label="Location">
          <Input
            value={data.location ?? ""}
            onChange={set("location")}
            placeholder="e.g. Antwerpen"
          />
        </FormField>
        <FormField label="Start Date">
          <Input value={data.startDate ?? ""} onChange={set("startDate")} placeholder="Sep 2020" />
        </FormField>
        <FormField label="End Date">
          <Input value={data.endDate ?? ""} onChange={set("endDate")} placeholder="Jun 2023" />
        </FormField>
      </div>
      <FormField label="Description">
        <Textarea value={data.description ?? ""} onChange={set("description")} rows={2} />
      </FormField>
      <BulletListEditor
        bullets={data.bullets ?? []}
        onChange={(bullets) => onChange({ ...data, bullets })}
      />
    </>
  );
}
