import { useCallback, useRef, useState } from "react";
import { saveCV } from "@/lib/actions/cv";
import type { CV } from "@/lib/schemas";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

/**
 * Debounced auto-save hook. Returns a `save` function to call whenever the CV changes,
 * and a `status` value reflecting the current save state.
 *
 * Calling `save` cancels any pending save and schedules a new one after `delay` ms,
 * so rapid edits collapse into a single server call. Once the delay expires, it sets
 * status to `"saving"`, calls the `saveCV` server action, then resolves to `"saved"`
 * or `"error"`.
 *
 * The timeout ID is held in a ref so it persists across renders without causing them.
 */
export function useAutoSave(delay = 1000) {
  const [status, setStatus] = useState<SaveStatus>("idle");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const save = useCallback(
    (cv: CV) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(async () => {
        setStatus("saving");
        try {
          await saveCV(cv);
          setStatus("saved");
        } catch {
          setStatus("error");
        }
      }, delay);
    },
    [delay]
  );

  return { status, save };
}
