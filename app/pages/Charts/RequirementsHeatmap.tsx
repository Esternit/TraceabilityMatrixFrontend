import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Requirement = {
  id: string;
  description: string;
  testCoverage: Record<string, boolean>;
};

const testCases = ["Test 1", "Test 2", "Test 3"];

const requirements: Requirement[] = [
  {
    id: "R1",
    description: "Логин",
    testCoverage: {
      "Test 1": true,
      "Test 2": false,
      "Test 3": true,
    },
  },
  {
    id: "R2",
    description: "Регистрация",
    testCoverage: {
      "Test 1": false,
      "Test 2": false,
      "Test 3": true,
    },
  },
  {
    id: "R3",
    description: "Сброс пароля",
    testCoverage: {
      "Test 1": true,
      "Test 2": true,
      "Test 3": false,
    },
  },
];

export default function RequirementsHeatmap() {
  return (
    <div className="overflow-auto p-4">
      <h2 className="text-xl font-semibold mb-4">
        Покрытие требований тестами
      </h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Требование</TableHead>
            {testCases.map((test) => (
              <TableHead key={test}>{test}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {requirements.map((req) => (
            <TableRow key={req.id}>
              <TableCell className="font-medium">
                {req.id} — {req.description}
              </TableCell>
              {testCases.map((test) => {
                const covered = req.testCoverage[test];
                return (
                  <TableCell
                    key={test}
                    className={`text-center ${
                      covered ? "bg-green-200" : "bg-red-200"
                    }`}
                  >
                    {covered ? "✅" : "❌"}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
