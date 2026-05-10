"use client";

import { useState, type SubmitEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusIcon } from "@phosphor-icons/react";
import type { NewPresetCreateArgs, Preset } from "@/lib/schemas";
import { toast } from "sonner";

type NewPresetButtonProps = {
  presets: Preset[];
  currentPresetId?: string;
  onCreate: (args: NewPresetCreateArgs) => Promise<void>;
};

type Source = "blank" | "duplicate";

type NewPresetFormProps = {
  presets: Preset[];
  currentPresetId: string;
  onCreate: (args: NewPresetCreateArgs) => Promise<void>;
};

export default function NewPresetButton({
  presets,
  currentPresetId = "",
  onCreate,
}: NewPresetButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="icon" aria-label="New preset">
          <PlusIcon />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>New preset</DialogTitle>
          <DialogDescription>
            Create a new preset to tailor your CV for a different application.
          </DialogDescription>
        </DialogHeader>

        <NewPresetForm
          presets={presets}
          currentPresetId={currentPresetId}
          onCreate={async (args) => {
            await onCreate(args);
            setOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

function NewPresetForm({ presets, currentPresetId, onCreate }: NewPresetFormProps) {
  const [name, setName] = useState("");
  const [source, setSource] = useState<Source>("blank");
  const [fromPresetId, setFromPresetId] = useState<string>(currentPresetId);
  const [isPending, setIsPending] = useState(false);

  const trimmedName = name.trim();
  const nameTaken = presets.some((p) => p.name.toLowerCase() === trimmedName.toLowerCase());

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!trimmedName || nameTaken || isPending) return;
    setIsPending(true);
    try {
      if (source === "duplicate") {
        await onCreate({ source: "duplicate", name: trimmedName, fromPresetId });
      } else {
        await onCreate({ source: "blank", name: trimmedName });
      }
    } catch {
      toast.error("Failed to create preset.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <Field data-invalid={nameTaken ? "true" : undefined}>
        <FieldLabel htmlFor="new-preset-name">
          Name <span className="text-destructive">*</span>
        </FieldLabel>
        <Input
          id="new-preset-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="e.g. Frontend Developer"
          aria-invalid={nameTaken}
          className="text-foreground"
          required
        />
        {nameTaken && <FieldError>A preset with this name already exists.</FieldError>}
      </Field>

      {presets.length > 0 && (
        <FieldSet>
          <FieldLegend variant="label">Source</FieldLegend>
          <RadioGroup
            value={source}
            onValueChange={(value) => setSource(value as Source)}
            className="grid-cols-2"
          >
            <FieldLabel htmlFor="source-blank">
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>Blank</FieldTitle>
                  <FieldDescription>Start with an empty CV</FieldDescription>
                </FieldContent>
                <RadioGroupItem value="blank" id="source-blank" />
              </Field>
            </FieldLabel>
            <FieldLabel htmlFor="source-duplicate">
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>Duplicate</FieldTitle>
                  <FieldDescription>Copy from an existing preset</FieldDescription>
                </FieldContent>
                <RadioGroupItem value="duplicate" id="source-duplicate" />
              </Field>
            </FieldLabel>
          </RadioGroup>
        </FieldSet>
      )}

      {source === "duplicate" && (
        <div className="grid gap-2">
          <Label htmlFor="source-preset">Source preset</Label>
          <Select value={fromPresetId} onValueChange={setFromPresetId}>
            <SelectTrigger id="source-preset" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[...presets]
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((preset) => (
                  <SelectItem key={preset.id} value={preset.id}>
                    {preset.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline">
            Cancel
          </Button>
        </DialogClose>
        <Button type="submit" disabled={!trimmedName || nameTaken || isPending}>
          {isPending ? "Creating…" : "Create"}
        </Button>
      </DialogFooter>
    </form>
  );
}
