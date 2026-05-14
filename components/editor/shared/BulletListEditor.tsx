"use client";

import { PlusIcon, XIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import ConfirmDialog from "./ConfirmDialog";
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
          <div key={i} className="flex items-start gap-1.5">
            <Textarea
              value={bullet}
              className="min-h-8 resize-none!"
              onChange={(e) => update(i, e.target.value)}
            />
            <ConfirmDialog
              trigger={
                <Button variant="outline" size="icon" type="button" disabled={bullets.length <= 1}>
                  <XIcon />
                </Button>
              }
              title="Remove bullet point?"
              description="This action cannot be undone."
              confirmLabel="Remove"
              onConfirm={() => remove(i)}
            />
          </div>
        ))}
        <Button variant="outline" size="xs" type="button" className="w-full" onClick={add}>
          <PlusIcon /> Add bullet
        </Button>
      </div>
    </FormField>
  );
}
