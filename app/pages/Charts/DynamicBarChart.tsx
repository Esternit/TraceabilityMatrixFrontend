"use client";

import { useMemo, useState } from "react";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Legend } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { TrendingUp } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Column, Cell, TextAlignment } from "../RequirementsMatrix/types";

const PRIORITY_MAP: Record<string, number> = {
  Низкий: 1,
  Средний: 2,
  Высокий: 3,
};
interface Props {
  columns: Column[];
}

export function DynamicBarChart({ columns }: Props) {
  const [xColumnText, setXColumnText] = useState(columns[0]?.column_text);
  const [yColumnText, setYColumnText] = useState(columns[1]?.column_text);

  const xColumn = columns.find((c) => c.column_text === xColumnText);
  const yColumn = columns.find((c) => c.column_text === yColumnText);

  const chartData = useMemo(() => {
    if (!xColumn || !yColumn) return [];

    const length = Math.min(xColumn.cells.length, yColumn.cells.length);
    const grouped: Record<string, number> = {};

    for (let i = 0; i < length; i++) {
      const xVal = xColumn.cells[i].cell_text || "N/A";
      const rawY = yColumn.cells[i].cell_text || "";

      if (!grouped[xVal]) grouped[xVal] = 0;

      if (yColumn.column_text.toLowerCase().includes("приоритет")) {
        const priority = PRIORITY_MAP[rawY] || 0;
        grouped[xVal] += priority;
      } else if (yColumn.column_text.toLowerCase().includes("зависимост")) {
        if (rawY.toLowerCase() === "нет") {
          grouped[xVal] += 1;
        } else {
          grouped[xVal] += rawY.split(",").length;
        }
      } else {
        grouped[xVal] += 1;
      }
    }

    return Object.entries(grouped).map(([group, value]) => ({
      group,
      value,
    }));
  }, [xColumn, yColumn]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bar Chart по категориям</CardTitle>
        <CardDescription>
          Группировка: {xColumnText} | Категория: {yColumnText}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-4">
          <Select value={xColumnText} onValueChange={setXColumnText}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="X-группировка" />
            </SelectTrigger>
            <SelectContent>
              {columns.map((col) => (
                <SelectItem key={col.column_text} value={col.column_text}>
                  {col.column_text}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={yColumnText} onValueChange={setYColumnText}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Y-категория" />
            </SelectTrigger>
            <SelectContent>
              {columns.map((col) => (
                <SelectItem key={col.column_text} value={col.column_text}>
                  {col.column_text}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <ChartContainer
          config={{ value: { label: "Значение", color: "#3498db" } }}
        >
          <BarChart width={700} height={400} data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="group" />
            <YAxis allowDecimals={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="value" fill="#3498db" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Частота/вес категории по группам <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Если выбрана колонка Приоритет, высота = сумма приоритетов (1–3).
        </div>
      </CardFooter>
    </Card>
  );
}
