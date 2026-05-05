"use client";

import type { Preset } from "@/lib/schemas";
import PresetSwitcher from "./PresetSwitcher";

type PresetControlsProps = {
  presets: Preset[];
  activePresetId: string;
  onSwitch: (presetId: string) => void;
};

export default function PresetControls({ presets, activePresetId, onSwitch }: PresetControlsProps) {
  return (
    <div className="flex items-center gap-2">
      <PresetSwitcher presets={presets} activePresetId={activePresetId} onSwitch={onSwitch} />
      {/* "+" button + NewPresetDialog land in Step C */}
    </div>
  );
}
