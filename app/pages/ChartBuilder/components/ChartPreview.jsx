import { ResponsiveContainer } from "recharts";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
  Line,
  LineChart,
  PieChart,
  Pie,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-4 border rounded-lg shadow-lg">
        <p className="font-medium">{data.name}</p>
        <p className="text-sm text-gray-600">Value: {data.value}</p>
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

const ChartPreview = ({ chartType, data, xAxis, yAxis }) => {
  const renderChart = () => {
    if (chartType === "bar") {
      return (
        <BarChart data={data}>
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
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      );
    } else if (chartType === "line") {
      return (
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
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
          <Line
            type="monotone"
            dataKey="value"
            stroke="#2E86C1"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      );
    } else if (chartType === "pie") {
      const COLORS = [
        "#0088FE",
        "#00C49F",
        "#FFBB28",
        "#FF8042",
        "#8884D8",
        "#82CA9D",
        "#FFC658",
        "#FF6B6B",
        "#4ECDC4",
        "#45B7D1",
      ];

      return (
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={150}
            fill="#8884d8"
            label={({ name, value }) => `${name}: ${value}`}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      );
    } else if (chartType === "radar") {
      const COLORS = [
        "#0088FE",
        "#00C49F",
        "#FFBB28",
        "#FF8042",
        "#8884D8",
        "#82CA9D",
        "#FFC658",
        "#FF6B6B",
        "#4ECDC4",
        "#45B7D1",
      ];

      const maxValue = Math.max(...data.map((item) => item.value));

      return (
        <RadarChart outerRadius={150} width={600} height={400} data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="name" />
          <Radar
            name="Value"
            dataKey="value"
            stroke="#0088FE"
            fill="#0088FE"
            fillOpacity={0.3}
          />
          <Legend />
          <Tooltip />
        </RadarChart>
      );
    }

    return null;
  };

  return (
    <div className="flex-1 p-4 border rounded-lg">
      <h3 className="font-semibold mb-4">Chart Preview</h3>
      <div className="h-[400px]">
        {xAxis && yAxis ? (
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            Drag columns to X and Y axes to see the chart
          </div>
        )}
      </div>
    </div>
  );
};

export default ChartPreview;
