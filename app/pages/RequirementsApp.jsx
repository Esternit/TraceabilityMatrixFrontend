"use client";

import { RequirementsMatrix } from "./RequirementsMatrix/RequirementsMatrix";
import { mockData } from "@/app/data/requirements-matrix-mock";
import { RequirementsDependencies } from "./RequirementsMatrix/RequirementsDependencies";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockDependenciesData } from "../data/requirements-dependencies-mock";
import { useRef, useState } from "react";
import ChartBuilder from "./ChartBuilder/ChartBuilder";

export default function RequirementsApp() {
  const [activeTab, setActiveTab] = useState("table");
  const tableRef = useRef(null);
  const [expandedIds, setExpandedIds] = useState(new Set());

  const handleRequirementClick = (id, expandedNodes) => {
    setActiveTab("table");
    setExpandedIds(new Set(expandedNodes));

    setTimeout(() => {
      const element = document.querySelector(`[data-requirement-id="${id}"]`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        element.classList.add("highlight-row");
        setTimeout(() => {
          element.classList.remove("highlight-row");
        }, 2000);
      }
    }, 100);
  };

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "5rem",
      }}
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="table">Таблица</TabsTrigger>
          <TabsTrigger value="dependencies">Зависимости</TabsTrigger>
          <TabsTrigger value="dependencies-more">
            Зависимости (много)
          </TabsTrigger>
          <TabsTrigger value="charts">Графики</TabsTrigger>
        </TabsList>
        <TabsContent value="table">
          <RequirementsMatrix
            columns={mockData}
            ref={tableRef}
            expandedIds={expandedIds}
            onExpandedIdsChange={setExpandedIds}
          />
        </TabsContent>
        <TabsContent value="dependencies">
          <RequirementsDependencies
            columns={mockData}
            onRequirementClick={handleRequirementClick}
          />
        </TabsContent>
        <TabsContent value="dependencies-more">
          <RequirementsDependencies
            columns={mockDependenciesData}
            onRequirementClick={handleRequirementClick}
          />
        </TabsContent>
        <TabsContent value="charts">
          <ChartBuilder />
        </TabsContent>
      </Tabs>
    </div>
  );
}
