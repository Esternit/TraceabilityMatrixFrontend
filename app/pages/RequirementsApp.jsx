"use client";

import { useState } from "react";
import { SourceRequirementMatrix } from "./SourceRequirementMatrix";
import { RequirementsMatrix } from "./RequirementsMatrix/RequirementsMatrix";
import { mockData } from "@/app/data/requirements-matrix-mock";
import { mockDataTree } from "../data/requirements-tree";
import { RequirementsChart } from "./RequirementsChart";
import RequirementsMindMap from "./RequirementsMindMap";
import RequirementsHeatmap from "./Charts/RequirementsHeatmap";
import RequirementsStatusPie from "./Charts/RequirementsStatusPie";
import { DynamicBarChart } from "./Charts/DynamicBarChart";

export function RequirementsApp() {
  const [requirements, setRequirements] = useState([]);

  const addRequirement = (requirement) => {
    setRequirements((prevRequirements) => [...prevRequirements, requirement]);
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
      {/* <RequirementForm onAddRequirement={addRequirement} /> */}
      {/* <RequirementsList requirements={requirements} />
      <RequirementsTree requirements={requirements} /> */}
      {/* <TableDemo
        requirements={requirements}
        testCases={testCases}
        traceMatrix={traceMatrix}
      />
      <SourceRequirementMatrix requirements={requirements} /> */}
      {/* <RequirementsTree requirements={requirements} /> */}
      <RequirementsMatrix columns={mockData} />
      {/* <RequirementsStatusPie statusColumn={mockData[2]} /> */}
      {/* <DynamicBarChart columns={mockData} /> */}
      {/* <RequirementsMindMap requirementsData={mockDataTree} /> */}
      {/* <RequirementsChart columns={mockData} /> */}
    </div>
  );
}

export default RequirementsApp;
