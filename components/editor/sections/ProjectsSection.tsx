"use client";

import { useState } from "react";
import type { CV, Section, SectionItem, ProjectsData } from "@/lib/schemas";
import { addSectionItem, removeSectionItem, updateSectionItem } from "@/lib/cv-helpers";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import ItemBlock from "../shared/ItemBlock";

type Props = { cv: CV; section: Section; onUpdate: (cv: CV) => void };

const empty: ProjectsData = { title: "", description: "", techStack: [], link: undefined };

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
  const [rawTechStack, setRawTechStack] = useState(() => data.techStack.join(", "));

  const set =
    (field: keyof ProjectsData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      onUpdate({ ...data, [field]: field === "link" ? value || undefined : value });
    };

  return (
    <ItemBlock onRemove={onRemove}>
      <div className="flex flex-col gap-1.5">
        <Label>Title</Label>
        <Input value={data.title} onChange={set("title")} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>Description</Label>
        <Textarea value={data.description} onChange={set("description")} rows={3} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>Tech Stack</Label>
        <Input
          value={rawTechStack}
          placeholder="React, TypeScript, Prisma"
          onChange={(e) => {
            setRawTechStack(e.target.value);
            onUpdate({
              ...data,
              techStack: e.target.value
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean),
            });
          }}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>Link</Label>
        <Input
          value={data.link ?? ""}
          onChange={set("link")}
          placeholder="https://github.com/..."
        />
      </div>
    </ItemBlock>
  );
}

export default function ProjectsSection({ cv, section, onUpdate }: Props) {
  const items = [...section.items].sort((a, b) => a.order - b.order);

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
      <Button className="w-full" onClick={() => onUpdate(addSectionItem(cv, section.id, empty))}>
        Add project
      </Button>
    </div>
  );
}
