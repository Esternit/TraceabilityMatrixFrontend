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
    sortConfig: { columnIndex: number; direction: "asc" | "desc" } | null,
    setSortConfig: (config: { columnIndex: number; direction: "asc" | "desc" } | null) => void,
    setColumns: (columns: Column[]) => void,
    initialColumns: Column[],
    currentColumns: Column[],
    nodeId?: string
) => {
    setSortConfig({ columnIndex, direction });

    const sortChildren = (cells: any[], parentId?: string) => {
        const cellMap = new Map<string, any[]>();
        const rootCells: any[] = [];

        cells.forEach(cell => {
            if (cell.parent_id) {
                if (!cellMap.has(cell.parent_id)) {
                    cellMap.set(cell.parent_id, []);
                }
                cellMap.get(cell.parent_id)!.push(cell);
            } else {
                rootCells.push(cell);
            }
        });

        const sortedRootCells = [...rootCells].sort((a, b) => {
            const valueA = a.cell_text || '';
            const valueB = b.cell_text || '';
            return direction === 'asc' 
                ? valueA.localeCompare(valueB)
                : valueB.localeCompare(valueA);
        });

        if (nodeId && cellMap.has(nodeId)) {
            const children = cellMap.get(nodeId)!;
            const sortedChildren = [...children].sort((a, b) => {
                const valueA = a.cell_text || '';
                const valueB = b.cell_text || '';
                return direction === 'asc' 
                    ? valueA.localeCompare(valueB)
                    : valueB.localeCompare(valueA);
            });
            cellMap.set(nodeId, sortedChildren);
        }

        const result: any[] = [];
        const processCell = (cell: any) => {
            result.push(cell);
            const children = cellMap.get(cell.cell_text) || [];
            children.forEach(processCell);
        };
        sortedRootCells.forEach(processCell);

        return result;
    };

    const newColumns = currentColumns.map((col, index) => {
        if (index === columnIndex) {
            return {
                ...col,
                cells: sortChildren(col.cells, nodeId)
            };
        }
        return col;
    });

    setColumns(newColumns);
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
