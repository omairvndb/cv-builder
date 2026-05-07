"use client";

import { useEffect, useState } from "react";
import type { NewPresetCreateArgs } from "@/components/editor/presets/NewPresetDialog";
import { mockPresets } from "@/lib/mock-data";
import { createPreset } from "@/lib/cv-helpers";
import type { CV, Preset } from "@/lib/schemas";
import EditorPanel from "@/components/editor/EditorPanel";
import NoPresetsState from "@/components/editor/presets/NoPresetsState";
import PreviewPanel from "@/components/editor/PreviewPanel";

const PREVIEW_DEBOUNCE_MS = 800;

function pickInitialPresetId(presets: Preset[]): string | null {
  return presets.find((p) => p.isDefault)?.id ?? presets[0]?.id ?? null;
}

export default function EditorPage() {
  const [presets, setPresets] = useState<Preset[]>(mockPresets);
  const [activePresetId, setActivePresetId] = useState<string | null>(() =>
    pickInitialPresetId(mockPresets)
  );

  const activePreset = presets.find((p) => p.id === activePresetId) ?? null;
  const activeCV = activePreset?.cv ?? null;
  const [previewCV, setPreviewCV] = useState<CV | null>(activeCV);

  useEffect(() => {
    if (previewCV === activeCV || !activeCV) return;
    const timeoutId = window.setTimeout(() => setPreviewCV(activeCV), PREVIEW_DEBOUNCE_MS);
    return () => window.clearTimeout(timeoutId);
  }, [activeCV, previewCV]);

  function handleUpdateCV(cv: CV) {
    if (!activePresetId) return;
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

  function handleRenamePreset(name: string) {
    if (!activePresetId) return;
    setPresets((prev) =>
      prev.map((p) => (p.id === activePresetId ? { ...p, name, updatedAt: new Date() } : p))
    );
  }

  function handleToggleDefaultPreset() {
    if (!activePresetId) return;
    const isCurrentlyDefault = activePreset?.isDefault ?? false;
    setPresets((prev) =>
      prev.map((p) => ({
        ...p,
        isDefault: isCurrentlyDefault ? false : p.id === activePresetId,
      }))
    );
  }

  function handleDeletePreset() {
    if (!activePresetId) return;
    const remaining = presets.filter((p) => p.id !== activePresetId);
    setPresets(remaining);
    const next = remaining.find((p) => p.isDefault) ?? remaining[0] ?? null;
    setActivePresetId(next?.id ?? null);
    setPreviewCV(next?.cv ?? null);
  }

  if (!activeCV || !previewCV || !activePresetId) {
    return <NoPresetsState onCreate={handleCreatePreset} />;
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
        onRenamePreset={handleRenamePreset}
        onToggleDefaultPreset={handleToggleDefaultPreset}
        onDeletePreset={handleDeletePreset}
      />
    </div>
  );
}
