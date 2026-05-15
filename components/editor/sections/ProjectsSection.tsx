"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  addSectionItem,
  isItemDirty,
  removeSectionItem,
  reorderSectionItems,
  sortByOrder,
  updateSectionItem,
} from "@/lib/cv-helpers";
import { emptyProjects, type CV, type ProjectsData, type Section } from "@/lib/schemas";
import { PlusIcon } from "@phosphor-icons/react";
import { useState } from "react";
import AddItemDialog from "../shared/AddItemDialog";
import BulletListEditor from "../shared/BulletListEditor";
import FormField from "../shared/FormField";
import ItemBlock from "../shared/ItemBlock";
import SortableItems from "../shared/SortableItems";
import TagInput from "../shared/TagInput";

type Props = { cv: CV; section: Section; savedSection: Section | null; onUpdate: (cv: CV) => void };

export default function ProjectsSection({ cv, section, savedSection, onUpdate }: Props) {
  const items = sortByOrder(section.items);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<ProjectsData>(emptyProjects);

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
            <ProjectFields
              data={item.data as ProjectsData}
              onChange={(newData) => onUpdate(updateSectionItem(cv, section.id, item.id, newData))}
            />
          </ItemBlock>
        )}
      </SortableItems>

      {/* Add button */}
      <Button
        className="w-full"
        onClick={() => {
          setDraft(emptyProjects);
          setOpen(true);
        }}
      >
        <PlusIcon />
        Add project
      </Button>

      {/* Add dialog */}
      <AddItemDialog
        title="Add project"
        open={open}
        onOpenChange={setOpen}
        onConfirm={() => onUpdate(addSectionItem(cv, section.id, draft))}
      >
        <ProjectFields data={draft} onChange={setDraft} />
      </AddItemDialog>
    </div>
  );
}

function ProjectFields({
  data,
  onChange,
}: {
  data: ProjectsData;
  onChange: (data: ProjectsData) => void;
}) {
  const set =
    (field: keyof ProjectsData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      onChange({ ...data, [field]: value || undefined });
    };

  return (
    <>
      <FormField label="Title">
        <Input value={data.title ?? ""} onChange={set("title")} />
      </FormField>
      <FormField label="Description">
        <Textarea value={data.description ?? ""} onChange={set("description")} rows={3} />
      </FormField>
      <TagInput
        label="Tech Stack"
        items={data.techStack ?? []}
        placeholder="Add a technology..."
        onChange={(techStack) => onChange({ ...data, techStack })}
      />
      <BulletListEditor
        bullets={data.bullets ?? []}
        onChange={(bullets) => onChange({ ...data, bullets })}
      />
      <FormField label="Link">
        <Input
          value={data.link ?? ""}
          onChange={set("link")}
          placeholder="https://github.com/..."
        />
      </FormField>
    </>
  );
}
