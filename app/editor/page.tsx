"use client";

import { useEffect, useState } from "react";
import type { NewPresetCreateArgs } from "@/components/editor/presets/NewPresetDialog";
import { mockPresets } from "@/lib/mock-data";
import { createPreset } from "@/lib/cv-helpers";
import type { CV, Preset } from "@/lib/schemas";
import EditorPanel from "@/components/editor/EditorPanel";
import PreviewPanel from "@/components/editor/PreviewPanel";

const PREVIEW_DEBOUNCE_MS = 800;

function pickInitialPresetId(presets: Preset[]): string {
  return (presets.find((p) => p.isDefault) ?? presets[0]).id;
}

export default function EditorPage() {
  const [presets, setPresets] = useState<Preset[]>(mockPresets);
  const [activePresetId, setActivePresetId] = useState<string>(() =>
    pickInitialPresetId(mockPresets)
  );

  const activeCV = presets.find((p) => p.id === activePresetId)!.cv!;
  const [previewCV, setPreviewCV] = useState<CV>(activeCV);

  useEffect(() => {
    if (previewCV === activeCV) return;

    const timeoutId = window.setTimeout(() => {
      setPreviewCV(activeCV);
    }, PREVIEW_DEBOUNCE_MS);

    return () => window.clearTimeout(timeoutId);
  }, [activeCV, previewCV]);

  function handleUpdateCV(cv: CV) {
    setPresets((prev) =>
      prev.map((p) => (p.id === activePresetId ? { ...p, cv, updatedAt: new Date() } : p))
    );
  }

  function handleSwitchPreset(presetId: string) {
    const next = presets.find((p) => p.id === presetId)?.cv;
    if (!next) return;
    setActivePresetId(presetId);
    setPreviewCV(next);
  }

  function handleCreatePreset(args: NewPresetCreateArgs) {
    const fromCV =
      args.source === "duplicate" ? presets.find((p) => p.id === args.fromPresetId)?.cv : undefined;
    const preset = createPreset({ name: args.name, fromCV });
    setPresets((prev) => [...prev, preset]);
    setActivePresetId(preset.id);
    setPreviewCV(preset.cv!);
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      <EditorPanel cv={activeCV} onUpdate={handleUpdateCV} />
      <PreviewPanel
        cv={previewCV}
        presets={presets}
        activePresetId={activePresetId}
        onSwitchPreset={handleSwitchPreset}
        onCreatePreset={handleCreatePreset}
      />
    </div>
  );
}
