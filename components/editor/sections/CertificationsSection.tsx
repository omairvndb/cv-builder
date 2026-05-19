"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  addSectionItem,
  isItemDirty,
  removeSectionItem,
  reorderSectionItems,
  sortByOrder,
  updateSectionItem,
} from "@/lib/cv-helpers";
import { emptyCertification, type CV, type CertificationsData, type Section } from "@/lib/schemas";
import { PlusIcon } from "@phosphor-icons/react";
import { useState } from "react";
import AddItemDialog from "../shared/AddItemDialog";
import FormField from "../shared/FormField";
import ItemBlock from "../shared/ItemBlock";
import SortableItems from "../shared/SortableItems";

type Props = { cv: CV; section: Section; savedSection: Section | null; onUpdate: (cv: CV) => void };

export default function CertificationsSection({ cv, section, savedSection, onUpdate }: Props) {
  const items = sortByOrder(section.items);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<CertificationsData>(emptyCertification);

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
            <CertificationFields
              data={item.data as CertificationsData}
              onChange={(newData) => onUpdate(updateSectionItem(cv, section.id, item.id, newData))}
            />
          </ItemBlock>
        )}
      </SortableItems>

      {/* Add button */}
      <Button
        className="w-full"
        onClick={() => {
          setDraft(emptyCertification);
          setOpen(true);
        }}
      >
        <PlusIcon />
        Add certification
      </Button>

      {/* Add dialog */}
      <AddItemDialog
        title="Add certification"
        open={open}
        onOpenChange={setOpen}
        onConfirm={() => onUpdate(addSectionItem(cv, section.id, draft))}
      >
        <CertificationFields data={draft} onChange={setDraft} />
      </AddItemDialog>
    </div>
  );
}

function CertificationFields({
  data,
  onChange,
}: {
  data: CertificationsData;
  onChange: (data: CertificationsData) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <FormField label="Name">
        <Input
          value={data.name ?? ""}
          onChange={(e) => onChange({ ...data, name: e.target.value || undefined })}
        />
      </FormField>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Issuer">
          <Input
            value={data.issuer ?? ""}
            onChange={(e) => onChange({ ...data, issuer: e.target.value || undefined })}
          />
        </FormField>
        <FormField label="Date">
          <Input
            value={data.date ?? ""}
            onChange={(e) => onChange({ ...data, date: e.target.value || undefined })}
          />
        </FormField>
      </div>
    </div>
  );
}
