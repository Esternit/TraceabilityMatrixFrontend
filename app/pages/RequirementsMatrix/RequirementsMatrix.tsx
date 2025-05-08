import {
    useState,
    useEffect,
    useRef,
    useMemo
} from "react";

import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
} from "@/components/ui/table";
import { TextAlignment } from "./types";
import { Pin } from "lucide-react";
import { Column, Props, RequirementNode } from "./types";
import { iconMap } from "./iconMap";
import { ColumnFilter } from "./ColumnFilter";
import { handleSort, handleMouseDown, togglePinColumn, calculateLeftPosition, handleFilter } from "./utils";
import {TableBodyOwn} from "./TableBodyOwn";

export const RequirementsMatrix = ({ columns: initialColumns }: Props) => {
    const [filters, setFilters] = useState<Record<number, string[]>>({});
    const [data, setData] = useState<{ [key: number]: string[] }>({});
    const [columns, setColumns] = useState<Column[]>(initialColumns);
    const [sortConfig, setSortConfig] = useState<{ columnIndex: number; direction: "asc" | "desc" } | null>(null);
    const [pinnedColumns, setPinnedColumns] = useState<number[]>([]);
    const [columnWidths, setColumnWidths] = useState<number[]>([]);
    const tableRef = useRef<HTMLTableElement>(null);
    const [expandedIds, setExpandedIds] = useState<string[]>([]);

    if (!columns.length) return null;

    const requirementTree = useMemo<RequirementNode[]>(() => {
        const cellMap = new Map<string, RequirementNode>();
      
        columns[0].cells.forEach((cell) => {
          const id = cell.cell_text;
          if (!id) return;
      
          cellMap.set(id, {
            id,
            cell,
            children: [],
          });
        });

        const roots: RequirementNode[] = [];
      
        cellMap.forEach((node) => {
          const parentId = node.cell.parent_id;
          if (parentId && cellMap.has(parentId)) {
            const parent = cellMap.get(parentId)!;
            parent.children.push(node);
          } else {
            roots.push(node);
          }
        });
        console.log(roots);
      
        return roots;
      }, [columns]);

    const defaultAlignment: TextAlignment = {
        vertical: "center",
        horizontal: "left",
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
                            const left = calculateLeftPosition(colIndex, pinnedColumns, columnWidths);
                            const isSorted = sortConfig?.columnIndex === colIndex;
                            
                            return (
                                <TableHead
                                    key={colIndex}
                                    onContextMenu={(e) => {
                                        e.preventDefault();
                                        togglePinColumn(colIndex, setPinnedColumns);
                                    }}
                                    style={{
                                        backgroundColor: isPinned ? col.background_color || '#f8fafc' : col.background_color,
                                        borderRight: colIndex !== columns.length - 1 ? '1px solid #e2e8f0' : undefined,
                                        color: col.text_color,
                                        textAlign: alignment.horizontal,
                                        verticalAlign: alignment.vertical,
                                        position: isPinned ? 'sticky' : 'relative',
                                        left: left !== undefined ? `${left}px` : undefined,
                                        zIndex: isPinned ? 30 : 1,
                                        boxShadow: isPinned ? '5px 0 5px -5px rgba(0,0,0,0.2)' : undefined,
                                        whiteSpace: 'nowrap',
                                        maxWidth: "300px",
                                        overflow: 'hidden',
                                        height: '40px',
                                        minHeight: '40px',
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

                                        </div>

                                        <ColumnFilter
                                            uniqueValues={data[colIndex] || []}
                                            activeSort={sortConfig?.columnIndex === colIndex ? sortConfig.direction : null}
                                            onSortAsc={() => handleSort(colIndex, "asc", sortConfig, setSortConfig, setColumns, initialColumns, columns)}
                                            onSortDesc={() => handleSort(colIndex, "desc", sortConfig, setSortConfig, setColumns, initialColumns, columns)}
                                            onClearSort={() => {
                                                setColumns([...initialColumns]);
                                                setSortConfig(null);
                                            }}
                                            onFilterChange={(selected) => handleFilter(colIndex, selected, initialColumns, setColumns)}
                                            columns={initialColumns[colIndex]}
                                        />

                                </div>
                                <div
                                    onMouseDown={(e) => handleMouseDown(e, colIndex, columnWidths, setColumnWidths)}
                                    style={{
                                        position: "absolute",
                                        top: 0,
                                        right: 0,
                                        height: "100%",
                                        width: "5%",
                                        cursor: "col-resize",
                                        zIndex: 50,
                                    }}
                                />
                                </TableHead>
                            );
                        })}
                    </TableRow>
                </TableHeader>
                <TableBodyOwn 
                    columns={columns}
                    filters={filters}
                    defaultAlignment={defaultAlignment}
                    iconMap={iconMap}
                    pinnedColumns={pinnedColumns}
                    columnWidths={columnWidths}
                    sortConfig={sortConfig}
                    setSortConfig={setSortConfig}
                    setColumns={setColumns}
                    initialColumns={initialColumns}
                />
            </Table>
        </div>
    );
};
