"use client";

// Central state hub for the editor. Owns all preset + CV state.

import { useEffect, useState } from "react";
import { createPreset, deletePreset, duplicatePreset, updatePreset } from "@/lib/actions/presets";
import { useAutoSave } from "@/hooks/useAutoSave";
import type { CV, NewPresetCreateArgs, Preset } from "@/lib/schemas";
import EditorPanel from "@/components/editor/EditorPanel";
import NoPresetsState from "@/components/editor/presets/NoPresetsState";
import PreviewPanel from "@/components/editor/PreviewPanel";

const PREVIEW_DEBOUNCE_MS = 800;

/**
 * Selects the preset to activate on load.
 * Prefers the default preset; falls back to the first in the list; returns null if none exist.
 */
function pickInitialPresetId(presets: Preset[]): string | null {
  return presets.find((p) => p.isDefault)?.id ?? presets[0]?.id ?? null;
}

export default function EditorClient({ initialPresets }: { initialPresets: Preset[] }) {
  const [presets, setPresets] = useState<Preset[]>(initialPresets);
  const [activePresetId, setActivePresetId] = useState<string | null>(() =>
    pickInitialPresetId(initialPresets)
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const activePreset = presets.find((p) => p.id === activePresetId) ?? null;
  const activeCV = activePreset?.cv ?? null;

  // Separate from activeCV so the PDF preview can be debounced
  const [previewCV, setPreviewCV] = useState<CV | null>(activeCV);

  const { status: saveStatus, save: scheduleAutoSave } = useAutoSave();

  // Sync previewCV to activeCV after a debounce.
  // The cleanup cancels any pending update when activeCV changes again before the timeout fires.
  useEffect(() => {
    if (!activeCV) return;
    const timeoutId = setTimeout(() => setPreviewCV(activeCV), PREVIEW_DEBOUNCE_MS);
    return () => clearTimeout(timeoutId);
  }, [activeCV]);

  function handleUpdateCV(cv: CV) {
    if (!activePresetId) return;
    setPresets((prev) =>
      prev.map((p) => (p.id === activePresetId ? { ...p, cv, updatedAt: new Date() } : p))
    );
    scheduleAutoSave(cv);
  }

  /**
   * Switches the active preset and immediately syncs the preview.
   * Bypasses the debounce: the 800ms lag only applies to live edits, not preset switches.
   */
  function handleSwitchPreset(presetId: string) {
    const next = presets.find((p) => p.id === presetId)?.cv;
    if (!next) return;
    setActivePresetId(presetId);
    setPreviewCV(next);
  }

  async function handleCreatePreset(args: NewPresetCreateArgs) {
    const preset =
      args.source === "duplicate"
        ? await duplicatePreset(args.fromPresetId, args.name)
        : await createPreset(args.name);
    setPresets((prev) => [...prev, preset]);
    setActivePresetId(preset.id);
    setPreviewCV(preset.cv ?? null);
  }

  /**
   * Renames the active preset.
   * Optimistic: updates the UI immediately then persists. (No rollback on failure yet)
   */
  async function handleRenamePreset(name: string) {
    if (!activePresetId) return;
    setPresets((prev) =>
      prev.map((p) => (p.id === activePresetId ? { ...p, name, updatedAt: new Date() } : p))
    );
    try {
      await updatePreset(activePresetId, { name });
    } catch (error) {
      console.error("Failed to rename preset:", error);
    }
  }

  /**
   * Toggles whether the active preset is the default.
   * Optimistic: updates the UI immediately then persists. (No rollback on failure yet)
   * Clears `isDefault` on all other presets when promoting a new one.
   */
  async function handleToggleDefaultPreset() {
    if (!activePresetId) return;
    const newIsDefault = !activePreset?.isDefault;
    setPresets((prev) =>
      prev.map((p) => ({
        ...p,
        isDefault: newIsDefault ? p.id === activePresetId : false,
      }))
    );
    try {
      await updatePreset(activePresetId, { isDefault: newIsDefault });
    } catch (error) {
      console.error("Failed to update preset default:", error);
    }
  }

  /**
   * Deletes the active preset and activates the next available one.
   * Server-first (unlike rename/toggle): removing from the UI before the server
   * confirms would leave a ghost preset the user can't interact with.
   */
  async function handleDeletePreset() {
    if (!activePresetId) return;
    setIsDeleting(true);
    try {
      await deletePreset(activePresetId);
    } catch (error) {
      console.error("Failed to delete preset:", error);
      setIsDeleting(false);
      return;
    }
    setIsDeleting(false);
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
        saveStatus={saveStatus}
        onSwitchPreset={handleSwitchPreset}
        onCreatePreset={handleCreatePreset}
        onRenamePreset={handleRenamePreset}
        onToggleDefaultPreset={handleToggleDefaultPreset}
        onDeletePreset={handleDeletePreset}
        isDeleting={isDeleting}
      />
    </div>
  );
}
