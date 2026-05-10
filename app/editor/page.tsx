import { getPresets } from "@/lib/actions/presets";
import EditorClient from "./_client";

export default async function EditorPage() {
  const initialPresets = await getPresets();
  return <EditorClient initialPresets={initialPresets} />;
}
