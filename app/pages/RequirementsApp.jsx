"use client";

import Requirement from "../classes/Requirement";
import RequirementForm from "./RequirementForm";
import RequirementsList from "./RequirementsList";
import RequirementsTree from "./RequirementsTree";
import TableDemo from "./TableDemo";
import { useState } from "react";
import { SourceRequirementMatrix } from "./SourceRequirementMatrix";
import { RequirementsMatrix } from "./RequirementsMatrix";
import { mockData } from "@/app/data/requirements-matrix-mock";
import { mockDataTree } from "../data/requirements-tree";
import { RequirementsChart } from "./RequirementsChart";
import RequirementsMindMap from "./RequirementsMindMap";

// const req1 = new Requirement("Требование 1", "Компания X", 8);
// const req2 = new Requirement("Требование 2", "Человек Y", 6);
// const req3 = new Requirement("Требование 3", "Требование 1", 7);

// req2.addDependency(req1);
// req3.addDependency(req1);

// const requirements = [req1, req2, req3];

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
      {/* <RequirementsMindMap requirementsData={mockDataTree} /> */}
      {/* <RequirementsChart columns={mockData} /> */}
    </div>
  );
}

export default RequirementsApp;
