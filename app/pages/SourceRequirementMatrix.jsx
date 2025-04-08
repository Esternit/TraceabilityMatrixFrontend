import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function SourceRequirementMatrix({ requirements }) {
  const initiators = Array.from(
    new Set(requirements.map((req) => req.initiator))
  );

  const sourceMatrix = initiators.map((initiator) =>
    requirements.map((req) => (req.initiator === initiator ? "➕" : ""))
  );

  // Определим, какие столбцы нужно выделить
  const columnsWithDependencies = requirements.map(
    (req) => req.dependencies.length > 0
  );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[180px]">Источник\Требования</TableHead>
          {requirements.map((requirement, index) => (
            <TableHead
              key={index}
              className={`text-center ${
                columnsWithDependencies[index] ? "bg-yellow-100" : ""
              }`}
            >
              {requirement.name}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {initiators.map((initiator, rowIndex) => (
          <TableRow key={rowIndex}>
            <TableCell className="font-medium">{initiator}</TableCell>
            {sourceMatrix[rowIndex].map((cell, colIndex) => (
              <TableCell
                key={colIndex}
                className={`text-center text-xl ${
                  columnsWithDependencies[colIndex] ? "bg-yellow-100" : ""
                }`}
              >
                {cell}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
