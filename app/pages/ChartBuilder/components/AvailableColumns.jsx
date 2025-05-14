const AvailableColumns = ({ columns, onDragStart }) => {
  return (
    <div className="w-64 p-4 border rounded-lg">
      <h3 className="font-semibold mb-4">Available Columns</h3>
      <div className="space-y-2">
        {columns.map((column) => (
          <div
            key={column.id}
            draggable
            onDragStart={(e) => onDragStart(e, column)}
            className="p-2 bg-gray-100 rounded cursor-move hover:bg-gray-200"
          >
            {column.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AvailableColumns;
