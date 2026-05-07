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
} from "@/components/ui/dialog";
import {
  Field,
  FieldContent,
  FieldDescription,
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
import type { Preset } from "@/lib/schemas";

export type NewPresetCreateArgs =
  | { source: "blank"; name: string }
  | { source: "duplicate"; name: string; fromPresetId: string };

type NewPresetDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  presets: Preset[];
  currentPresetId: string;
  onCreate: (args: NewPresetCreateArgs) => void;
};

export default function NewPresetDialog({
  open,
  onOpenChange,
  presets,
  currentPresetId,
  onCreate,
}: NewPresetDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
          onCreate={(args) => {
            onCreate(args);
            onOpenChange(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

type Source = "blank" | "duplicate";

type NewPresetFormProps = {
  presets: Preset[];
  currentPresetId: string;
  onCreate: (args: NewPresetCreateArgs) => void;
};

function NewPresetForm({ presets, currentPresetId, onCreate }: NewPresetFormProps) {
  const [name, setName] = useState("");
  const [source, setSource] = useState<Source>("blank");
  const [fromPresetId, setFromPresetId] = useState<string>(currentPresetId);

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    if (source === "duplicate") {
      onCreate({ source: "duplicate", name: trimmed, fromPresetId });
    } else {
      onCreate({ source: "blank", name: trimmed });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="new-preset-name">Name</Label>
        <Input
          id="new-preset-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="e.g. Frontend Developer"
        />
      </div>

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

      {source === "duplicate" && (
        <div className="grid gap-2">
          <Label htmlFor="source-preset">Source preset</Label>
          <Select value={fromPresetId} onValueChange={setFromPresetId}>
            <SelectTrigger id="source-preset" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {presets.map((preset) => (
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
        <Button type="submit" disabled={!name.trim()}>
          Create
        </Button>
      </DialogFooter>
    </form>
  );
}
