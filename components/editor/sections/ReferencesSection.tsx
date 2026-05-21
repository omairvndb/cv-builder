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
import { emptyReference, type CV, type ReferencesData, type Section } from "@/lib/schemas";
import { PlusIcon } from "@phosphor-icons/react";
import { useState } from "react";
import AddItemDialog from "../shared/AddItemDialog";
import FormField from "../shared/FormField";
import ItemBlock from "../shared/ItemBlock";
import SortableItems from "../shared/SortableItems";

type Props = { cv: CV; section: Section; savedSection: Section | null; onUpdate: (cv: CV) => void };

export default function ReferencesSection({ cv, section, savedSection, onUpdate }: Props) {
  const items = sortByOrder(section.items);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<ReferencesData>(emptyReference);

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
            <ReferenceFields
              data={item.data as ReferencesData}
              onChange={(newData) => onUpdate(updateSectionItem(cv, section.id, item.id, newData))}
            />
          </ItemBlock>
        )}
      </SortableItems>

      {/* Add button */}
      <Button
        className="w-full"
        onClick={() => {
          setDraft(emptyReference);
          setOpen(true);
        }}
      >
        <PlusIcon />
        Add reference
      </Button>

      {/* Add dialog */}
      <AddItemDialog
        title="Add reference"
        open={open}
        onOpenChange={setOpen}
        onConfirm={() => onUpdate(addSectionItem(cv, section.id, draft))}
      >
        <ReferenceFields data={draft} onChange={setDraft} />
      </AddItemDialog>
    </div>
  );
}

function ReferenceFields({
  data,
  onChange,
}: {
  data: ReferencesData;
  onChange: (data: ReferencesData) => void;
}) {
  const set =
    (field: keyof ReferencesData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      onChange({ ...data, [field]: value || undefined });
    };

  return (
    <div className="flex flex-col gap-3">
      <FormField label="Name">
        <Input value={data.name ?? ""} onChange={set("name")} />
      </FormField>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Role">
          <Input value={data.role ?? ""} onChange={set("role")} />
        </FormField>
        <FormField label="Company">
          <Input value={data.company ?? ""} onChange={set("company")} />
        </FormField>
        <FormField label="Email">
          <Input value={data.email ?? ""} onChange={set("email")} />
        </FormField>
        <FormField label="Phone">
          <Input value={data.phone ?? ""} onChange={set("phone")} />
        </FormField>
      </div>
      <FormField label="Quote">
        <Textarea value={data.quote ?? ""} onChange={set("quote")} rows={3} />
      </FormField>
    </div>
  );
}
