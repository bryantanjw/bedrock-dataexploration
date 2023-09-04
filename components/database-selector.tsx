"use client";

import * as React from "react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { PopoverProps } from "@radix-ui/react-popover";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Database } from "../data/databases";

interface DatabaseSelectorProps extends PopoverProps {
  databases: Database[];
}

export function DatabaseSelector({
  databases,
  ...props
}: DatabaseSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedDatabase, setselectedDatabase] = React.useState<Database>();

  return (
    <Popover open={open} onOpenChange={setOpen} {...props}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-label="Load a database..."
          aria-expanded={open}
          className="flex-1 justify-between md:max-w-[200px] lg:max-w-[300px]"
        >
          {selectedDatabase ? selectedDatabase.name : "Select a database..."}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search databases..." />
          <CommandEmpty>No databases found.</CommandEmpty>
          {databases.map((database) => (
            <CommandGroup heading={database.service}>
              <CommandItem
                key={database.id}
                onSelect={() => {
                  setselectedDatabase(database);
                  setOpen(false);
                }}
              >
                {database.name}
                <CheckIcon
                  className={cn(
                    "ml-auto h-4 w-4",
                    selectedDatabase?.id === database.id
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
              </CommandItem>
            </CommandGroup>
          ))}
        </Command>
      </PopoverContent>
    </Popover>
  );
}
