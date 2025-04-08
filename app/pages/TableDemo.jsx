import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { RequirementAlertDialog } from "./RequirementAlertDialog";

export function TraceabilityMatrixTable({ requirements }) {
  const traceMatrix = requirements.map((requirement) =>
    requirements.map((otherRequirement) =>
      requirement.dependencies.includes(otherRequirement) ? "➕" : ""
    )
  );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[180px]">Требования\Требования</TableHead>
          {requirements.map((requirement, index) => (
            <TableHead key={index} className="text-center">
              {requirement.name}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {requirements.map((requirement, rowIndex) => (
          <RequirementAlertDialog key={rowIndex} requirement={requirement}>
            <TableRow className="cursor-pointer hover:bg-muted/50 transition-colors">
              <TableCell className="font-medium">{requirement.name}</TableCell>
              {traceMatrix[rowIndex].map((cell, colIndex) => (
                <TableCell key={colIndex} className="text-center text-xl">
                  {cell}
                </TableCell>
              ))}
            </TableRow>
          </RequirementAlertDialog>
        ))}
      </TableBody>
    </Table>
  );
}

export default TraceabilityMatrixTable;
