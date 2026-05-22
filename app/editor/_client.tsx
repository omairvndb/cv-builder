"use client";

// Central state hub for the editor. Owns all preset + CV state.

import { useCallback, useEffect, useState } from "react";
import { createPreset, deletePreset, duplicatePreset, updatePreset } from "@/lib/actions/presets";
import { saveCV } from "@/lib/actions/cv";
import { toast } from "sonner";
import type { CV, NewPresetCreateArgs, Preset } from "@/lib/schemas";
import EditorPanel from "@/components/editor/EditorPanel";
import NoPresetsState from "@/components/editor/presets/NoPresetsState";
import PreviewPanel from "@/components/editor/PreviewPanel";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

type PendingAction =
  | { type: "switch"; presetId: string }
  | { type: "create"; args: NewPresetCreateArgs };

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
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);

  const activePreset = presets.find((p) => p.id === activePresetId) ?? null;
  const activeCV = activePreset?.cv ?? null;

  // previewCV only updates on explicit save (this is what drives the PDF re-render)
  const [previewCV, setPreviewCV] = useState<CV | null>(activeCV);
  const isDirty = JSON.stringify(activeCV) !== JSON.stringify(previewCV); // = unsaved changes

  const handleSave = useCallback(async (): Promise<boolean> => {
    if (!activeCV || !isDirty) return true;
    setSaveStatus("saving");
    try {
      await saveCV(activeCV);
      setPreviewCV(activeCV);
      setSaveStatus("saved");
      return true;
    } catch {
      setSaveStatus("error");
      toast.error("Failed to save.");
      return false;
    }
  }, [activeCV, isDirty]);

  function handleUpdateCV(cv: CV) {
    if (!activePresetId) return;
    setPresets((prev) =>
      prev.map((p) => (p.id === activePresetId ? { ...p, cv, updatedAt: new Date() } : p))
    );
  }

  function doSwitchPreset(presetId: string) {
    const next = presets.find((p) => p.id === presetId)?.cv;
    if (!next) return;
    setActivePresetId(presetId);
    setPreviewCV(next);
    setSaveStatus("idle");
  }

  async function doCreatePreset(args: NewPresetCreateArgs) {
    const preset =
      args.source === "duplicate"
        ? await duplicatePreset(args.fromPresetId, args.name)
        : await createPreset(args.name);
    setPresets((prev) => [...prev, preset]);
    setActivePresetId(preset.id);
    setPreviewCV(preset.cv ?? null);
    setSaveStatus("idle");
  }

  /**
   * Switches the active preset. If there are unsaved changes, shows a confirmation
   * dialog first. The preview always syncs to the saved state of the target preset.
   */
  function handleSwitchPreset(presetId: string) {
    if (isDirty) {
      setPendingAction({ type: "switch", presetId });
      return;
    }
    doSwitchPreset(presetId);
  }

  async function handleCreatePreset(args: NewPresetCreateArgs) {
    if (isDirty) {
      setPendingAction({ type: "create", args });
      return;
    }
    await doCreatePreset(args);
  }

  async function handleSaveAndContinue() {
    if (!pendingAction) return;
    const saved = await handleSave();
    if (!saved) return;
    setPendingAction(null);
    if (pendingAction.type === "switch") doSwitchPreset(pendingAction.presetId);
    else await doCreatePreset(pendingAction.args);
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
    } catch {
      toast.error("Failed to rename preset.");
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
    } catch {
      toast.error("Failed to update preset.");
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
    } catch {
      toast.error("Failed to delete preset.");
      setIsDeleting(false);
      return;
    }
    setIsDeleting(false);
    const remaining = presets.filter((p) => p.id !== activePresetId);
    setPresets(remaining);
    const next = remaining.find((p) => p.isDefault) ?? remaining[0] ?? null;
    setActivePresetId(next?.id ?? null);
    setPreviewCV(next?.cv ?? null);
    setSaveStatus("idle");
  }

  // Cmd+S / Ctrl+S shortcut
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleSave]);

  if (!activeCV || !previewCV || !activePresetId) {
    return <NoPresetsState onCreate={handleCreatePreset} />;
  }

  return (
    <>
      <div className="flex flex-1 overflow-hidden">
        <EditorPanel
          cv={activeCV}
          savedCV={previewCV}
          onUpdate={handleUpdateCV}
          presets={presets}
          activePresetId={activePresetId}
        />
        <PreviewPanel
          cv={previewCV}
          presets={presets}
          activePresetId={activePresetId}
          saveStatus={saveStatus}
          isDirty={isDirty}
          onSave={handleSave}
          onSwitchPreset={handleSwitchPreset}
          onCreatePreset={handleCreatePreset}
          onRenamePreset={handleRenamePreset}
          onToggleDefaultPreset={handleToggleDefaultPreset}
          onDeletePreset={handleDeletePreset}
          isDeleting={isDeleting}
        />
      </div>

      <UnsavedChangesDialog
        open={!!pendingAction}
        saving={saveStatus === "saving"}
        onConfirm={handleSaveAndContinue}
        onCancel={() => setPendingAction(null)}
      />
    </>
  );
}

function UnsavedChangesDialog({
  open,
  saving,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  saving: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen && saving) return;
        if (!isOpen) onCancel();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Unsaved changes</DialogTitle>
          <DialogDescription>
            You have unsaved changes. Save before switching presets?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" disabled={saving} onClick={onCancel}>
            Cancel
          </Button>
          <Button disabled={saving} onClick={onConfirm}>
            {saving ? "Saving Changes…" : "Save & Continue"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
