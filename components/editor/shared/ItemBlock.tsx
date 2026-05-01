import { XIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

export default function ItemBlock({
  onRemove,
  children,
}: {
  onRemove: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col gap-3 border py-5 px-3">
      <Button
        variant="outline"
        size="icon-xs"
        className="absolute top-1.5 right-1.5"
        onClick={onRemove}
      >
        <XIcon />
      </Button>
      {children}
    </div>
  );
}
