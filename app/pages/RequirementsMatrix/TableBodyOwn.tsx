import React from 'react'
import { TableBody, TableRow, TableCell } from '@/components/ui/table';
import { Column, TextAlignment, IconName } from './types';
import { ReactNode } from "react";
import { calculateLeftPosition } from './utils';
import { useState, useMemo } from 'react';
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

type TableBodyOwnProps = {
    columns: Column[];
    filters: Record<number, string[]>;
    defaultAlignment: TextAlignment;
    iconMap: Record<IconName, React.ReactNode>;
    pinnedColumns: number[];
    columnWidths: number[];
    sortConfig: { columnIndex: number; direction: "asc" | "desc" } | null;
    setSortConfig: (config: { columnIndex: number; direction: "asc" | "desc" } | null) => void;
    setColumns: (columns: Column[]) => void;
    initialColumns: Column[];
};

type TreeNode = {
    id: string;
    rowIndex: number;
    children: TreeNode[];
    level: number;
};

export const TableBodyOwn = ({
    columns,
    filters,
    defaultAlignment,
    iconMap,
    pinnedColumns,
    columnWidths,
    sortConfig,
    setSortConfig,
    setColumns,
    initialColumns
}: TableBodyOwnProps) => {
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});

    const tree = useMemo(() => {
        const nodes: Record<string, TreeNode> = {};
        const roots: TreeNode[] = [];

        columns[0].cells.forEach((cell, index) => {
            const id = cell.cell_text;
            nodes[id] = { id, rowIndex: index, children: [], level: 0 };
        });

        columns[0].cells.forEach((cell) => {
            const parentId = cell.parent_id;
            if (parentId && nodes[parentId]) {
                const childNode = nodes[cell.cell_text];
                childNode.level = nodes[parentId].level + 1;
                nodes[parentId].children.push(childNode);
            } else {
                roots.push(nodes[cell.cell_text]);
            }
        });

        return roots;
    }, [columns]);

    const toggleExpand = (id: string) => {
        setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const renderRow = (node: TreeNode, level = 0): React.ReactNode => {
        const row = columns.map((col, colIndex) => {
            const cell = col.cells[node.rowIndex];
            const align = cell?.text_alignment || col.text_alignment || defaultAlignment;
            const icon = cell?.icon ? iconMap[cell.icon.name] : null;
            const isPinned = pinnedColumns.includes(colIndex);
            const width = columnWidths[colIndex] || 'auto';
            const left = calculateLeftPosition(colIndex, pinnedColumns, columnWidths);

            const isFirstCol = colIndex === 0;
            const isExpandable = node.children.length > 0;
            const hasParent = !!cell?.parent_id;
            
            const hierarchyIcons = [];
            if (isFirstCol) {
                if (hasParent) {
                    for (let i = 0; i < level; i++) {
                        hierarchyIcons.push(
                            <span 
                                key={`hierarchy-${i}`} 
                                className="inline-block w-4 text-muted-foreground/50"
                            >
                                {i === level - 1 ? (
                                    isExpandable ? (
                                        <span className="text-primary">├</span>
                                    ) : (
                                        <span className="text-primary">└</span>
                                    )
                                ) : (
                                    <span className="text-muted-foreground/30">│</span>
                                )}
                            </span>
                        );
                    }
                }
                if (isExpandable) {
                    hierarchyIcons.push(
                        <button 
                            key="expand-button"
                            onClick={() => toggleExpand(node.id)}
                            className={cn(
                                "w-4 h-4 flex items-center justify-center transition-transform duration-200",
                                "text-muted-foreground hover:text-primary",
                                expanded[node.id] && "transform rotate-90"
                            )}
                        >
                            <ChevronRight className="w-3 h-3" />
                        </button>
                    );
                } else {
                    hierarchyIcons.push(
                        <span 
                            key="spacer" 
                            className="inline-block w-4"
                        />
                    );
                }
            }

            return (
                <TableCell
                    key={`${colIndex}-${node.rowIndex}`}
                    style={{
                        backgroundColor: isPinned
                            ? cell?.background_color || '#f8fafc'
                            : cell?.background_color || 'transparent',
                        color: cell?.text_color || 'inherit',
                        textAlign: align.horizontal,
                        verticalAlign: align.vertical,
                        position: isPinned ? 'sticky' : undefined,
                        left: left !== undefined ? `${left}px` : undefined,
                        zIndex: isPinned ? 20 : 1,
                        boxShadow: isPinned ? '5px 0 5px -5px rgba(0,0,0,0.2)' : undefined,
                        minWidth: `${width}px`,
                        width: `${width}px`,
                        maxWidth: '300px',
                        whiteSpace: 'normal',
                        padding: '0.5rem',
                        overflow: 'hidden',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            alignItems:
                                align.vertical === 'top'
                                    ? 'flex-start'
                                    : align.vertical === 'bottom'
                                        ? 'flex-end'
                                        : 'center',
                            justifyContent:
                                align.horizontal === 'left'
                                    ? 'flex-start'
                                    : align.horizontal === 'right'
                                        ? 'flex-end'
                                        : 'center',
                            gap: '0.5rem',
                            width: '100%',
                        }}
                    >
                        {cell?.icon?.position === 'left' && icon}
                        {isFirstCol && hierarchyIcons}
                        {cell?.cell_text?.startsWith('http') ? (
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
                        {cell?.icon?.position === 'right' && icon}
                    </div>
                </TableCell>
            );
        });

        return (
            <React.Fragment key={node.id}>
                <TableRow>{row}</TableRow>
                {expanded[node.id] &&
                    node.children.map(child => renderRow(child, level + 1))}
            </React.Fragment>
        );
    };

    return <TableBody>{tree.map(node => renderRow(node))}</TableBody>;
};