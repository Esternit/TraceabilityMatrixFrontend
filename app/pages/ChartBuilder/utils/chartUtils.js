export const isNumeric = (str) => {
  return !isNaN(str) && !isNaN(parseFloat(str));
};

export const getBarColor = (entry) => {
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

export const getChartData = (xAxis, yAxis, colorField, chartType, mockData) => {
  if (!xAxis || !yAxis) return [];

  const xColumn = mockData.find((col) => col.column_text === xAxis.name);
  const yColumn = mockData.find((col) => col.column_text === yAxis.name);
  const colorColumn = colorField
    ? mockData.find((col) => col.column_text === colorField.name)
    : null;

  if (!xColumn || !yColumn) return [];

  const isYNumeric = yColumn.sorting?.type === "numeric";

  if (isYNumeric) {
    if (chartType === "pie") {
      const groupedData = {};
      xColumn.cells.forEach((cell, index) => {
        const xValue = cell.cell_text;
        const yValue = parseFloat(yColumn.cells[index]?.cell_text) || 0;

        if (!groupedData[xValue]) {
          groupedData[xValue] = {
            name: xValue,
            value: 0,
          };
        }
        groupedData[xValue].value += yValue;
      });

      return Object.values(groupedData).filter((item) => item.value > 0);
    } else if (chartType === "radar") {
      const xValues = [...new Set(xColumn.cells.map((cell) => cell.cell_text))];

      const data = xValues.map((xValue) => {
        const xIndex = xColumn.cells.findIndex(
          (cell) => cell.cell_text === xValue
        );
        const yValue =
          xIndex !== -1 ? parseFloat(yColumn.cells[xIndex]?.cell_text) || 0 : 0;

        return {
          name: xValue,
          value: yValue,
        };
      });

      return data;
    }

    return xColumn.cells.map((cell, index) => {
      const colorValue = colorColumn
        ? colorColumn.cells[index]?.cell_text
        : undefined;
      return {
        id: cell.cell_text,
        name: cell.cell_text,
        value: parseFloat(yColumn.cells[index]?.cell_text) || 0,
        color: colorValue ? getBarColor(colorValue) : "#2E86C1",
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
