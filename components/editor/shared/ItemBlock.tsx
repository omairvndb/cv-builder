import { XIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardAction } from "@/components/ui/card";
import ConfirmDialog from "./ConfirmDialog";

export default function ItemBlock({
  onRemove,
  isDirty,
  children,
}: {
  onRemove: () => void;
  isDirty?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Card size="sm" className="border ring-0">
      <CardHeader>
        {isDirty && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
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
