"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Preset } from "@/lib/schemas";
import { AsteriskSimpleIcon, CaretDownIcon } from "@phosphor-icons/react";

type PresetSwitcherProps = {
  presets: Preset[];
  activePresetId: string;
  onSwitch: (presetId: string) => void;
};

export default function PresetSwitcher({ presets, activePresetId, onSwitch }: PresetSwitcherProps) {
  const activePreset = presets.find((p) => p.id === activePresetId);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <span className="truncate max-w-48">{activePreset?.name}</span>
          <CaretDownIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Select Preset</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={activePresetId} onValueChange={onSwitch}>
            {presets.map((preset) => (
              <DropdownMenuRadioItem key={preset.id} value={preset.id}>
                <span className="truncate">{preset.name}</span>
                {preset.isDefault && <AsteriskSimpleIcon weight="fill" />}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
