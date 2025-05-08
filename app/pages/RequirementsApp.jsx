"use client";

import { RequirementsMatrix } from "./RequirementsMatrix/RequirementsMatrix";
import { mockData } from "@/app/data/requirements-matrix-mock";
import { RequirementsDependencies } from "./RequirementsMatrix/RequirementsDependencies";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockDependenciesData } from "../data/requirements-dependencies-mock";

export function RequirementsApp() {
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
      <Tabs defaultValue="table" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="table">Таблица</TabsTrigger>
          <TabsTrigger value="dependencies">Зависимости</TabsTrigger>
          <TabsTrigger value="dependencies-more">
            Зависимости (много)
          </TabsTrigger>
        </TabsList>
        <TabsContent value="table">
          <RequirementsMatrix columns={mockData} />
        </TabsContent>
        <TabsContent value="dependencies">
          <RequirementsDependencies columns={mockData} />
        </TabsContent>
        <TabsContent value="dependencies-more">
          <RequirementsDependencies columns={mockDependenciesData} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default RequirementsApp;
