"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { sortByOrder } from "@/lib/cv-helpers";
import { FRIENDLY_TYPE, summarizeItem } from "@/lib/item-summary";
import type { Preset, SectionItemData, SectionType } from "@/lib/schemas";

type TabValue = "fill" | "copy";

type CopyConfig = {
  presets: Preset[];
  currentPresetId: string;
  sectionType: SectionType;
  onCopy: (datas: SectionItemData[]) => void;
};

type Props = {
  title: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  children: React.ReactNode;
  copy: CopyConfig;
};

type CopyItemsTabProps = {
  presets: Preset[];
  currentPresetId: string;
  sectionType: SectionType;
  selectedDatas: SectionItemData[];
  onSelectionChange: (next: SectionItemData[]) => void;
};

export default function AddItemDialog({
  title,
  open,
  onOpenChange,
  onConfirm,
  children,
  copy,
}: Props) {
  const [tab, setTab] = useState<TabValue>("fill");
  const [selectedDatas, setSelectedDatas] = useState<SectionItemData[]>([]);

  const isCopyTab = tab === "copy";
  const confirmDisabled = isCopyTab && selectedDatas.length === 0;
  const confirmLabel = isCopyTab ? `Copy selected (${selectedDatas.length})` : "Add item";

  function handleOpenChange(isOpen: boolean) {
    if (!isOpen) {
      setTab("fill");
      setSelectedDatas([]);
    }
    onOpenChange(isOpen);
  }

  function handleConfirm() {
    if (isCopyTab) {
      copy.onCopy(selectedDatas);
    } else {
      onConfirm();
    }
    handleOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        aria-describedby={undefined}
        className="flex flex-col sm:max-w-lg max-h-[85vh] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <Tabs value={tab} onValueChange={(value) => setTab(value as TabValue)}>
          <TabsList className="w-full">
            <TabsTrigger value="fill">Blank</TabsTrigger>
            <TabsTrigger value="copy">Copy from presets</TabsTrigger>
          </TabsList>
          <TabsContent value="fill">
            <div className="flex flex-col gap-3">{children}</div>
          </TabsContent>
          <TabsContent value="copy">
            <CopyItemsTab
              presets={copy.presets}
              currentPresetId={copy.currentPresetId}
              sectionType={copy.sectionType}
              selectedDatas={selectedDatas}
              onSelectionChange={setSelectedDatas}
            />
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={confirmDisabled}>
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CopyItemsTab({
  presets,
  currentPresetId,
  sectionType,
  selectedDatas,
  onSelectionChange,
}: CopyItemsTabProps) {
  const otherPresets = presets.filter((p) => p.id !== currentPresetId && p.cv);
  const [pickedPresetId, setPickedPresetId] = useState<string>(() => otherPresets[0]?.id ?? "");

  const pickedPreset = otherPresets.find((p) => p.id === pickedPresetId);
  const items = sortByOrder(
    pickedPreset?.cv?.sections.filter((s) => s.type === sectionType).flatMap((s) => s.items) ?? []
  );

  const friendly = FRIENDLY_TYPE[sectionType];

  function handlePickPreset(id: string) {
    setPickedPresetId(id);
    onSelectionChange([]);
  }

  function toggle(data: SectionItemData, checked: boolean) {
    onSelectionChange(checked ? [...selectedDatas, data] : selectedDatas.filter((d) => d !== data));
  }

  if (otherPresets.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No other presets to copy from. Create another preset first.
      </p>
    );
  }

  return (
    <div className="grid gap-3">
      <div className="grid gap-2">
        <Label htmlFor="copy-source-preset">Source preset</Label>
        <Select value={pickedPresetId} onValueChange={handlePickPreset}>
          <SelectTrigger id="copy-source-preset" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[...otherPresets]
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((preset) => (
                <SelectItem key={preset.id} value={preset.id}>
                  {preset.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">This preset has no {friendly} items.</p>
      ) : (
        <ItemGroup className="max-h-72 overflow-y-auto">
          {items.map((item) => {
            const summary = summarizeItem(sectionType, item.data);
            const checked = selectedDatas.includes(item.data);
            const id = `copy-item-${item.id}`;
            return (
              <Item
                key={item.id}
                asChild
                size="xs"
                variant="muted"
                className="hover:bg-accent select-none"
              >
                <label htmlFor={id}>
                  <ItemContent>
                    <ItemTitle>{summary.primary}</ItemTitle>
                    {summary.secondary && <ItemDescription>{summary.secondary}</ItemDescription>}
                  </ItemContent>

                  <ItemActions>
                    <Checkbox
                      id={id}
                      checked={checked}
                      onCheckedChange={(value) => toggle(item.data, value === true)}
                    />
                  </ItemActions>
                </label>
              </Item>
            );
          })}
        </ItemGroup>
      )}
    </div>
  );
}
