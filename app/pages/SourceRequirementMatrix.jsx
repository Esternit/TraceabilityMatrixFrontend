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

  const sourceMatrix = requirements.map((requirement) =>
    initiators.map((initiator) =>
      requirement.initiator === initiator ? "➕" : ""
    )
  );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[180px]">Требование\Источник</TableHead>
          {initiators.map((initiator, index) => (
            <TableHead key={index} className="text-center">
              {initiator}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {requirements.map((requirement, rowIndex) => {
          const hasDependencies = requirement.dependencies.length > 0;
          return (
            <TableRow key={rowIndex}>
              <TableCell
                className={`font-medium ${
                  hasDependencies ? "bg-yellow-100" : ""
                }`}
              >
                {requirement.name}
              </TableCell>
              {sourceMatrix[rowIndex].map((cell, colIndex) => (
                <TableCell
                  key={colIndex}
                  className={`text-center text-xl ${
                    hasDependencies ? "bg-yellow-100" : ""
                  }`}
                >
                  {cell}
                </TableCell>
              ))}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
