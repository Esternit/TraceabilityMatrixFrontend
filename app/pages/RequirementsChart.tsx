"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type TextAlignment = {
    vertical: "top" | "center" | "bottom";
    horizontal: "left" | "center" | "right";
  };
  
  type Icon = {
    name: "check" | "progress" | "warning";
    position: "left" | "right";
  };
  
  type Cell = {
    cell_text: string;
    background_color?: string;
    text_color?: string;
    text_alignment?: TextAlignment;
    icon?: Icon;
  };
  
  type Column = {
    column_text: string;
    background_color?: string;
    text_color?: string;
    text_alignment: TextAlignment;
    sorting?: {
      type: "alphabetical" | "numeric";
      enabled: boolean;
    };
    cells: Cell[];
  };
type Props = {
  columns: Column[];
};

const statusColors: Record<string, string> = {
  "Выполнено": "#52c41a",
  "В работе": "#faad14",
  "Не начато": "#ff4d4f",
};

export const RequirementsChart = ({ columns }: Props) => {
  const reqCol = columns[0];
  const testCasesCol = columns.find(col => col.column_text === "Связанные тест-кейсы");
  const statusCol = columns.find(col => col.column_text === "Статус трассировки");

  if (!reqCol || !testCasesCol || !statusCol) return null;

  const data = reqCol.cells.map((req, index) => {
    const tcText = testCasesCol.cells[index]?.cell_text || "";
    const count = tcText ? tcText.split(",").length : 0;
    const status = statusCol.cells[index]?.cell_text || "Неизвестно";

    return {
      name: req.cell_text,
      testCount: count,
      status,
    };
  });

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>График покрытия требований</CardTitle>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip
              formatter={(value: any, name: any, props: any) => {
                if (name === "testCount") return [`${value} тестов`, "Покрытие"];
                return value;
              }}
            />
            <Bar dataKey="testCount">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={statusColors[entry.status] || "#8884d8"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
