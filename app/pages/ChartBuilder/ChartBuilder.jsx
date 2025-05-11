"use client";

import { useEffect, useState } from "react";
import { mockData } from "@/app/data/requirements-matrix-mock";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";

const ChartBuilder = () => {
  const [chartType, setChartType] = useState("bar");
  const [xAxis, setXAxis] = useState(null);
  const [yAxis, setYAxis] = useState(null);
  const [filter, setFilter] = useState(null);
  const [colorField, setColorField] = useState(null);

  const availableColumns = mockData.map((column) => ({
    id: column.column_text,
    name: column.column_text,
  }));

  const chartTypes = [
    { id: "bar", name: "Bar Chart" },
    { id: "line", name: "Line Chart" },
    { id: "pie", name: "Pie Chart" },
    { id: "scatter", name: "Scatter Plot" },
  ];

  const handleDragStart = (e, column) => {
    e.dataTransfer.setData("column", JSON.stringify(column));
  };

  const handleDrop = (e, target) => {
    e.preventDefault();
    const column = JSON.parse(e.dataTransfer.getData("column"));

    switch (target) {
      case "x":
        setXAxis(column);
        break;
      case "y":
        setYAxis(column);
        break;
      case "filter":
        setFilter(column);
        break;
      case "color":
        setColorField(column);
        break;
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleRemove = (target) => {
    switch (target) {
      case "x":
        setXAxis(null);
        break;
      case "y":
        setYAxis(null);
        break;
      case "filter":
        setFilter(null);
        break;
      case "color":
        setColorField(null);
        break;
    }
  };

  const isNumeric = (str) => {
    return !isNaN(str) && !isNaN(parseFloat(str));
  };

  const getChartData = () => {
    if (!xAxis || !yAxis) return [];

    const xColumn = mockData.find((col) => col.column_text === xAxis.name);
    const yColumn = mockData.find((col) => col.column_text === yAxis.name);
    const colorColumn = colorField
      ? mockData.find((col) => col.column_text === colorField.name)
      : null;

    if (!xColumn || !yColumn) return [];

    const isYNumeric = yColumn.cells.every((cell) => isNumeric(cell.cell_text));

    if (isYNumeric) {
      return xColumn.cells.map((cell, index) => {
        const colorValue = colorColumn
          ? colorColumn.cells[index]?.cell_text
          : undefined;
        return {
          name: cell.cell_text,
          value: parseFloat(yColumn.cells[index]?.cell_text) || 0,
          originalValue: yColumn.cells[index]?.cell_text || "",
          color: colorValue,
        };
      });
    } else {
      const valueCounts = {};
      const valueDetails = {};
      const valueColors = {};

      xColumn.cells.forEach((cell, index) => {
        const yValue = yColumn.cells[index]?.cell_text || "";
        const colorValue = colorColumn
          ? colorColumn.cells[index]?.cell_text
          : undefined;

        valueCounts[yValue] = (valueCounts[yValue] || 0) + 1;

        if (!valueDetails[yValue]) {
          valueDetails[yValue] = [];
        }
        valueDetails[yValue].push({
          x: cell.cell_text,
          y: yValue,
          color: colorValue,
        });

        if (colorValue) {
          valueColors[yValue] = colorValue;
        }
      });

      const grouped = {};

      xColumn.cells.forEach((cell, index) => {
        const xValue = cell.cell_text;
        const rawY = yColumn.cells[index]?.cell_text || "";
        const colorValue = colorColumn
          ? colorColumn.cells[index]?.cell_text
          : undefined;

        const yValues = rawY
          .split(",")
          .map((v) => v.trim())
          .filter((v) => v.length > 0);

        if (!grouped[xValue]) {
          grouped[xValue] = {
            id: xValue,
            name: xValue,
            ySet: new Set(),
            details: [],
            color: colorValue,
          };
        }

        yValues.forEach((yValue) => {
          grouped[xValue].ySet.add(yValue);
          grouped[xValue].details.push({
            x: xValue,
            y: yValue,
            color: colorValue,
          });
        });
      });

      const result = Object.values(grouped).map((item) => ({
        id: item.id,
        name: item.id,
        value: item.ySet.size,
        details: item.details,
        color: getBarColor(item.color),
      }));

      return result;
    }
  };

  const getBarColor = (entry) => {
    if (!entry) return "#2E86C1";

    switch (entry) {
      case "Готово":
        return "#27AE60";
      case "В процессе":
        return "#F1C40F";
      case "Высокий":
        return "#E74C3C";
      case "Средний":
        return "#F39C12";
      case "Низкий":
        return "#27AE60";
      default:
        return "#2E86C1";
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border rounded-lg shadow-lg">
          <p className="font-medium">{data.id}</p>
          <p className="text-sm text-gray-600">{data.name}</p>
          <p className="text-sm text-gray-600">Count: {data.value}</p>
          {data.details && (
            <div className="mt-2">
              <p className="text-sm font-medium">Details:</p>
              <ul className="text-sm text-gray-600">
                {data.details.map((detail, index) => (
                  <li key={index}>
                    {detail.x}: {detail.y}
                    {detail.color && ` (${detail.color})`}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <Select value={chartType} onValueChange={setChartType}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select chart type" />
          </SelectTrigger>
          <SelectContent>
            {chartTypes.map((type) => (
              <SelectItem key={type.id} value={type.id}>
                {type.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-6">
        {/* Available columns */}
        <div className="w-64 p-4 border rounded-lg">
          <h3 className="font-semibold mb-4">Available Columns</h3>
          <div className="space-y-2">
            {availableColumns.map((column) => (
              <div
                key={column.id}
                draggable
                onDragStart={(e) => handleDragStart(e, column)}
                className="p-2 bg-gray-100 rounded cursor-move hover:bg-gray-200"
              >
                {column.name}
              </div>
            ))}
          </div>
        </div>

        <div className="w-80 p-4 border rounded-lg">
          <h3 className="font-semibold mb-4">Chart Configuration</h3>
          <div className="space-y-4">
            <div
              className="p-4 border rounded-lg min-h-[100px]"
              onDrop={(e) => handleDrop(e, "x")}
              onDragOver={handleDragOver}
            >
              <h4 className="font-medium mb-2">X Axis</h4>
              {xAxis && (
                <div className="p-2 bg-blue-100 rounded inline-flex items-center gap-2">
                  <span>{xAxis.name}</span>
                  <button
                    onClick={() => handleRemove("x")}
                    className="p-1 hover:bg-blue-200 rounded-full"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div
              className="p-4 border rounded-lg min-h-[100px]"
              onDrop={(e) => handleDrop(e, "y")}
              onDragOver={handleDragOver}
            >
              <h4 className="font-medium mb-2">Y Axis</h4>
              {yAxis && (
                <div className="p-2 bg-blue-100 rounded inline-flex items-center gap-2">
                  <span>{yAxis.name}</span>
                  <button
                    onClick={() => handleRemove("y")}
                    className="p-1 hover:bg-blue-200 rounded-full"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div
              className="p-4 border rounded-lg min-h-[100px]"
              onDrop={(e) => handleDrop(e, "color")}
              onDragOver={handleDragOver}
            >
              <h4 className="font-medium mb-2">Color</h4>
              {colorField && (
                <div className="p-2 bg-blue-100 rounded inline-flex items-center gap-2">
                  <span>{colorField.name}</span>
                  <button
                    onClick={() => handleRemove("color")}
                    className="p-1 hover:bg-blue-200 rounded-full"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div
              className="p-4 border rounded-lg min-h-[100px]"
              onDrop={(e) => handleDrop(e, "filter")}
              onDragOver={handleDragOver}
            >
              <h4 className="font-medium mb-2">Filter</h4>
              {filter && (
                <div className="p-2 bg-blue-100 rounded inline-flex items-center gap-2">
                  <span>{filter.name}</span>
                  <button
                    onClick={() => handleRemove("filter")}
                    className="p-1 hover:bg-blue-200 rounded-full"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 p-4 border rounded-lg">
          <h3 className="font-semibold mb-4">Chart Preview</h3>
          <div className="h-[400px]">
            {xAxis && yAxis ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getChartData()}>
                  <XAxis
                    dataKey="id"
                    interval={0}
                    height={100}
                    tick={({ x, y, payload }) => (
                      <text
                        x={x}
                        y={y + 10}
                        textAnchor="end"
                        transform={`rotate(-45, ${x},${y})`}
                        fontSize={12}
                      >
                        {payload.value}
                      </text>
                    )}
                  />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="value"
                    fillOpacity={0.8}
                    stroke="#fff"
                    strokeWidth={1}
                    radius={[4, 4, 0, 0]}
                  >
                    {getChartData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || "red"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                Drag columns to X and Y axes to see the chart
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartBuilder;
