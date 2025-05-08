"use client";

import { PieChart, Pie, Cell as PieCell, Legend, Tooltip } from "recharts";
import { Column, Cell, TextAlignment } from "../RequirementsMatrix/types";

interface Props {
  statusColumn: Column;
}

export default function RequirementsStatusPie({ statusColumn }: Props) {
  const counts = statusColumn.cells.reduce(
    (acc: Record<string, { count: number; color: string }>, cell) => {
      const text = cell.cell_text;
      const color = cell.background_color || "#8884d8";
      if (!acc[text]) {
        acc[text] = { count: 1, color };
      } else {
        acc[text].count += 1;
      }
      return acc;
    },
    {}
  );

  const data = Object.entries(counts).map(([name, { count, color }]) => ({
    name,
    value: count,
    color,
  }));

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Статусы требований</h2>
      <PieChart width={400} height={300}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          label
          outerRadius={100}
          dataKey="value"
          nameKey="name"
        >
          {data.map((entry, index) => (
            <PieCell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
}
