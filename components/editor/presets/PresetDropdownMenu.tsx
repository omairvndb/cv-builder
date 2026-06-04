"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/editor/shared/ConfirmDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import type { NewPresetCreateArgs, Preset } from "@/lib/schemas";
import { AsteriskSimpleIcon, CaretDownIcon } from "@phosphor-icons/react";
import { toast } from "sonner";

type PresetDropdownMenuProps = {
  presets: Preset[];
  activePresetId: string;
  onSwitch: (presetId: string) => void;
  onCreate: (args: NewPresetCreateArgs) => Promise<void>;
  onRename: (name: string) => void;
  onToggleDefault: () => void;
  onDelete: () => void;
  isDeleting?: boolean;
};

/**
 * Builds a non-colliding "(copy)" name for a duplicate, matching the New Preset
 * flow's rule that preset names are unique. Falls back to "(copy 2)", "(copy 3)", …
 */
export function makeCopyName(base: string, presets: Preset[]) {
  const taken = new Set(presets.map((p) => p.name.toLowerCase()));
  let candidate = `${base} (copy)`;
  let n = 2;
  while (taken.has(candidate.toLowerCase())) candidate = `${base} (copy ${n++})`;
  return candidate;
}

export default function PresetDropdownMenu({
  presets,
  activePresetId,
  onSwitch,
  onCreate,
  onRename,
  onToggleDefault,
  onDelete,
  isDeleting,
}: PresetDropdownMenuProps) {
  const [isRenaming, setIsRenaming] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState(false);
  const [renameValue, setRenameValue] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [duplicateDialogOpen, setDuplicateDialogOpen] = useState(false);

  const activePreset = presets.find((p) => p.id === activePresetId);
  const copyName = makeCopyName(activePreset?.name ?? "Preset", presets);

  function startRename() {
    setRenameValue(activePreset?.name ?? "");
    setIsRenaming(true);
  }

  function commitRename() {
    setIsRenaming(false);
    const trimmed = renameValue.trim();
    if (!trimmed || trimmed === activePreset?.name) return;
    onRename(trimmed);
  }

  function cancelRename() {
    setIsRenaming(false);
  }

  async function duplicatePreset() {
    setIsDuplicating(true);
    try {
      await onCreate({ source: "duplicate", name: copyName, fromPresetId: activePresetId });
    } catch {
      toast.error("Failed to duplicate preset.");
    } finally {
      setIsDuplicating(false);
    }
  }

  if (isRenaming) {
    return (
      <Input
        autoFocus
        value={renameValue}
        onChange={(e) => setRenameValue(e.target.value)}
        onBlur={commitRename}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            commitRename();
          }
          if (e.key === "Escape") {
            e.preventDefault();
            cancelRename();
          }
        }}
        className="w-48"
      />
    );
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <span className="truncate max-w-48">{activePreset?.name}</span>
            <CaretDownIcon />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="min-w-56">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Select preset</DropdownMenuLabel>
            <div className="max-h-64 overflow-y-auto">
              <DropdownMenuRadioGroup value={activePresetId} onValueChange={onSwitch}>
                {presets.map((preset) => (
                  <DropdownMenuRadioItem key={preset.id} value={preset.id}>
                    <span className="truncate">{preset.name}</span>
                    {preset.isDefault && <AsteriskSimpleIcon weight="fill" />}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </div>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuLabel>Edit preset</DropdownMenuLabel>
            <DropdownMenuItem onSelect={startRename}>Rename</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setDuplicateDialogOpen(true)}>
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={onToggleDefault}>
              {activePreset?.isDefault ? "Remove as default" : "Set as default"}
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuItem variant="destructive" onSelect={() => setDeleteDialogOpen(true)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete confirmation dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title={`Delete “${activePreset?.name}”?`}
        description="This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={onDelete}
        loading={isDeleting}
      />

      {/* Duplicate confirmation dialog */}
      <ConfirmDialog
        open={duplicateDialogOpen}
        onOpenChange={setDuplicateDialogOpen}
        title={`Duplicate “${activePreset?.name}”?`}
        description={`A copy will be created as “${copyName}”.`}
        confirmLabel="Duplicate"
        confirmVariant="default"
        onConfirm={duplicatePreset}
        loading={isDuplicating}
      />
    </>
  );
}
