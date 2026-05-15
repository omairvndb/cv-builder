import { DotsSixVerticalIcon, XIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardAction } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import ConfirmDialog from "./ConfirmDialog";

type HandleRef = (element: Element | null) => void;

export default function ItemBlock({
  onRemove,
  isDirty,
  handleRef,
  children,
}: {
  onRemove: () => void;
  isDirty?: boolean;
  handleRef?: HandleRef;
  children: React.ReactNode;
}) {
  return (
    <Card size="sm" className="border ring-0">
      <CardHeader>
        <div className="flex items-center gap-2">
          {/* Drag handle */}
          {handleRef && (
            <Button
              ref={handleRef}
              type="button"
              variant="ghost"
              size="icon-xs"
              aria-label="Drag to reorder"
              className={cn("touch-none cursor-grab active:cursor-grabbing")}
            >
              <DotsSixVerticalIcon weight="bold" />
            </Button>
          )}

          {/* Edited (dot) indicator */}
          {isDirty && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
        </div>

        {/* Remove button */}
        <CardAction>
          <ConfirmDialog
            trigger={
              <Button size="icon-xs">
                <XIcon />
              </Button>
            }
            title="Remove item?"
            onConfirm={onRemove}
            confirmLabel="Remove"
            description="This action cannot be undone."
          />
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-col gap-3">{children}</CardContent>
    </Card>
  );
}
