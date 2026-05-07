"use client";

import dynamic from "next/dynamic";
import type { PreviewPanelClientProps } from "@/components/editor/PreviewPanelClient";

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
