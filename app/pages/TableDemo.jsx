import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
          <TableRow key={rowIndex}>
            <TableCell className="font-medium">{requirement.name}</TableCell>
            {traceMatrix[rowIndex].map((cell, colIndex) => (
              <TableCell key={colIndex} className="text-center text-xl">
                {cell}
              </TableCell>
            ))}
          </TableRow>
        ))}

        {/* <TableRow>
          <TableCell className="font-medium">Важность</TableCell>
          {requirements.map((requirement, index) => (
            <TableCell key={index} className="text-center">
              {requirement.importance}
            </TableCell>
          ))}
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Инициатор</TableCell>
          {requirements.map((requirement, index) => (
            <TableCell key={index} className="text-center">
              {requirement.initiator}
            </TableCell>
          ))}
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Тип инициатора</TableCell>
          {requirements.map((requirement, index) => (
            <TableCell key={index} className="text-center">
              {requirement.initiatorType}
            </TableCell>
          ))}
        </TableRow> */}
      </TableBody>
    </Table>
  );
}

export default TraceabilityMatrixTable;
