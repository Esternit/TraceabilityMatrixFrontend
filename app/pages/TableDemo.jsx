import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const requirements = [
  "Требование 1",
  "Требование 2",
  "Требование 3",
  "Требование 4",
  "Требование 5",
];

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

export function TraceabilityMatrixTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[180px]">Требования / Тест-кейсы</TableHead>
          {testCases.map((testCase, index) => (
            <TableHead key={index} className="text-center">
              {testCase}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {requirements.map((requirement, rowIndex) => (
          <TableRow key={rowIndex}>
            <TableCell className="font-medium">{requirement}</TableCell>
            {traceMatrix[rowIndex].map((cell, colIndex) => (
              <TableCell key={colIndex} className="text-center text-xl">
                {cell ? "➕" : ""}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default TraceabilityMatrixTable;
