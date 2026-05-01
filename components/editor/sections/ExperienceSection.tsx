import type { CV, Section, ExperienceData } from "@/lib/schemas";
import { addSectionItem, removeSectionItem, updateSectionItem } from "@/lib/cv-helpers";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import ItemBlock from "../shared/ItemBlock";

type Props = { cv: CV; section: Section; onUpdate: (cv: CV) => void };

const empty: ExperienceData = {
  company: "",
  role: "",
  startDate: "",
  endDate: "",
  description: "",
};

export default function ExperienceSection({ cv, section, onUpdate }: Props) {
  const items = [...section.items].sort((a, b) => a.order - b.order);

  const update = (id: string, field: keyof ExperienceData, value: string) => {
    const item = section.items.find((i) => i.id === id)!;
    onUpdate(
      updateSectionItem(cv, section.id, id, { ...(item.data as ExperienceData), [field]: value })
    );
  };

  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => {
        const data = item.data as ExperienceData;
        const set =
          (field: keyof ExperienceData) =>
          (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
            update(item.id, field, e.target.value);

        return (
          <ItemBlock
            key={item.id}
            onRemove={() => onUpdate(removeSectionItem(cv, section.id, item.id))}
          >
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 flex flex-col gap-1.5">
                <Label>Role</Label>
                <Input value={data.role} onChange={set("role")} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Company</Label>
                <Input value={data.company} onChange={set("company")} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Location</Label>
                <Input
                  value={data.location ?? ""}
                  onChange={set("location")}
                  placeholder="e.g. Antwerpen"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Start Date</Label>
                <Input value={data.startDate} onChange={set("startDate")} placeholder="Jan 2023" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>End Date</Label>
                <Input value={data.endDate} onChange={set("endDate")} placeholder="Present" />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Description</Label>
              <Textarea value={data.description} onChange={set("description")} rows={3} />
            </div>
          </ItemBlock>
        );
      })}
      <Button className="w-full" onClick={() => onUpdate(addSectionItem(cv, section.id, empty))}>
        Add experience
      </Button>
    </div>
  );
}
