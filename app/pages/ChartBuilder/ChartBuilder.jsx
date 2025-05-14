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
import AvailableColumns from "./components/AvailableColumns";
import ChartConfig from "./components/ChartConfig";
import ChartPreview from "./components/ChartPreview";
import { getChartData } from "./utils/chartUtils";

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
    { id: "radar", name: "Radar Chart" },
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

  const data = getChartData(xAxis, yAxis, colorField, chartType, mockData);

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
        <AvailableColumns
          columns={availableColumns}
          onDragStart={handleDragStart}
        />

        <ChartConfig
          chartType={chartType}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onRemove={handleRemove}
          xAxis={xAxis}
          yAxis={yAxis}
          colorField={colorField}
        />

        <ChartPreview
          chartType={chartType}
          data={data}
          xAxis={xAxis}
          yAxis={yAxis}
        />
      </div>
    </div>
  );
};

export default ChartBuilder;
