// components/MultiSelect.tsx

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
  import { Checkbox } from "@/components/ui/checkbox"
  import { Button } from "@/components/ui/button"
  import { Check, ChevronDown } from "lucide-react"
  import { useEffect, useRef, useState } from "react"
  import { cn } from "@/lib/utils"
  
  interface MultiSelectProps {
    options: { label: string; value: string }[]
    selected: string[]
    onChange: (values: string[]) => void
    placeholder?: string
  }
  
  export function MultiSelect({
    options,
    selected,
    onChange,
    placeholder = "Выберите значения",
  }: MultiSelectProps) {
    const toggleOption = (value: string) => {
      if (selected.includes(value)) {
        onChange(selected.filter((v) => v !== value))
      } else {
        onChange([...selected, value])
      }
    }
  
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" className="w-full justify-between">
            {selected.length > 0
              ? options
                  .filter((opt) => selected.includes(opt.value))
                  .map((opt) => opt.label)
                  .join(", ")
              : placeholder}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full max-h-64 overflow-y-auto p-2">
          {options.map((option) => (
            <div
              key={option.value}
              className="flex items-center gap-2 px-2 py-1 cursor-pointer rounded hover:bg-muted"
              onClick={() => toggleOption(option.value)}
            >
              <Checkbox
                checked={selected.includes(option.value)}
                onCheckedChange={() => toggleOption(option.value)}
                id={option.value}
              />
              <label
                htmlFor={option.value}
                className="text-sm cursor-pointer"
              >
                {option.label}
              </label>
            </div>
          ))}
        </PopoverContent>
      </Popover>
    )
  }
  