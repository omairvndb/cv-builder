"use client";

import { ButtonGroup } from "@/components/ui/button-group";
import type { Preset } from "@/lib/schemas";
import type { ComponentProps } from "react";
import NewPresetButton from "./NewPresetButton";
import PresetDropdownMenu from "./PresetDropdownMenu";

type PresetControlsProps = {
  presets: Preset[];
  activePresetId: string;
  onSwitch: (presetId: string) => void;
  onCreate: ComponentProps<typeof NewPresetButton>["onCreate"];
  onRename: (name: string) => void;
  onToggleDefault: () => void;
  onDelete: () => void;
  isDeleting?: boolean;
};

export default function PresetControls({
  presets,
  activePresetId,
  onSwitch,
  onCreate,
  onRename,
  onToggleDefault,
  onDelete,
  isDeleting,
}: PresetControlsProps) {
  return (
    <ButtonGroup>
      <PresetDropdownMenu
        presets={presets}
        activePresetId={activePresetId}
        onSwitch={onSwitch}
        onRename={onRename}
        onToggleDefault={onToggleDefault}
        onDelete={onDelete}
        isDeleting={isDeleting}
      />

      <NewPresetButton presets={presets} currentPresetId={activePresetId} onCreate={onCreate} />
    </ButtonGroup>
  );
}
