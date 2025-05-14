import { X } from "lucide-react";

const ChartConfig = ({
  chartType,
  onDrop,
  onDragOver,
  onRemove,
  xAxis,
  yAxis,
  colorField,
}) => {
  return (
    <div className="w-80 p-4 border rounded-lg">
      <h3 className="font-semibold mb-4">Chart Configuration</h3>
      <div className="space-y-4">
        <div
          className="p-4 border rounded-lg min-h-[100px]"
          onDrop={(e) => onDrop(e, "x")}
          onDragOver={onDragOver}
        >
          <h4 className="font-medium mb-2">X Axis</h4>
          {xAxis && (
            <div className="p-2 bg-blue-100 rounded inline-flex items-center gap-2">
              <span>{xAxis.name}</span>
              <button
                onClick={() => onRemove("x")}
                className="p-1 hover:bg-blue-200 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <div
          className="p-4 border rounded-lg min-h-[100px]"
          onDrop={(e) => onDrop(e, "y")}
          onDragOver={onDragOver}
        >
          <h4 className="font-medium mb-2">Y Axis</h4>
          {yAxis && (
            <div className="p-2 bg-blue-100 rounded inline-flex items-center gap-2">
              <span>{yAxis.name}</span>
              <button
                onClick={() => onRemove("y")}
                className="p-1 hover:bg-blue-200 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {chartType === "bar" && (
          <div
            className="p-4 border rounded-lg min-h-[100px]"
            onDrop={(e) => onDrop(e, "color")}
            onDragOver={onDragOver}
          >
            <h4 className="font-medium mb-2">Color</h4>
            {colorField && (
              <div className="p-2 bg-blue-100 rounded inline-flex items-center gap-2">
                <span>{colorField.name}</span>
                <button
                  onClick={() => onRemove("color")}
                  className="p-1 hover:bg-blue-200 rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChartConfig;
