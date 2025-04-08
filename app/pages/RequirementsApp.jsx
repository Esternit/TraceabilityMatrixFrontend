"use client";

import Requirement from "../classes/Requirement";
import RequirementForm from "./RequirementForm";
import RequirementsList from "./RequirementsList";
import RequirementsTree from "./RequirementsTree";
import TableDemo from "./TableDemo";
import { useState } from "react";

// const req1 = new Requirement("Требование 1", "Компания X", 8);
// const req2 = new Requirement("Требование 2", "Человек Y", 6);
// const req3 = new Requirement("Требование 3", "Требование 1", 7);

// req2.addDependency(req1);
// req3.addDependency(req1);

// const requirements = [req1, req2, req3];

const testCases = [
  "Тест-кейс 1",
  "Тест-кейс 2",
  "Тест-кейс 3",
  "Тест-кейс 4",
  "Тест-кейс 5",
];

const traceMatrix = [
  [false, true, false, false, false],
  [false, false, true, false, false],
  [true, false, true, false, false],
  [false, false, false, false, true],
  [false, false, false, true, false],
];

export function RequirementsApp() {
  const [requirements, setRequirements] = useState([]);

  const addRequirement = (requirement) => {
    setRequirements((prevRequirements) => [...prevRequirements, requirement]);
  };

  return (
    <div>
      <RequirementForm onAddRequirement={addRequirement} />
      {/* <RequirementsList requirements={requirements} />
      <RequirementsTree requirements={requirements} /> */}
      <TableDemo
        requirements={requirements}
        testCases={testCases}
        traceMatrix={traceMatrix}
      />
      <RequirementsTree requirements={requirements} />
    </div>
  );
}

export default RequirementsApp;
