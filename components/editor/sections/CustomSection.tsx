import type { CV, Section, CustomData } from "@/lib/schemas";
import { addSectionItem, removeSectionItem, updateSectionItem } from "@/lib/cv-helpers";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import ItemBlock from "../shared/ItemBlock";

type Props = { cv: CV; section: Section; onUpdate: (cv: CV) => void };

const empty: CustomData = { content: "" };

export default function CustomSection({ cv, section, onUpdate }: Props) {
  const items = [...section.items].sort((a, b) => a.order - b.order);

  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => {
        const data = item.data as CustomData;
        return (
          <ItemBlock
            key={item.id}
            onRemove={() => onUpdate(removeSectionItem(cv, section.id, item.id))}
          >
            <Label>Content</Label>
            <Textarea
              value={data.content}
              onChange={(e) =>
                onUpdate(updateSectionItem(cv, section.id, item.id, { content: e.target.value }))
              }
              rows={3}
            />
          </ItemBlock>
        );
      })}
      <Button className="w-full" onClick={() => onUpdate(addSectionItem(cv, section.id, empty))}>
        Add entry
      </Button>
    </div>
  );
}
