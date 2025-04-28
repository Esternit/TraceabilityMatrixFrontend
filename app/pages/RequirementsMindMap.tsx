'use client';

import ReactFlow, { Background, Controls, MiniMap, useEdgesState, useNodesState, Position } from 'reactflow';
import 'reactflow/dist/style.css';
import { Card } from "@/components/ui/card";

const nodeWidth = 250;
const nodeHeight = 80;

// Типизация
interface RequirementSection {
  id: string;
  title: string;
  color: string;
  children: {
    id: string;
    title: string;
    color: string;
    details: string[];
  }[];
}

interface RequirementsMindMapProps {
  requirementsData: RequirementSection[];
}

export default function RequirementsMindMap({ requirementsData }: RequirementsMindMapProps) {
  const initialNodes = generateNodes(requirementsData);
  const initialEdges = generateEdges(requirementsData);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div className="w-full h-[100vh]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}

// Генерация узлов
function generateNodes(requirements: RequirementSection[]) {
  let nodes: any[] = [];
  let yOffset = 0;

  requirements.forEach((section, index) => {
    const sectionId = `section-${section.id}`;

    nodes.push({
      id: sectionId,
      data: { label: NodeCard(section.title, section.color, "font-bold") },
      position: { x: 100, y: yOffset },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      type: 'default',
      style: {
        width: nodeWidth,
        height: nodeHeight,
        backgroundColor: section.color,
        borderRadius: "9999px",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
    });

    section.children.forEach((child, idx) => {
      const childId = `child-${child.id}`;

      nodes.push({
        id: childId,
        data: { label: NodeCard(child.title, child.color, "font-semibold") },
        position: { x: 450, y: yOffset + idx * 150 },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
        type: 'default',
        style: {
          width: nodeWidth,
          height: nodeHeight,
          backgroundColor: child.color,
          borderRadius: "9999px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        },
      });

      child.details.forEach((detail, detailIdx) => {
        const detailId = `detail-${child.id}-${detailIdx}`;

        nodes.push({
          id: detailId,
          data: { label: NodeCard(detail, "#ffffff", "text-xs") },
          position: { x: 800, y: yOffset + idx * 150 + detailIdx * 70 },
          sourcePosition: Position.Right,
          targetPosition: Position.Left,
          type: 'default',
          style: {
            width: nodeWidth,
            height: 60,
            backgroundColor: "#ffffff",
            borderRadius: "9999px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          },
        });
      });
    });

    yOffset += section.children.length * 180;
  });

  return nodes;
}

// Генерация связей
function generateEdges(requirements: RequirementSection[]) {
  let edges: any[] = [];

  requirements.forEach((section) => {
    const sectionId = `section-${section.id}`;

    section.children.forEach((child) => {
      const childId = `child-${child.id}`;

      edges.push({
        id: `edge-${sectionId}-${childId}`,
        source: sectionId,
        target: childId,
      });

      child.details.forEach((_, detailIdx) => {
        const detailId = `detail-${child.id}-${detailIdx}`;

        edges.push({
          id: `edge-${childId}-${detailId}`,
          source: childId,
          target: detailId,
        });
      });
    });
  });

  return edges;
}

// Отдельный компонент для карточек
function NodeCard(title: string, color: string, textClassName: string = "") {
  return (
    <div className={`px-4 text-center ${textClassName}`} style={{ width: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
      {title}
    </div>
  );
}
