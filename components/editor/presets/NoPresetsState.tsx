"use client";

import NewPresetDialog, {
  type NewPresetCreateArgs,
} from "@/components/editor/presets/NewPresetDialog";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { IdentificationCardIcon, PlusIcon } from "@phosphor-icons/react";
import { useState } from "react";

type NoPresetsStateProps = {
  onCreate: (args: NewPresetCreateArgs) => void;
};

export default function NoPresetsState({ onCreate }: NoPresetsStateProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <IdentificationCardIcon />
          </EmptyMedia>
          <EmptyTitle>No presets yet</EmptyTitle>
          <EmptyDescription>Create your first preset to start building your CV.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button variant="outline" onClick={() => setDialogOpen(true)}>
            <PlusIcon />
            Create preset
          </Button>
        </EmptyContent>
      </Empty>

      <NewPresetDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        presets={[]}
        currentPresetId=""
        onCreate={onCreate}
      />
    </div>
  );
}
