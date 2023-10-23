"use client";

import { UseFormReturn } from "react-hook-form";
import * as React from "react";
import * as z from "zod";
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

import { Database, databases } from "../../data/databases";
import { formSchema } from "@/lib/form-schema";

interface DatabaseSelectorProps extends PopoverProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

export function DatabaseSelector({ form, ...props }: DatabaseSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedDatabase, setselectedDatabase] = React.useState<Database>();

  const handleDatabaseSelect = (database: Database) => {
    setselectedDatabase(database);
    form.setValue("database", database.id);
    setOpen(false);
  };

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
          {databases.map((database, index) => (
            <CommandGroup key={index} heading={database.service}>
              <CommandItem
                key={database.name}
                onSelect={() => handleDatabaseSelect(database)}
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
