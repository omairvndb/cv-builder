"use client";

import { useState } from "react";
import { emptyExperience, type CV, type Section, type ExperienceData } from "@/lib/schemas";
import {
  addSectionItem,
  isItemDirty,
  removeSectionItem,
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
import TagInput from "../shared/TagInput";
import AddItemDialog from "../shared/AddItemDialog";

type Props = { cv: CV; section: Section; savedSection: Section | null; onUpdate: (cv: CV) => void };

export default function ExperienceSection({ cv, section, savedSection, onUpdate }: Props) {
  const items = sortByOrder(section.items);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<ExperienceData>(emptyExperience);

  return (
    <div className="flex flex-col gap-3">
      {/* Items */}
      {items.map((item) => {
        const data = item.data as ExperienceData;
        const isDirty = isItemDirty(item, savedSection);
        return (
          <ItemBlock
            key={item.id}
            isDirty={isDirty}
            onRemove={() => onUpdate(removeSectionItem(cv, section.id, item.id))}
          >
            <ExperienceFields
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
          setDraft(emptyExperience);
          setOpen(true);
        }}
      >
        <PlusIcon />
        Add experience
      </Button>

      {/* Add dialog */}
      <AddItemDialog
        title="Add experience"
        open={open}
        onOpenChange={setOpen}
        onConfirm={() => onUpdate(addSectionItem(cv, section.id, draft))}
      >
        <ExperienceFields data={draft} onChange={setDraft} />
      </AddItemDialog>
    </div>
  );
}

function ExperienceFields({
  data,
  onChange,
}: {
  data: ExperienceData;
  onChange: (data: ExperienceData) => void;
}) {
  const set =
    (field: keyof ExperienceData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      onChange({ ...data, [field]: value || undefined });
    };

  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Role" className="col-span-2">
          <Input value={data.role ?? ""} onChange={set("role")} />
        </FormField>
        <FormField label="Company">
          <Input value={data.company ?? ""} onChange={set("company")} />
        </FormField>
        <FormField label="Location">
          <Input
            value={data.location ?? ""}
            onChange={set("location")}
            placeholder="e.g. Antwerpen"
          />
        </FormField>
        <FormField label="Start Date">
          <Input value={data.startDate ?? ""} onChange={set("startDate")} placeholder="Jan 2023" />
        </FormField>
        <FormField label="End Date">
          <Input value={data.endDate ?? ""} onChange={set("endDate")} placeholder="Present" />
        </FormField>
      </div>
      <FormField label="Description">
        <Textarea value={data.description ?? ""} onChange={set("description")} rows={3} />
      </FormField>
      <BulletListEditor
        bullets={data.bullets ?? []}
        onChange={(bullets) => onChange({ ...data, bullets })}
      />
      <TagInput
        label="Tech Stack"
        items={data.techStack ?? []}
        placeholder="Add a technology..."
        onChange={(techStack) => onChange({ ...data, techStack })}
      />
    </>
  );
}
