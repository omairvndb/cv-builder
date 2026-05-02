"use client";

import {
  emptyProjects,
  type CV,
  type Section,
  type SectionItem,
  type ProjectsData,
} from "@/lib/schemas";
import {
  addSectionItem,
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

type Props = { cv: CV; section: Section; onUpdate: (cv: CV) => void };

function ProjectItem({
  item,
  onUpdate,
  onRemove,
}: {
  item: SectionItem;
  onUpdate: (data: ProjectsData) => void;
  onRemove: () => void;
}) {
  const data = item.data as ProjectsData;

  const set =
    (field: keyof ProjectsData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      onUpdate({ ...data, [field]: field === "link" ? value || undefined : value });
    };

  const bullets = data.bullets ?? [];

  return (
    <ItemBlock onRemove={onRemove}>
      <FormField label="Title">
        <Input value={data.title} onChange={set("title")} />
      </FormField>
      <FormField label="Description">
        <Textarea value={data.description} onChange={set("description")} rows={3} />
      </FormField>
      <TagInput
        label="Tech Stack"
        items={data.techStack}
        placeholder="Add a technology..."
        onChange={(techStack) => onUpdate({ ...data, techStack })}
      />
      <BulletListEditor
        bullets={bullets}
        onChange={(next) => onUpdate({ ...data, bullets: next })}
      />
      <FormField label="Link">
        <Input
          value={data.link ?? ""}
          onChange={set("link")}
          placeholder="https://github.com/..."
        />
      </FormField>
    </ItemBlock>
  );
}

export default function ProjectsSection({ cv, section, onUpdate }: Props) {
  const items = sortByOrder(section.items);

  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => (
        <ProjectItem
          key={item.id}
          item={item}
          onUpdate={(data) => onUpdate(updateSectionItem(cv, section.id, item.id, data))}
          onRemove={() => onUpdate(removeSectionItem(cv, section.id, item.id))}
        />
      ))}
      <Button
        className="w-full"
        onClick={() => onUpdate(addSectionItem(cv, section.id, emptyProjects))}
      >
        <PlusIcon />
        Add project
      </Button>
    </div>
  );
}
