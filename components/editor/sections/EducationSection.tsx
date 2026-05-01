import { XIcon } from "@phosphor-icons/react";
import type { CV, Section, EducationData } from "@/lib/schemas";
import { addSectionItem, removeSectionItem, updateSectionItem } from "@/lib/cv-helpers";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type Props = { cv: CV; section: Section; onUpdate: (cv: CV) => void };

const empty: EducationData = { institution: "", degree: "", startDate: "", endDate: "" };

export default function EducationSection({ cv, section, onUpdate }: Props) {
  const items = [...section.items].sort((a, b) => a.order - b.order);

  const update = (id: string, field: keyof EducationData, value: string) => {
    const item = section.items.find((i) => i.id === id)!;
    const data = item.data as EducationData;
    onUpdate(
      updateSectionItem(cv, section.id, id, {
        ...data,
        [field]: field === "description" ? value || undefined : value,
      })
    );
  };

  return (
    <div className="flex flex-col gap-4">
      {items.map((item) => {
        const data = item.data as EducationData;
        const set =
          (field: keyof EducationData) =>
          (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
            update(item.id, field, e.target.value);

        return (
          <div key={item.id} className="relative flex flex-col gap-3 rounded-md border p-3 pt-4">
            <Button
              variant="ghost"
              size="icon-xs"
              className="absolute top-2 right-2"
              onClick={() => onUpdate(removeSectionItem(cv, section.id, item.id))}
            >
              <XIcon />
            </Button>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label>Degree</Label>
                <Input value={data.degree} onChange={set("degree")} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Institution</Label>
                <Input value={data.institution} onChange={set("institution")} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Start Date</Label>
                <Input value={data.startDate} onChange={set("startDate")} placeholder="Sep 2020" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>End Date</Label>
                <Input value={data.endDate} onChange={set("endDate")} placeholder="Jun 2023" />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Description</Label>
              <Textarea value={data.description ?? ""} onChange={set("description")} rows={2} />
            </div>
          </div>
        );
      })}
      <Button
        variant="outline"
        className="w-full"
        onClick={() => onUpdate(addSectionItem(cv, section.id, empty))}
      >
        Add education
      </Button>
    </div>
  );
}
