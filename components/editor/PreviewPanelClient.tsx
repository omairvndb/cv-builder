"use client";

import CVDocument from "@/components/pdf/CVDocument";
import { Button } from "@/components/ui/button";
import type { CV } from "@/lib/schemas";
import { DownloadSimpleIcon, MinusIcon, PlusIcon } from "@phosphor-icons/react";
import { usePDF } from "@react-pdf/renderer";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

// PDF.js default worker config (must be set in the same module where you use React-PDF components)
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

// Zoom configuration
const MIN_SCALE = 0.6;
const MAX_SCALE = 1.6;
const SCALE_STEP = 0.1;

type ScrollAnchor = {
  pageIndex: number;
  offset: number;
  scrollTop: number;
};

export default function PreviewPanelClient({ cv }: { cv: CV }) {
  // These states rerender the cv preview when they change
  const [scale, setScale] = useState(1);
  const [numPages, setNumPages] = useState(0);

  // These refs track and update values across renders without rerendering the cv preview
  /** Ref to the scroll container DOM element. */
  const containerRef = useRef<HTMLDivElement | null>(null);
  /** Ref to the list of each page’s DOM element. */
  const pageRefs = useRef<Array<HTMLDivElement | null>>([]);
  /** Ref to the saved “scroll anchor” (which page and how far down). */
  const anchorRef = useRef<ScrollAnchor | null>(null);
  /** Ref to the number of pages that have finished rendering. */
  const renderedPagesRef = useRef(0);

  /** Ref to the PDF document element. */
  const documentElement = useMemo(() => <CVDocument cv={cv} />, [cv]);
  const [instance, updateInstance] = usePDF({ document: documentElement });

  /** Capture the visible page and offset so we can restore scroll after rerender. */
  const captureAnchor = useCallback(() => {
    const container = containerRef.current;
    const pages = pageRefs.current;
    if (!container || pages.length === 0) return;

    const scrollTop = container.scrollTop;
    let pageIndex = 0;
    let offset = scrollTop;

    for (let i = 0; i < pages.length; i += 1) {
      const page = pages[i];
      if (!page) continue;
      const top = page.offsetTop;
      const bottom = top + page.offsetHeight;
      if (scrollTop >= top && scrollTop < bottom) {
        pageIndex = i;
        offset = scrollTop - top;
        break;
      }
    }

    anchorRef.current = { pageIndex, offset, scrollTop };
  }, []);

  /** Restore scroll position based on the previously captured anchor. */
  const restoreAnchor = useCallback(() => {
    const anchor = anchorRef.current;
    const container = containerRef.current;
    if (!anchor || !container) return;

    const maxIndex = Math.max(pageRefs.current.length - 1, 0);
    const targetIndex = Math.min(anchor.pageIndex, maxIndex);
    const page = pageRefs.current[targetIndex];

    if (page) {
      container.scrollTop = page.offsetTop + anchor.offset;
    } else {
      container.scrollTop = anchor.scrollTop;
    }
  }, []);

  /**
   * Reset the page render counter so we can detect when the new PDF has fully rendered.
   * This prevents stale counts from a previous render from triggering an early restore.
   * This is called before regenerating the PDF or changing zoom.
   */
  const resetRenderProgress = useCallback(() => {
    renderedPagesRef.current = 0;
  }, []);

  // Runs on mount and when cv data changes.
  // Captures the current scroll anchor, resets render progress, and triggers PDF regeneration.
  useEffect(() => {
    captureAnchor();
    resetRenderProgress();
    updateInstance(documentElement);
  }, [captureAnchor, documentElement, resetRenderProgress, updateInstance]);

  function handleDocumentLoad({ numPages: totalPages }: { numPages: number }) {
    setNumPages(totalPages);
    pageRefs.current = new Array(totalPages).fill(null);
  }

  /** Runs when a page finishes rendering. It restores scroll once all pages are rendered. */
  function handlePageRender() {
    if (numPages === 0) return;
    renderedPagesRef.current = Math.min(renderedPagesRef.current + 1, numPages);
    if (renderedPagesRef.current === numPages) {
      restoreAnchor();
    }
  }

  function updateScale(nextScale: number) {
    captureAnchor();
    resetRenderProgress();
    setScale(nextScale);
  }

  function handleDownload() {
    if (!instance.url) return;

    const link = document.createElement("a");
    link.href = instance.url;
    link.download = "cv.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function handleZoomOut() {
    updateScale(Math.max(MIN_SCALE, Number((scale - SCALE_STEP).toFixed(2))));
  }

  function handleZoomIn() {
    updateScale(Math.min(MAX_SCALE, Number((scale + SCALE_STEP).toFixed(2))));
  }

  function handleZoomReset() {
    updateScale(1);
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header with download + zoom controls */}
      <div className="flex items-center justify-between gap-2 border-b p-3">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleZoomOut}
            disabled={scale <= MIN_SCALE}
            aria-label="Zoom out preview"
          >
            <MinusIcon />
          </Button>
          <div className="min-w-12 text-center text-xs">{Math.round(scale * 100)}%</div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleZoomIn}
            disabled={scale >= MAX_SCALE}
            aria-label="Zoom in preview"
          >
            <PlusIcon />
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleZoomReset}
            aria-label="Reset preview zoom"
          >
            Reset
          </Button>
        </div>

        <Button
          type="button"
          size="icon"
          className="cursor-pointer"
          onClick={handleDownload}
          disabled={!instance.url}
          aria-label="Download PDF"
        >
          <DownloadSimpleIcon />
        </Button>
      </div>

      {/* PDF container */}
      <div ref={containerRef} className="relative flex-1 overflow-auto bg-muted">
        {/* Error state */}
        {instance.error ? (
          <div className="flex h-full w-full items-center justify-center text-xs text-destructive">
            Preview failed to render.
          </div>
        ) : null}

        {/* PDF (pages) */}
        {instance.url ? (
          <div className="mx-auto flex w-fit flex-col gap-3 py-6">
            <Document file={instance.url} onLoadSuccess={handleDocumentLoad} loading={null}>
              {Array.from({ length: numPages }, (_, index) => (
                <div
                  key={`page-${index + 1}`}
                  ref={(node) => {
                    pageRefs.current[index] = node;
                  }}
                >
                  <Page
                    pageNumber={index + 1}
                    scale={scale}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    onRenderSuccess={handlePageRender}
                  />
                </div>
              ))}
            </Document>
          </div>
        ) : null}

        {/* Loading state (covers both initial load and updates) */}
        {instance.loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-background/60 text-xs text-muted-foreground">
            Updating preview...
          </div>
        ) : null}
      </div>
    </div>
  );
}
