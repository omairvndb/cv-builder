import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export type ConfirmDialogProps = {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmLabel: string;
  confirmVariant?: React.ComponentProps<typeof AlertDialogAction>["variant"];
  loading?: boolean;
};

export default function ConfirmDialog({
  trigger,
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  confirmLabel,
  confirmVariant = "destructive",
  loading,
}: ConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {trigger && <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && <AlertDialogDescription>{description}</AlertDialogDescription>}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant={confirmVariant}
            disabled={loading}
            onClick={(e) => {
              if (loading) {
                e.preventDefault();
                return;
              }
              onConfirm();
            }}
          >
            {loading ? `${confirmLabel}…` : confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
