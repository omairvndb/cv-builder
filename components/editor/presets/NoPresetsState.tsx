"use client";

import NewPresetButton from "@/components/editor/presets/NewPresetButton";
import type { ComponentProps } from "react";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { IdentificationCardIcon } from "@phosphor-icons/react";

type NoPresetsStateProps = {
  onCreate: ComponentProps<typeof NewPresetButton>["onCreate"];
};

export default function NoPresetsState({ onCreate }: NoPresetsStateProps) {
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
          <NewPresetButton presets={[]} onCreate={onCreate} />
        </EmptyContent>
      </Empty>
    </div>
  );
}
