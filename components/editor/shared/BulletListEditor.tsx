"use client";

import { PlusIcon, XIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FormField from "./FormField";

type Props = { bullets: string[]; onChange: (bullets: string[]) => void };

export default function BulletListEditor({ bullets, onChange }: Props) {
  const update = (i: number, value: string) =>
    onChange(bullets.map((b, idx) => (idx === i ? value : b)));
  const remove = (i: number) => onChange(bullets.filter((_, idx) => idx !== i));
  const add = () => onChange([...bullets, ""]);

  return (
    <FormField label="Bullet points">
      <div className="flex flex-col gap-1.5">
        {bullets.map((bullet, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <Input value={bullet} onChange={(e) => update(i, e.target.value)} />
            <Button variant="outline" size="icon" type="button" onClick={() => remove(i)}>
              <XIcon />
            </Button>
          </div>
        ))}
        <Button variant="outline" size="xs" type="button" className="w-full" onClick={add}>
          <PlusIcon /> Add bullet
        </Button>
      </div>
    </FormField>
  );
}
