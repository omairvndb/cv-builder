import { emptyExperience, type CV, type Section, type ExperienceData } from "@/lib/schemas";
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

type Props = { cv: CV; section: Section; onUpdate: (cv: CV) => void };

export default function ExperienceSection({ cv, section, onUpdate }: Props) {
  const items = sortByOrder(section.items);

  const update = (id: string, field: keyof ExperienceData, value: string) => {
    const item = section.items.find((i) => i.id === id)!;
    onUpdate(
      updateSectionItem(cv, section.id, id, { ...(item.data as ExperienceData), [field]: value })
    );
  };

  const updateBullets = (id: string, bullets: string[]) => {
    const item = section.items.find((i) => i.id === id)!;
    onUpdate(updateSectionItem(cv, section.id, id, { ...(item.data as ExperienceData), bullets }));
  };

  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => {
        const data = item.data as ExperienceData;
        const set =
          (field: keyof ExperienceData) =>
          (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
            update(item.id, field, e.target.value);
        const bullets = data.bullets ?? [];

        return (
          <ItemBlock
            key={item.id}
            onRemove={() => onUpdate(removeSectionItem(cv, section.id, item.id))}
          >
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Role" className="col-span-2">
                <Input value={data.role} onChange={set("role")} />
              </FormField>
              <FormField label="Company">
                <Input value={data.company} onChange={set("company")} />
              </FormField>
              <FormField label="Location">
                <Input
                  value={data.location ?? ""}
                  onChange={set("location")}
                  placeholder="e.g. Antwerpen"
                />
              </FormField>
              <FormField label="Start Date">
                <Input value={data.startDate} onChange={set("startDate")} placeholder="Jan 2023" />
              </FormField>
              <FormField label="End Date">
                <Input value={data.endDate} onChange={set("endDate")} placeholder="Present" />
              </FormField>
            </div>
            <FormField label="Description">
              <Textarea value={data.description} onChange={set("description")} rows={3} />
            </FormField>
            <BulletListEditor bullets={bullets} onChange={(next) => updateBullets(item.id, next)} />
          </ItemBlock>
        );
      })}
      <Button
        className="w-full"
        onClick={() => onUpdate(addSectionItem(cv, section.id, emptyExperience))}
      >
        <PlusIcon />
        Add experience
      </Button>
    </div>
  );
}
