"use client";

import { useEffect, useState } from "react";
import { mockCV } from "@/lib/mock-data";
import type { CV } from "@/lib/schemas";
import EditorPanel from "@/components/editor/EditorPanel";
import PreviewPanel from "@/components/editor/PreviewPanel";

export default function EditorPage() {
  const [cv, setCV] = useState<CV>(mockCV);
  const [previewCV, setPreviewCV] = useState<CV>(mockCV);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setPreviewCV(cv);
    }, 800);

    return () => window.clearTimeout(timeoutId);
  }, [cv]);

  return (
    <div className="flex flex-1 overflow-hidden">
      <EditorPanel cv={cv} onUpdate={setCV} />
      <PreviewPanel cv={previewCV} />
    </div>
  );
}
