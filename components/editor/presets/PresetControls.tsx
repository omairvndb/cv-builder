"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Preset } from "@/lib/schemas";
import { PlusIcon } from "@phosphor-icons/react";
import NewPresetDialog, { type NewPresetCreateArgs } from "./NewPresetDialog";
import PresetSwitcher from "./PresetSwitcher";

type PresetControlsProps = {
  presets: Preset[];
  activePresetId: string;
  onSwitch: (presetId: string) => void;
  onCreate: (args: NewPresetCreateArgs) => void;
};

export default function PresetControls({
  presets,
  activePresetId,
  onSwitch,
  onCreate,
}: PresetControlsProps) {
  const [newDialogOpen, setNewDialogOpen] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <PresetSwitcher presets={presets} activePresetId={activePresetId} onSwitch={onSwitch} />

      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={() => setNewDialogOpen(true)}
        aria-label="New preset"
      >
        <PlusIcon />
      </Button>

      <NewPresetDialog
        open={newDialogOpen}
        onOpenChange={setNewDialogOpen}
        presets={presets}
        currentPresetId={activePresetId}
        onCreate={onCreate}
      />
    </div>
  );
}
