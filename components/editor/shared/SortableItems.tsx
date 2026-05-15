"use client";

import { cn } from "@/lib/utils";
import { move } from "@dnd-kit/helpers";
import { DragDropProvider, type DragEndEvent } from "@dnd-kit/react";
import { useSortable } from "@dnd-kit/react/sortable";

type HandleRef = (element: Element | null) => void;

type SortableItemsProps<T extends { id: string }> = {
  items: T[];
  onReorder: (orderedIds: string[]) => void;
  children: (item: T, handleRef: HandleRef) => React.ReactNode;
};

export default function SortableItems<T extends { id: string }>({
  items,
  onReorder,
  children,
}: SortableItemsProps<T>) {
  const ids = items.map((i) => i.id);

  function handleDragEnd(event: DragEndEvent) {
    const reordered = move(ids, event);
    if (reordered !== ids) onReorder(reordered);
  }

  return (
    <DragDropProvider onDragEnd={handleDragEnd}>
      {items.map((item, index) => (
        <SortableRow key={item.id} id={item.id} index={index}>
          {(handleRef) => children(item, handleRef)}
        </SortableRow>
      ))}
    </DragDropProvider>
  );
}

function SortableRow({
  id,
  index,
  children,
}: {
  id: string;
  index: number;
  children: (handleRef: HandleRef) => React.ReactNode;
}) {
  const { ref, handleRef, isDragSource } = useSortable({ id, index });
  return (
    <div ref={ref} className={cn(isDragSource && "opacity-50")}>
      {children(handleRef)}
    </div>
  );
}
