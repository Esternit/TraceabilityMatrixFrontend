import { SortConfig, Column } from "./types";

export const defaultAlignment = {
    vertical: "center",
    horizontal: "left",
} as const;

// export const calculateLeftPosition = (
//     columnIndex: number,
//     columnWidths: number[]
// ): number => {
//     return columnWidths
//         .slice(0, columnIndex)
//         .reduce((acc, width) => acc + width, 0);
// };

export const handleMouseDown = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    colIndex: number,
    columnWidths: number[],
    setColumnWidths: React.Dispatch<React.SetStateAction<number[]>>
) => {
    e.preventDefault();

    const startX = e.clientX;
    const startWidth = columnWidths[colIndex] || 150;

    const handleMouseMove = (moveEvent: MouseEvent) => {
        const newWidth = Math.max(50, Math.min(600, startWidth + (moveEvent.clientX - startX)));

        setColumnWidths((prev) => {
            const updated = [...prev];
            updated[colIndex] = newWidth;
            return updated;
        });
    };

    const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
};

export const togglePinColumn = (
    columnIndex: number, 
    setPinnedColumns: React.Dispatch<React.SetStateAction<number[]>>
) => {
    setPinnedColumns(prev => 
        prev.includes(columnIndex)
            ? prev.filter(i => i !== columnIndex)
            : [...prev, columnIndex].sort((a, b) => a - b)
    );
};

export const handleSort = (
    columnIndex: number,
    direction: "asc" | "desc", 
    sortConfig: SortConfig, 
    setSortConfig: React.Dispatch<React.SetStateAction<SortConfig>>,
    setColumns: React.Dispatch<React.SetStateAction<Column[]>>,
    initialColumns: Column[],
    columns: Column[]

) => {
    if (sortConfig && sortConfig.columnIndex === columnIndex && sortConfig.direction === direction) {
        setColumns([...initialColumns]);
        setSortConfig(null);
        return;
    }

    const column = columns[columnIndex];
    if (!column.sorting?.enabled) return;

    const sortedColumns = columns.map((col) => ({ ...col, cells: [...col.cells] }));

    const rows = sortedColumns[0].cells.map((_, rowIndex) => sortedColumns.map((col) => col.cells[rowIndex]));

    rows.sort((rowA, rowB) => {
        const cellA = rowA[columnIndex];
        const cellB = rowB[columnIndex];

        if (column.sorting?.type === "numeric") {
            const numA = parseFloat(cellA.cell_text.replace(/[^0-9.]/g, "")) || 0;
            const numB = parseFloat(cellB.cell_text.replace(/[^0-9.]/g, "")) || 0;
            return direction === "asc" ? numA - numB : numB - numA;
        } else {
            return direction === "asc"
                ? cellA.cell_text.localeCompare(cellB.cell_text)
                : cellB.cell_text.localeCompare(cellA.cell_text);
        }
    });

    sortedColumns.forEach((col, colIndex) => {
        col.cells = rows.map((row) => row[colIndex]);
    });

    setColumns(sortedColumns);
    setSortConfig({ columnIndex, direction });
};

export const calculateLeftPosition = (
    colIndex: number, 
    pinnedColumns: number[],
    columnWidths: number[]
) => {
    if (!pinnedColumns.includes(colIndex)) return undefined;
    
    const pinnedIndex = pinnedColumns.indexOf(colIndex);
    if (pinnedIndex === 0) return 0;
    
    let left = 0;
    for (let i = 0; i < pinnedIndex; i++) {
        const prevColIndex = pinnedColumns[i];
        left += columnWidths[prevColIndex] || 0;
    }
    
    return left;
};

export const handleFilter = (
    columnIndex: number, 
    selectedValues: string[],
    initialColumns: Column[],
    setColumns: React.Dispatch<React.SetStateAction<Column[]>>
) => {
    
    const newColumns = initialColumns.map((col) => ({
        ...col,
        cells: [...col.cells],
    }));

    const rowIndices = initialColumns[columnIndex].cells
        .map((cell, index) => selectedValues.includes(cell.cell_text) ? index : null)
        .filter((index): index is number => index !== null);

    newColumns.forEach((col, colIdx) => {
        col.cells = rowIndices.map(rowIndex => initialColumns[colIdx].cells[rowIndex]);
    });

    setColumns(newColumns);
};
