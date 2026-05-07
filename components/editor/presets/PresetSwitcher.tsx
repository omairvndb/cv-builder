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
import type { Preset } from "@/lib/schemas";
import { AsteriskSimpleIcon, CaretDownIcon } from "@phosphor-icons/react";

type PresetSwitcherProps = {
  presets: Preset[];
  activePresetId: string;
  onSwitch: (presetId: string) => void;
  onRename: (name: string) => void;
  onToggleDefault: () => void;
  onDelete: () => void;
};

export default function PresetSwitcher({
  presets,
  activePresetId,
  onSwitch,
  onRename,
  onToggleDefault,
  onDelete,
}: PresetSwitcherProps) {
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const activePreset = presets.find((p) => p.id === activePresetId);

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
            <DropdownMenuRadioGroup value={activePresetId} onValueChange={onSwitch}>
              {presets.map((preset) => (
                <DropdownMenuRadioItem key={preset.id} value={preset.id}>
                  <span className="truncate">{preset.name}</span>
                  {preset.isDefault && <AsteriskSimpleIcon weight="fill" />}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuLabel>Edit preset</DropdownMenuLabel>
            <DropdownMenuItem onSelect={startRename}>Rename</DropdownMenuItem>
            <DropdownMenuItem onSelect={onToggleDefault}>
              {activePreset?.isDefault ? "Remove as default" : "Set as default"}
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuItem
              onSelect={() => setDeleteDialogOpen(true)}
              className="text-destructive focus:text-destructive"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title={`Delete “${activePreset?.name}”?`}
        description="This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={onDelete}
      />
    </>
  );
}
