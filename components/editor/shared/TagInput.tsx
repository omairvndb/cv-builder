"use client";

import { useState } from "react";
import { PlusIcon, XIcon } from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import FormField from "./FormField";

type Props = {
  label: string;
  items: string[];
  placeholder?: string;
  onChange: (items: string[]) => void;
};

export default function TagInput({ label, items, placeholder, onChange }: Props) {
  const [inputValue, setInputValue] = useState("");

  const add = () => {
    const trimmed = inputValue.trim();
    if (!trimmed || items.includes(trimmed)) return;
    onChange([...items, trimmed]);
    setInputValue("");
  };

  const remove = (index: number) => onChange(items.filter((_, i) => i !== index));

  return (
    <FormField label={label}>
      <div className="flex gap-1.5">
        <Input
          value={inputValue}
          placeholder={placeholder}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
        />
        <Button
          variant="outline"
          size="icon"
          type="button"
          onClick={add}
          disabled={!inputValue.trim()}
        >
          <PlusIcon />
        </Button>
      </div>
      {items.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {items.map((item, i) => (
            <Badge key={i} variant="secondary">
              {item}
              <Button type="button" onClick={() => remove(i)} variant="ghost" size="icon-xs">
                <XIcon />
              </Button>
            </Badge>
          ))}
        </div>
      )}
    </FormField>
  );
}
