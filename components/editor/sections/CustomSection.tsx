import { XIcon } from "@phosphor-icons/react";
import type { CV, Section, CustomData } from "@/lib/schemas";
import { addSectionItem, removeSectionItem, updateSectionItem } from "@/lib/cv-helpers";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type Props = { cv: CV; section: Section; onUpdate: (cv: CV) => void };

const empty: CustomData = { content: "" };

export default function CustomSection({ cv, section, onUpdate }: Props) {
  const items = [...section.items].sort((a, b) => a.order - b.order);

  return (
    <div className="flex flex-col gap-4">
      {items.map((item) => {
        const data = item.data as CustomData;
        return (
          <div key={item.id} className="relative flex flex-col gap-1.5 rounded-md border p-3 pt-4">
            <Button
              variant="ghost"
              size="icon-xs"
              className="absolute top-2 right-2"
              onClick={() => onUpdate(removeSectionItem(cv, section.id, item.id))}
            >
              <XIcon />
            </Button>
            <Label>Content</Label>
            <Textarea
              value={data.content}
              onChange={(e) =>
                onUpdate(updateSectionItem(cv, section.id, item.id, { content: e.target.value }))
              }
              rows={3}
            />
          </div>
        );
      })}
      <Button
        variant="outline"
        className="w-full"
        onClick={() => onUpdate(addSectionItem(cv, section.id, empty))}
      >
        Add entry
      </Button>
    </div>
  );
}
