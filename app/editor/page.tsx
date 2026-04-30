"use client";

import dynamic from "next/dynamic";
import { mockCV } from "@/lib/mock-data";
import CVDocument from "@/components/pdf/CVDocument";

const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => ({ default: mod.PDFViewer })),
  { ssr: false, loading: () => <div className="flex-1 bg-muted animate-pulse" /> }
);

export default function EditorPage() {
  return (
    <div className="flex flex-col flex-1">
      <PDFViewer width="100%" height="100%" style={{ flex: 1, border: "none" }}>
        <CVDocument cv={mockCV} />
      </PDFViewer>
    </div>
  );
}
