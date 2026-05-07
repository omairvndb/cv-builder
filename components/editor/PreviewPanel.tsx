"use client";

import dynamic from "next/dynamic";
import type { NewPresetCreateArgs } from "@/components/editor/presets/NewPresetDialog";
import type { CV, Preset } from "@/lib/schemas";

type PreviewPanelClientProps = {
  cv: CV;
  presets: Preset[];
  activePresetId: string;
  onSwitchPreset: (presetId: string) => void;
  onCreatePreset: (args: NewPresetCreateArgs) => void;
  onRenamePreset: (name: string) => void;
  onToggleDefaultPreset: () => void;
  onDeletePreset: () => void;
};

// making sure to skip SSR for React-PDF module as noted in React-PDF documentation
const PreviewPanelClient = dynamic<PreviewPanelClientProps>(
  () => import("@/components/editor/PreviewPanelClient").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => <div className="flex-1 bg-muted animate-pulse" />,
  }
);

export default function PreviewPanel(props: PreviewPanelClientProps) {
  return <PreviewPanelClient {...props} />;
}
