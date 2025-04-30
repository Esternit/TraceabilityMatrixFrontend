import {
    useState,
    useEffect,
    useRef
} from "react";

import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell
} from "@/components/ui/table";
import { TextAlignment } from "./types";
import { Pin } from "lucide-react";
import { Column, Props } from "./types";
import { iconMap } from "./iconMap";
import { ColumnFilter } from "./ColumnFilter";
import { defaultAlignment } from "./utils";

export const RequirementsMatrix = ({ columns: initialColumns }: Props) => {
    const [filters, setFilters] = useState<Record<number, string[]>>({});
    const [data, setData] = useState<{ [key: number]: string[] }>({});
    const [columns, setColumns] = useState<Column[]>(initialColumns);
    const [sortConfig, setSortConfig] = useState<{ columnIndex: number; direction: "asc" | "desc" } | null>(null);
    const [pinnedColumns, setPinnedColumns] = useState<number[]>([]);
    const [columnWidths, setColumnWidths] = useState<number[]>([]);
    const tableRef = useRef<HTMLTableElement>(null);

    if (!columns.length) return null;

    const defaultAlignment: TextAlignment = {
        vertical: "center",
        horizontal: "left",
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, colIndex: number) => {
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

    useEffect(() => {
        const uniqueValuesMap: { [key: number]: string[] } = {};
        initialColumns.forEach((col, colIndex) => {
          uniqueValuesMap[colIndex] = [...new Set(col.cells.map(cell => cell.cell_text))];
        });
        setData(uniqueValuesMap);
      }, [initialColumns]);

    useEffect(() => {
        if (tableRef.current) {
            const widths = Array.from(tableRef.current.querySelectorAll('th')).map(
                th => Math.min(th.getBoundingClientRect().width, 300)
            );
            setColumnWidths(widths);
        }
    }, [columns, pinnedColumns]);

    const togglePinColumn = (columnIndex: number) => {
        setPinnedColumns(prev => 
            prev.includes(columnIndex)
                ? prev.filter(i => i !== columnIndex)
                : [...prev, columnIndex].sort((a, b) => a - b)
        );
    };

    const handleSort = (columnIndex: number, direction: "asc" | "desc") => {
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

    const calculateLeftPosition = (colIndex: number, isHeader: boolean = false) => {
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

    const handleFilter = (columnIndex: number, selectedValues: string[]) => {
    
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

    return (
        <div className="overflow-auto"
            style={{ maxWidth: '90%' }}>
            <Table ref={tableRef} className="relative">
                <TableHeader>
                    <TableRow>
                        {columns.map((col, colIndex) => {
                            const alignment = col.text_alignment || defaultAlignment;
                            const isPinned = pinnedColumns.includes(colIndex);
                            const width = columnWidths[colIndex] || 'auto';
                            const left = calculateLeftPosition(colIndex);
                            const isSorted = sortConfig?.columnIndex === colIndex;
                            
                            return (
                                <TableHead
                                    key={colIndex}
                                    onContextMenu={(e) => {
                                        e.preventDefault();
                                        togglePinColumn(colIndex);
                                    }}
                                    style={{
                                        backgroundColor: isPinned ? col.background_color || '#f8fafc' : col.background_color,
                                        borderRight: colIndex !== columns.length - 1 ? '1px solid #e2e8f0' : undefined,
                                        color: col.text_color,
                                        textAlign: alignment.horizontal,
                                        verticalAlign: alignment.vertical,
                                        position: isPinned ? 'sticky' : undefined,
                                        left: left !== undefined ? `${left}px` : undefined,
                                        zIndex: isPinned ? 30 : 1,
                                        boxShadow: isPinned ? '5px 0 5px -5px rgba(0,0,0,0.2)' : undefined,
                                        whiteSpace: 'nowrap',
                                        maxWidth: "300px",
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        cursor: 'context-menu',
                                    }}
                                    className={`group ${col.sorting?.enabled ? 'hover:bg-opacity-90' : ''}`}
                                >
                                    <div className="flex items-center justify-between gap-1 w-full overflow-hidden relative">
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent:
                                                    alignment.horizontal === "left"
                                                        ? "flex-start"
                                                        : alignment.horizontal === "right"
                                                        ? "flex-end"
                                                        : "center",
                                                gap: "0.25rem",
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                flexGrow: 1,
                                            }}
                                        >
                                            <span className="overflow-hidden text-ellipsis">{col.column_text}</span>

                                            {isPinned && (
                                                <div className="flex-shrink-0 text-white/70 ml-1">
                                                    <Pin className="h-4 w-4" />
                                                </div>
                                            )}

                                            {sortConfig?.columnIndex === colIndex && (
                                                <div className="flex-shrink-0 ml-1">
                                                    {sortConfig.direction === "asc" ? (
                                                        <div className="w-1.5 h-1.5 border-t-2 border-r-2 transform rotate-[-45deg] text-current" />
                                                    ) : sortConfig.direction === "desc" ? (
                                                        <div className="w-1.5 h-1.5 border-b-2 border-r-2 transform rotate-[45deg] text-current" />
                                                    ) : null}
                                                </div>
                                            )}
                                        </div>

                                        <ColumnFilter
                                            uniqueValues={data[colIndex] || []}
                                            activeSort={sortConfig?.columnIndex === colIndex ? sortConfig.direction : null}
                                            onSortAsc={() => handleSort(colIndex, "asc")}
                                            onSortDesc={() => handleSort(colIndex, "desc")}
                                            onClearSort={() => {
                                                setColumns([...initialColumns]);
                                                setSortConfig(null);
                                            }}
                                            onFilterChange={(selected) => handleFilter(colIndex, selected)}
                                            columns={initialColumns[colIndex]}
                                        />
                                    <div
                                        onMouseDown={(e) => handleMouseDown(e, colIndex)}
                                        style={{
                                            position: "absolute",
                                            top: 0,
                                            right: 0,
                                            height: "100%",
                                            width: "5px",
                                            cursor: "col-resize",
                                            zIndex: 50,
                                        }}
                                        />
                                </div>
                                </TableHead>
                            );
                        })}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Array.from({ length: columns[0].cells.length })
                        .filter((_, rowIndex) => {
                            return columns.every((col, colIndex) => {
                                const selected = filters[colIndex];
                                if (!selected) return true;
                                const cellValue = col.cells[rowIndex].cell_text;
                                return selected.includes(cellValue);
                            });
                        })
                    .map((_, rowIndex) => (
                        <TableRow key={rowIndex}>
                            {columns.map((col, colIndex) => {
                                const cell = col.cells[rowIndex];
                                const align = cell?.text_alignment || col.text_alignment || defaultAlignment;
                                const icon = cell?.icon ? iconMap[cell.icon.name] : null;
                                const isPinned = pinnedColumns.includes(colIndex);
                                const width = columnWidths[colIndex] || 'auto';
                                const left = calculateLeftPosition(colIndex);

                                return (
                                    <TableCell
                                    key={`${colIndex}-${rowIndex}`}
                                    style={{
                                        backgroundColor: isPinned 
                                            ? cell?.background_color || '#f8fafc' 
                                            : cell?.background_color || "transparent",
                                        color: cell?.text_color || "inherit",
                                        textAlign: align.horizontal,
                                        verticalAlign: align.vertical,
                                        position: isPinned ? 'sticky' : undefined,
                                        left: left !== undefined ? `${left}px` : undefined,
                                        zIndex: isPinned ? 20 : 1,
                                        boxShadow: isPinned ? '5px 0 5px -5px rgba(0,0,0,0.2)' : undefined,
                                        minWidth: `${width}px`,
                                        width: `${width}px`,
                                        maxWidth: "300px",
                                        whiteSpace: 'normal',
                                        padding: '0.5rem',
                                        overflow: 'hidden', 
                                    }}
                                    >
                                    <div
                                        style={{
                                        display: "flex",
                                        alignItems:
                                            align.vertical === "top"
                                            ? "flex-start"
                                            : align.vertical === "bottom"
                                            ? "flex-end"
                                            : "center",
                                        justifyContent:
                                            align.horizontal === "left"
                                            ? "flex-start"
                                            : align.horizontal === "right"
                                            ? "flex-end"
                                            : "center",
                                        gap: "0.5rem",
                                        width: '100%',
                                        }}
                                    >
                                        {cell?.icon?.position === "left" && icon}

                                        {cell?.cell_text?.startsWith("http") ? (
                                        <a
                                            href={cell.cell_text}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                            color: 'inherit',
                                            textDecoration: 'underline',
                                            display: 'inline-block',
                                            overflow: columnWidths[colIndex] < 100 ? 'hidden' : 'visible',
                                            textOverflow: columnWidths[colIndex] < 100 ? 'ellipsis' : 'unset',
                                            whiteSpace: columnWidths[colIndex] < 100 ? 'nowrap' : 'normal',
                                            width: '100%',
                                            }}
                                        >
                                            {cell.cell_text}
                                        </a>
                                        ) : (
                                        <span
                                            style={{
                                            display: 'inline-block',
                                            overflow: columnWidths[colIndex] < 100 ? 'hidden' : 'visible',
                                            textOverflow: columnWidths[colIndex] < 100 ? 'ellipsis' : 'unset',
                                            whiteSpace: columnWidths[colIndex] < 100 ? 'nowrap' : 'normal',
                                            width: '100%',
                                            }}
                                        >
                                            {cell?.cell_text}
                                        </span>
                                        )}

                                        {cell?.icon?.position === "right" && icon}
                                    </div>
                                    </TableCell>
                                );
                            })}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};
