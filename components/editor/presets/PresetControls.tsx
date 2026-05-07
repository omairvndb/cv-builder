"use client";

import type { ComponentProps } from "react";
import type { Preset } from "@/lib/schemas";
import { ButtonGroup } from "@/components/ui/button-group";
import NewPresetButton from "./NewPresetButton";
import PresetSwitcher from "./PresetSwitcher";

type PresetControlsProps = {
  presets: Preset[];
  activePresetId: string;
  onSwitch: (presetId: string) => void;
  onCreate: ComponentProps<typeof NewPresetButton>["onCreate"];
  onRename: (name: string) => void;
  onToggleDefault: () => void;
  onDelete: () => void;
};

export default function PresetControls({
  presets,
  activePresetId,
  onSwitch,
  onCreate,
  onRename,
  onToggleDefault,
  onDelete,
}: PresetControlsProps) {
  return (
    <ButtonGroup>
      <PresetSwitcher
        presets={presets}
        activePresetId={activePresetId}
        onSwitch={onSwitch}
        onRename={onRename}
        onToggleDefault={onToggleDefault}
        onDelete={onDelete}
      />

      <NewPresetButton presets={presets} currentPresetId={activePresetId} onCreate={onCreate} />
    </ButtonGroup>
  );
}
