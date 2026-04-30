import dynamic from "next/dynamic";
import type { CV } from "@/lib/schemas";
import CVDocument from "@/components/pdf/CVDocument";

const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => ({ default: mod.PDFViewer })),
  { ssr: false, loading: () => <div className="flex-1 bg-muted animate-pulse" /> }
);

export default function PreviewPanel({ cv }: { cv: CV }) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <PDFViewer width="100%" height="100%" style={{ flex: 1, border: "none" }}>
        <CVDocument cv={cv} />
      </PDFViewer>
    </div>
  );
}
