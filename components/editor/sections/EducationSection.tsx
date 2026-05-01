import type { CV, Section, EducationData } from "@/lib/schemas";
import { addSectionItem, removeSectionItem, updateSectionItem } from "@/lib/cv-helpers";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PlusIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import ItemBlock from "../shared/ItemBlock";
import FormField from "../shared/FormField";

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
    <div className="flex flex-col gap-3">
      {items.map((item) => {
        const data = item.data as EducationData;
        const set =
          (field: keyof EducationData) =>
          (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
            update(item.id, field, e.target.value);

        return (
          <ItemBlock
            key={item.id}
            onRemove={() => onUpdate(removeSectionItem(cv, section.id, item.id))}
          >
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Degree" className="col-span-2">
                <Input value={data.degree} onChange={set("degree")} />
              </FormField>
              <FormField label="Institution">
                <Input value={data.institution} onChange={set("institution")} />
              </FormField>
              <FormField label="Location">
                <Input
                  value={data.location ?? ""}
                  onChange={set("location")}
                  placeholder="e.g. Antwerpen"
                />
              </FormField>
              <FormField label="Start Date">
                <Input value={data.startDate} onChange={set("startDate")} placeholder="Sep 2020" />
              </FormField>
              <FormField label="End Date">
                <Input value={data.endDate} onChange={set("endDate")} placeholder="Jun 2023" />
              </FormField>
            </div>
            <FormField label="Description">
              <Textarea value={data.description ?? ""} onChange={set("description")} rows={2} />
            </FormField>
          </ItemBlock>
        );
      })}
      <Button className="w-full" onClick={() => onUpdate(addSectionItem(cv, section.id, empty))}>
        <PlusIcon />
        Add education
      </Button>
    </div>
  );
}
