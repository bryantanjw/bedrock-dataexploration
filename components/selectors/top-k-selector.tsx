"use client";

import * as React from "react";
import * as z from "zod";
import { UseFormReturn } from "react-hook-form";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useSliderChange } from "@/hooks/use-slider-change";
import { formSchema } from "@/lib/form-schema";

interface TopKSelectorProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

export function TopKSelector({ form }: TopKSelectorProps) {
  const { value, handleSliderChange } = useSliderChange(form, "top_k");
  return (
    <div className="grid gap-2 pt-2">
      <HoverCard openDelay={200}>
        <HoverCardTrigger asChild>
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="top-p">Top K</Label>
              <span className="w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm text-muted-foreground hover:border-border">
                {value}
              </span>
            </div>
            <Slider
              id="top-k"
              max={500}
              defaultValue={[value]}
              step={10}
              onValueChange={handleSliderChange}
              className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
              aria-label="Top K"
            />
          </div>
        </HoverCardTrigger>
        <HoverCardContent
          align="start"
          className="w-[260px] text-sm"
          side="left"
        >
          Control diversity via top-k sampling: selecting k means only the top k
          most likely options are considered.
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}
