"use client";

import { useState } from "react";
import { mockCV } from "@/lib/mock-data";
import type { CV } from "@/lib/schemas";
import EditorPanel from "@/components/editor/EditorPanel";
import PreviewPanel from "@/components/editor/PreviewPanel";

export default function EditorPage() {
  const [cv, setCV] = useState<CV>(mockCV);

  return (
    <div className="flex flex-1 overflow-hidden">
      <EditorPanel cv={cv} onUpdate={setCV} />
      <PreviewPanel cv={cv} />
    </div>
  );
}
