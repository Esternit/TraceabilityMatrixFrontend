import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Check,
    Loader2,
    AlertTriangle,
    ArrowUpDown,
    FileText,
    ClipboardList,
    User,
    Bug,
    Link as LinkIcon,
    Pin,
    PinOff,
    ChevronUp,
    ChevronDown,
} from "lucide-react";
import { useState, ReactNode, useRef, useEffect } from "react";

type TextAlignment = {
    vertical: "top" | "center" | "bottom";
    horizontal: "left" | "center" | "right";
};

type IconName = "check" | "progress" | "warning" | "document" | "test-case" | "user" | "bug" | "link";

type Icon = {
    name: IconName;
    position: "left" | "right";
};

type Cell = {
    cell_text: string;
    background_color?: string;
    text_color?: string;
    text_alignment?: TextAlignment;
    icon?: Icon;
};

type Column = {
    column_text: string;
    background_color?: string;
    text_color?: string;
    text_alignment?: TextAlignment;
    sorting?: {
        type: "alphabetical" | "numeric";
        enabled: boolean;
    };
    cells: Cell[];
};

type Props = {
    columns: Column[];
};

const iconMap: Record<IconName, ReactNode> = {
    check: <Check className="h-4 w-4" />,
    progress: <Loader2 className="h-4 w-4 animate-spin" />,
    warning: <AlertTriangle className="h-4 w-4 text-yellow-500" />,
    document: <FileText className="h-4 w-4" />,
    "test-case": <ClipboardList className="h-4 w-4" />,
    user: <User className="h-4 w-4" />,
    bug: <Bug className="h-4 w-4 text-red-500" />,
    link: <LinkIcon className="h-4 w-4 text-blue-500" />,
};

export const RequirementsMatrix = ({ columns: initialColumns }: Props) => {
    const [columns, setColumns] = useState<Column[]>(initialColumns);
    const [sortConfig, setSortConfig] = useState<{
        columnIndex: number | null;
        direction: "asc" | "desc";
    }>({ columnIndex: null, direction: "asc" });
    const [pinnedColumns, setPinnedColumns] = useState<number[]>([]);
    const [columnWidths, setColumnWidths] = useState<number[]>([]);
    const tableRef = useRef<HTMLTableElement>(null);

    if (!columns.length) return null;

    const defaultAlignment: TextAlignment = {
        vertical: "center",
        horizontal: "left",
    };

    useEffect(() => {
        if (tableRef.current) {
            const widths = Array.from(tableRef.current.querySelectorAll('th')).map(
                th => th.getBoundingClientRect().width
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

    const handleSort = (columnIndex: number) => {
        const column = columns[columnIndex];
        if (!column.sorting?.enabled) return;

        let direction: "asc" | "desc" = "asc";
        if (sortConfig.columnIndex === columnIndex && sortConfig.direction === "asc") {
            direction = "desc";
        }

        const sortedColumns = [...columns];
        const cells = [...column.cells];

        cells.sort((a, b) => {
            if (column.sorting?.type === "numeric") {
                const numA = parseFloat(a.cell_text.replace(/[^0-9.]/g, "")) || 0;
                const numB = parseFloat(b.cell_text.replace(/[^0-9.]/g, "")) || 0;
                return direction === "asc" ? numA - numB : numB - numA;
            } else {
                return direction === "asc"
                    ? a.cell_text.localeCompare(b.cell_text)
                    : b.cell_text.localeCompare(a.cell_text);
            }
        });

        const sortedIndices = cells.map((cell) => column.cells.indexOf(cell));
        sortedColumns.forEach((col) => {
            col.cells = sortedIndices.map((index) => col.cells[index]);
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
        
        console.log(left, colIndex, pinnedColumns, columnWidths);
        return left;
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
                            const isSorted = sortConfig.columnIndex === colIndex;
                            
                            return (
                                <TableHead
                                    key={colIndex}
                                    style={{
                                        backgroundColor: isPinned ? col.background_color || '#f8fafc' : col.background_color,
                                        color: col.text_color,
                                        textAlign: alignment.horizontal,
                                        verticalAlign: alignment.vertical,
                                        position: isPinned ? 'sticky' : undefined,
                                        left: left !== undefined ? `${left}px` : undefined,
                                        zIndex: isPinned ? 30 : 1,
                                        boxShadow: isPinned ? '5px 0 5px -5px rgba(0,0,0,0.2)' : undefined,
                                        minWidth: `${width}px`,
                                        width: `${width}px`,
                                        whiteSpace: 'nowrap'
                                    }}
                                    className={`group ${col.sorting?.enabled ? 'cursor-pointer hover:bg-opacity-90' : ''}`}
                                    onClick={() => col.sorting?.enabled && handleSort(colIndex)}
                                >
                                    <div className="flex items-center justify-between">
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
                                                textOverflow: 'ellipsis'
                                            }}
                                        >
                                            {col.column_text}
                                            {isSorted && (
                                                sortConfig.direction === "asc" 
                                                    ? <ChevronUp className="h-4 w-4 flex-shrink-0" />
                                                    : <ChevronDown className="h-4 w-4 flex-shrink-0" />
                                            )}
                                        </div>
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                togglePinColumn(colIndex);
                                            }}
                                            className={`ml-2 flex-shrink-0 ${isPinned ? 'text-white' : 'text-white/70 hover:text-white'}`}
                                            title={isPinned ? "Unpin column" : "Pin column"}
                                        >
                                            {isPinned ? (
                                                <PinOff className="h-4 w-4" />
                                            ) : (
                                                <Pin className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                </TableHead>
                            );
                        })}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Array.from({ length: columns[0].cells.length }).map((_, rowIndex) => (
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
                                            whiteSpace: 'nowrap'
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
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis'
                                            }}
                                        >
                                            {cell?.icon?.position === "left" && icon}
                                            <span className="truncate">{cell?.cell_text}</span>
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
