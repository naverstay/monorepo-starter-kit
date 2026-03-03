"use client";

import * as React from "react";
import {ChevronsUpDown} from "lucide-react";

import {cn} from "@/lib/utils";
import {Button} from "@/shadcn/ui/button";
import {Popover, PopoverContent, PopoverTrigger,} from "@/shadcn/ui/popover";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,} from "@/shadcn/ui/command";
import {Checkbox} from "@/shadcn/ui/checkbox";

export type MultiSelectOption = {
  label: string;
  value: string;
};

type MultiSelectProps = {
  options: MultiSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
};

export function MultiSelect({
                              options,
                              value,
                              onChange,
                              placeholder = "Выберите...",
                              className,
                            }: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const toggleValue = (val: string) => {
    if (value.includes(val)) {
      onChange(value.filter((v) => v !== val));
    } else {
      onChange([...value, val]);
    }
  };

  const selectedLabels = options
    .filter((opt) => value.includes(opt.value))
    .map((opt) => opt.label);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn(
            "w-full justify-between",
            !selectedLabels.length && "text-muted-foreground",
            className
          )}
        >
          {selectedLabels.length
            ? selectedLabels.join(", ")
            : placeholder}

          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50"/>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Поиск..."/>
          <CommandList>
            <CommandEmpty>Ничего не найдено.</CommandEmpty>

            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => toggleValue(option.value)}
                >
                  <Checkbox
                    checked={value.includes(option.value)}
                    className="mr-2"
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
