import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; 
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, ChevronUp, Filter, X } from "lucide-react";
import { useState, useEffect } from "react";

type FilterType = "none" | "contains" | "equals" | "not-equals" | "greater" | "less" | "greater-equal" | "less-equal" | "between" | "color-fill";

interface Props {
  uniqueValues: string[];
  activeSort: string | null;
  onSortAsc: () => void;
  onSortDesc: () => void;
  onClearSort: () => void;
  onFilterChange: (selectedValues: string[]) => void;
  columns: Column;
}

interface Column {
    background_color?: string;
  cells: { cell_text: string, background_color?: string }[];
}

export const ColumnFilter = ({
  uniqueValues,
  activeSort,
  onSortAsc,
  onSortDesc,
  onClearSort,
  onFilterChange,
  columns,
}: Props) => {
  const [selectedValues, setSelectedValues] = useState<string[]>(uniqueValues);
  const [displayedValues, setDisplayedValues] = useState<string[]>(uniqueValues);
  const [filterType, setFilterType] = useState<FilterType>("none");
  const [filterValue, setFilterValue] = useState<string>("");
  const [filterRange, setFilterRange] = useState<{ from: string; to: string }>({ from: "", to: "" });
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const toggleValue = (value: string) => {
    const newSelected = selectedValues.includes(value)
        ? selectedValues.filter((v) => v !== value)
        : [...selectedValues, value];
    onFilterChange(newSelected);
    setSelectedValues(newSelected);
  };

  useEffect(() => {
    setDisplayedValues(uniqueValues);
    setSelectedValues(uniqueValues);
  }, [uniqueValues]); 

  const applyAdvancedFilter = () => {
    let filtered = [...uniqueValues];

    if (filterType === "contains") {
      filtered = uniqueValues.filter((val) => val.includes(filterValue));
    } else if (filterType === "equals") {
      filtered = uniqueValues.filter((val) => val === filterValue);
    } else if (filterType === "not-equals") {
      filtered = uniqueValues.filter((val) => val !== filterValue);
    } else if (filterType === "greater") {
      filtered = uniqueValues.filter((val) => val > filterValue);
    } else if (filterType === "less") {
      filtered = uniqueValues.filter((val) => val < filterValue);
    } else if (filterType === "greater-equal") {
      filtered = uniqueValues.filter((val) => val >= filterValue);
    } else if (filterType === "less-equal") {
      filtered = uniqueValues.filter((val) => val <= filterValue);
    } else if (filterType === "between") {
      filtered = uniqueValues.filter((val) => val >= filterRange.from && val <= filterRange.to);
    } else if (filterType === "color-fill" && selectedColor) {
      filtered = uniqueValues.filter((val) => {
        return columns.cells.some((cell) => cell.cell_text === val && cell.background_color === selectedColor);
      });
    }

    setDisplayedValues(filtered);
    setSelectedValues(filtered);
    onFilterChange(filtered);
  };

  const resetFilter = () => {
    setDisplayedValues(uniqueValues);
    setSelectedValues(uniqueValues);
    setFilterValue("");
    setFilterRange({ from: "", to: "" });
    setFilterType("none");
    setSelectedColor(null); 
    onClearSort();
  };

  const uniqueColors = Array.from(new Set(columns.cells.map((col) => col.background_color))).filter(Boolean);

  return (
    <div className="flex items-center gap-1">
      {activeSort && (
        <div className="flex-shrink-0">
          {activeSort === "asc" ? (
            <ChevronUp className="h-4 w-4 text-white/70" />
          ) : (
            <ChevronDown className="h-4 w-4 text-white/70" />
          )}
        </div>
      )}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="text-white/70">
            <Filter className="h-4 w-4" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-80 p-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <Button
                  variant={activeSort === "asc" ? "default" : "outline"}
                  size="sm"
                  className="flex-1 flex items-center justify-center gap-2"
                  onClick={() => activeSort === "asc" ? onClearSort() : onSortAsc()}
                >
                  <ChevronUp className="h-4 w-4" /> Возрастание
                </Button>
                <Button
                  variant={activeSort === "desc" ? "default" : "outline"}
                  size="sm"
                  className="flex-1 flex items-center justify-center gap-2"
                  onClick={() => activeSort === "desc" ? onClearSort() : onSortDesc()}
                >
                  <ChevronDown className="h-4 w-4" /> Убывание
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as FilterType)}
                className="border rounded p-2 text-sm"
              >
                <option value="none">Без фильтра</option>
                <option value="contains">Содержит</option>
                <option value="equals">Равно</option>
                <option value="not-equals">Не равно</option>
                <option value="greater">Больше</option>
                <option value="less">Меньше</option>
                <option value="greater-equal">Больше или равно</option>
                <option value="less-equal">Меньше или равно</option>
                <option value="between">Между</option>
                <option value="color-fill">По цвету</option>
              </select>

              {filterType === "color-fill" && (
                <div className="mt-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="w-full">
                        {selectedColor ? `Выбран цвет: ${selectedColor}` : "Выберите цвет"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <div className="flex flex-wrap gap-2">
                        {uniqueColors.map((color, index) => (
                          <Button
                            key={index}
                            style={{ backgroundColor: color }}
                            className="w-8 h-8 rounded-full"
                            onClick={() => setSelectedColor(color || "")}
                          />
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              )}

              {filterType !== "none" && filterType !== "between" && filterType !== "color-fill" && (
                <Input
                  placeholder="Введите значение..."
                  value={filterValue}
                  onChange={(e) => setFilterValue(e.target.value)}
                  className="text-sm"
                />
              )}

              {filterType === "between" && (
                <div className="flex gap-2">
                  <Input
                    placeholder="От"
                    value={filterRange.from}
                    onChange={(e) => setFilterRange((prev) => ({ ...prev, from: e.target.value }))}
                    className="text-sm"
                  />
                  <Input
                    placeholder="До"
                    value={filterRange.to}
                    onChange={(e) => setFilterRange((prev) => ({ ...prev, to: e.target.value }))}
                    className="text-sm"
                  />
                </div>
              )}

              {filterType !== "none" && (
                <div className="flex gap-2">
                  <Button variant="default" size="sm" className="flex-1" onClick={applyAdvancedFilter}>
                    Применить
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1" onClick={resetFilter}>
                    Сбросить
                  </Button>
                </div>
              )}
            </div>

            <div className="max-h-60 overflow-y-auto flex flex-col gap-2">
              {displayedValues.map((value, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Checkbox
                    checked={selectedValues.includes(value)}
                    onCheckedChange={() => toggleValue(value)}
                    id={`filter-${index}`}
                  />
                  <label htmlFor={`filter-${index}`} className="text-sm break-words">
                    {value || "(пусто)"}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};