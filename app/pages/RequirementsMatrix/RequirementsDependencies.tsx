import ReactFlow, { Background, Controls, MiniMap, useEdgesState, useNodesState, Position, Edge } from 'reactflow';
import 'reactflow/dist/style.css';
import { Column } from './types';
import { useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const nodeWidth = 250;
const nodeHeight = 80;
const horizontalSpacing = 350;
const verticalSpacing = 150;


const edgeColors = [
    '#2E86C1',
    '#27AE60',
    '#E74C3C',
    '#F39C12',
    '#8E44AD',
    '#16A085',
    '#D35400',
    '#2980B9',
];

interface RequirementsDependenciesProps {
    columns: Column[];
}

interface NodeData {
    id: string;
    title: string;
    status: string;
    color: string;
}

function NodeCard({ id, title, status, color, onNodeClick }: NodeData & { onNodeClick: () => void }) {
    return (
        <div 
            className="w-full h-full p-2 flex flex-col justify-between cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={onNodeClick}
        >
            <div className="font-bold truncate">{id}</div>
            <div className="text-sm text-gray-600 truncate">{title}</div>
            <div className="text-xs text-gray-500 truncate">{status}</div>
        </div>
    );
}

export const RequirementsDependencies = ({ columns }: RequirementsDependenciesProps) => {
    const [selectedNode, setSelectedNode] = useState<NodeData | null>(null);

    const { nodes, edges } = useMemo(() => {
        const nodes: any[] = [];
        const edges: Edge[] = [];
        const nodeLevels = new Map<string, number>();
        const nodesOnLevel = new Map<number, number>();
        const rootNodes = new Set<string>();
        const nodeColors = new Map<string, string>();
        const childrenByParent = new Map<string, string[]>();

        columns[0].cells.forEach((cell) => {
            const id = cell.cell_text;
            if (!id) return;

            if (cell.parent_id) {
                const children = childrenByParent.get(cell.parent_id) || [];
                children.push(id);
                childrenByParent.set(cell.parent_id, children);
            }
        });

        childrenByParent.forEach((children, parentId) => {
            if (children.length > 0) {
                rootNodes.add(parentId);
            }
        });

        Array.from(rootNodes).forEach((rootId, index) => {
            const color = edgeColors[index % edgeColors.length];
            nodeColors.set(rootId, color);
        });

        const determineLevels = () => {
            const visited = new Set<string>();
            const queue: string[] = [];

            rootNodes.forEach(id => {
                queue.push(id);
                nodeLevels.set(id, 0);
            });

            while (queue.length > 0) {
                const currentId = queue.shift()!;
                if (visited.has(currentId)) continue;
                visited.add(currentId);

                const currentLevel = nodeLevels.get(currentId) || 0;
                const children = childrenByParent.get(currentId) || [];

                children.forEach(childId => {
                    if (!visited.has(childId)) {
                        nodeLevels.set(childId, currentLevel + 1);
                        queue.push(childId);
                    }
                });
            }
        };

        determineLevels();

        columns[0].cells.forEach((cell, index) => {
            const id = cell.cell_text;
            if (!id) return;

            const title = columns[1].cells[index].cell_text;
            const status = columns[2].cells[index].cell_text;
            const level = nodeLevels.get(id) || 0;

            const currentCount = nodesOnLevel.get(level) || 0;
            nodesOnLevel.set(level, currentCount + 1);

            const x = level * horizontalSpacing + 100;
            const y = currentCount * verticalSpacing + 100;

            nodes.push({
                id,
                data: {
                    label: (
                        <NodeCard
                            id={id}
                            title={title}
                            status={status}
                            color={cell.background_color || '#ffffff'}
                            onNodeClick={() => setSelectedNode({ id, title, status, color: cell.background_color || '#ffffff' })}
                        />
                    ),
                    level
                },
                position: { x, y },
                sourcePosition: Position.Right,
                targetPosition: Position.Left,
                style: {
                    width: nodeWidth,
                    height: nodeHeight,
                    backgroundColor: cell.background_color || '#ffffff',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    padding: 0,
                    overflow: 'hidden',
                },
            });
        });

        columns[0].cells.forEach((cell) => {
            const id = cell.cell_text;
            if (!id || !cell.parent_id) return;

            const sourceLevel = nodeLevels.get(cell.parent_id) || 0;
            const targetLevel = nodeLevels.get(id) || 0;
            const levelDiff = targetLevel - sourceLevel;
            
            let currentParentId = cell.parent_id;
            let edgeColor = nodeColors.get(currentParentId);
            while (!edgeColor && currentParentId) {
                const parentCell = columns[0].cells.find(c => c.cell_text === currentParentId);
                if (parentCell && parentCell.parent_id) {
                    currentParentId = parentCell.parent_id;
                    edgeColor = nodeColors.get(currentParentId);
                } else {
                    break;
                }
            }

            edges.push({
                id: `edge-${cell.parent_id}-${id}`,
                source: cell.parent_id,
                target: id,
                type: levelDiff > 1 ? 'step' : 'smoothstep',
                animated: true,
                style: {
                    stroke: edgeColor || '#94a3b8',
                    strokeWidth: 2,
                },
                sourceHandle: 'right',
                targetHandle: 'left',
                ...(levelDiff > 1 ? {
                    stepPattern: ['vertical', 'horizontal', 'vertical'],
                } : {}),
            });
        });

        return { nodes, edges };
    }, [columns]);

    const [nodesState, setNodes, onNodesChange] = useNodesState(nodes);
    const [edgesState, setEdges, onEdgesChange] = useEdgesState(edges);

    return (
        <div className="w-full h-[calc(100vh-4rem)]">
            <ReactFlow
                nodes={nodesState}
                edges={edgesState}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                fitView
                attributionPosition="bottom-right"
                defaultEdgeOptions={{
                    type: 'smoothstep',
                    animated: true,
                    style: { stroke: '#94a3b8', strokeWidth: 2 },
                }}
            >
                <Background />
                <Controls />
                <MiniMap />
            </ReactFlow>

            <Dialog open={!!selectedNode} onOpenChange={() => setSelectedNode(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{selectedNode?.id}</DialogTitle>
                    </DialogHeader>
                    <div className="mt-4 space-y-4">
                        <div>
                            <h3 className="font-semibold text-gray-700">Название</h3>
                            <p className="text-gray-600">{selectedNode?.title}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-700">Статус</h3>
                            <p className="text-gray-600">{selectedNode?.status}</p>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};