"use client";

import { UseFormReturn } from "react-hook-form";
import * as z from "zod";
import * as React from "react";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useSliderChange } from "@/hooks/use-slider-change";
import { formSchema } from "@/lib/form-schema";

interface MaxLengthSelectorProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

export function MaxLengthSelector({ form }: MaxLengthSelectorProps) {
  const { value, handleSliderChange } = useSliderChange(form, "maxlength");
  return (
    <div className="grid gap-2 pt-2">
      <HoverCard openDelay={200}>
        <HoverCardTrigger asChild>
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="maxlength">Maximum Length</Label>
              <span className="w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm text-muted-foreground hover:border-border">
                {value}
              </span>
            </div>
            <Slider
              id="maxlength"
              max={2048}
              defaultValue={[value]}
              step={10}
              onValueChange={handleSliderChange}
              className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
              aria-label="Maximum Length"
            />
          </div>
        </HoverCardTrigger>
        <HoverCardContent
          align="start"
          className="w-[260px] text-sm"
          side="left"
        >
          The maximum number of tokens to generate. Requests can use up to 2,048
          or 4,000 tokens, shared between prompt and completion. The exact limit
          varies by model.
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}
